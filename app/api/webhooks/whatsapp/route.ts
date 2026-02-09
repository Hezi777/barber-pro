import { NextRequest, NextResponse } from "next/server";
import { buildAppointmentStartTime, processMessage } from "../../../../lib/stateMachine";
import { getSupabaseClient } from "../../../../lib/supabaseServer";
import type {
  AppointmentRow,
  Json,
  WhatsAppWebhookRequest,
  WhatsAppWebhookResponse,
} from "../../../../lib/types";

interface ValidationResult {
  valid: boolean;
  data?: WhatsAppWebhookRequest;
  error?: string;
}

function isValidE164Phone(phone: string): boolean {
  return /^\+[1-9]\d{7,14}$/.test(phone);
}

function parseWebhookPayload(payload: unknown): ValidationResult {
  if (!payload || typeof payload !== "object") {
    return { valid: false, error: "Request body must be a JSON object." };
  }

  const input = payload as Record<string, unknown>;
  if (typeof input.from !== "string" || !input.from.trim()) {
    return { valid: false, error: "'from' is required and must be a non-empty string." };
  }

  if (!isValidE164Phone(input.from.trim())) {
    return { valid: false, error: "'from' must be a valid E.164 phone number." };
  }

  if (typeof input.body !== "string" || !input.body.trim()) {
    return { valid: false, error: "'body' is required and must be a non-empty string." };
  }

  const parsed: WhatsAppWebhookRequest = {
    from: input.from.trim(),
    body: input.body.trim(),
    timestamp: typeof input.timestamp === "string" ? input.timestamp : undefined,
    provider: typeof input.provider === "string" ? input.provider : undefined,
    raw: input.raw as Json | undefined,
  };

  return { valid: true, data: parsed };
}

function jsonError(
  status: number,
  error: string,
  details?: unknown,
): NextResponse<WhatsAppWebhookResponse> {
  return NextResponse.json(
    {
      ok: false,
      error,
      details,
    },
    { status },
  );
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<WhatsAppWebhookResponse>> {
  let rawPayload: unknown;

  try {
    rawPayload = await request.json();
  } catch (error) {
    return jsonError(400, "Invalid JSON payload.", error);
  }

  const validation = parseWebhookPayload(rawPayload);
  if (!validation.valid || !validation.data) {
    return jsonError(400, validation.error ?? "Invalid request body.");
  }

  const payload = validation.data;
  const phone = payload.from;
  const incomingBody = payload.body;

  try {
    const supabase = getSupabaseClient();

    const { error: inMessageError } = await supabase.from("messages").insert({
      phone,
      direction: "IN",
      body: incomingBody,
      raw_payload: (payload.raw ?? rawPayload) as Json,
    });

    if (inMessageError) {
      return jsonError(500, "Failed to save incoming message.", inMessageError);
    }

    const { error: customerUpsertError } = await supabase.from("customers").upsert(
      {
        phone,
      },
      { onConflict: "phone" },
    );

    if (customerUpsertError) {
      return jsonError(500, "Failed to upsert customer.", customerUpsertError);
    }

    const { data: existingConversation, error: conversationReadError } = await supabase
      .from("conversations")
      .select("*")
      .eq("phone", phone)
      .maybeSingle();

    if (conversationReadError) {
      return jsonError(500, "Failed to load conversation.", conversationReadError);
    }

    let conversation = existingConversation;
    if (!conversation) {
      const { data: createdConversation, error: conversationCreateError } = await supabase
        .from("conversations")
        .insert({
          phone,
          state: "NEW",
          context: {},
        })
        .select("*")
        .single();

      if (conversationCreateError) {
        return jsonError(500, "Failed to create conversation.", conversationCreateError);
      }

      conversation = createdConversation;
    }

    if (!conversation) {
      return jsonError(500, "Failed to initialize conversation.");
    }

    const stateResult = processMessage(
      conversation.state,
      conversation.context ?? {},
      incomingBody,
    );

    const { error: conversationUpdateError } = await supabase
      .from("conversations")
      .update({
        state: stateResult.newState,
        context: stateResult.newContext,
        updated_at: new Date().toISOString(),
      })
      .eq("phone", phone);

    if (conversationUpdateError) {
      return jsonError(500, "Failed to update conversation.", conversationUpdateError);
    }

    let createdOrExistingAppointment: AppointmentRow | null = null;
    if (stateResult.newState === "CONFIRMED") {
      const startTime = buildAppointmentStartTime(stateResult.newContext);
      if (!startTime) {
        return jsonError(
          500,
          "Conversation reached CONFIRMED without valid day/time in context.",
          stateResult.newContext,
        );
      }

      const service = stateResult.newContext.service ?? "haircut";
      const customerName = stateResult.newContext.customerName ?? "Guest";

      const { data: existingAppointment, error: existingAppointmentError } = await supabase
        .from("appointments")
        .select("*")
        .eq("phone", phone)
        .eq("service", service)
        .eq("start_time", startTime)
        .neq("status", "CANCELED")
        .maybeSingle();

      if (existingAppointmentError) {
        return jsonError(500, "Failed to check for existing appointment.", existingAppointmentError);
      }

      if (existingAppointment) {
        createdOrExistingAppointment = existingAppointment;
      } else {
        const { data: createdAppointment, error: appointmentInsertError } = await supabase
          .from("appointments")
          .insert({
            phone,
            customer_name: customerName,
            service,
            start_time: startTime,
            status: "PENDING",
          })
          .select("*")
          .single();

        if (appointmentInsertError) {
          return jsonError(500, "Failed to create appointment.", appointmentInsertError);
        }
        createdOrExistingAppointment = createdAppointment;
      }

      const { error: resetConversationError } = await supabase
        .from("conversations")
        .update({
          state: "NEW",
          context: {},
          updated_at: new Date().toISOString(),
        })
        .eq("phone", phone);

      if (resetConversationError) {
        return jsonError(500, "Failed to reset conversation after confirmation.", resetConversationError);
      }
    }

    const { error: outMessageError } = await supabase.from("messages").insert({
      phone,
      direction: "OUT",
      body: stateResult.replyText,
      raw_payload: null,
    });

    if (outMessageError) {
      return jsonError(500, "Failed to save outgoing message.", outMessageError);
    }

    return NextResponse.json({
      ok: true,
      replyText: stateResult.replyText,
      appointment: createdOrExistingAppointment,
    } as WhatsAppWebhookResponse & { appointment?: AppointmentRow | null });
  } catch (error) {
    console.error("Unhandled webhook processing error", error);
    return jsonError(500, "Unexpected server error.", error);
  }
}
