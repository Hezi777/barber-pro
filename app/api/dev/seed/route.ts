import { NextResponse } from "next/server";
import { getSupabaseClient } from "../../../../lib/supabaseServer";
import type { AppointmentStatus, ConversationState, MessageDirection } from "../../../../lib/types";

type InsertedCounts = {
  customers: number;
  conversations: number;
  appointments: number;
  messages: number;
};

type SeedResponse = {
  ok: boolean;
  inserted?: InsertedCounts;
  error?: string;
  details?: unknown;
};

function toIso(date: Date): string {
  return date.toISOString();
}

function buildAppointmentTimes(): string[] {
  const now = new Date();

  const plusOneHour = new Date(now.getTime() + 60 * 60 * 1000);
  const plusThreeHours = new Date(now.getTime() + 3 * 60 * 60 * 1000);

  const tomorrowMorning = new Date(now);
  tomorrowMorning.setDate(tomorrowMorning.getDate() + 1);
  tomorrowMorning.setHours(10, 0, 0, 0);

  const tomorrowNoon = new Date(now);
  tomorrowNoon.setDate(tomorrowNoon.getDate() + 1);
  tomorrowNoon.setHours(12, 30, 0, 0);

  const tomorrowAfternoon = new Date(now);
  tomorrowAfternoon.setDate(tomorrowAfternoon.getDate() + 1);
  tomorrowAfternoon.setHours(15, 30, 0, 0);

  return [
    toIso(plusOneHour),
    toIso(plusThreeHours),
    toIso(tomorrowMorning),
    toIso(tomorrowNoon),
    toIso(tomorrowAfternoon),
  ];
}

export async function POST(): Promise<NextResponse<SeedResponse>> {
  // DEV/DEMO route only: do not expose this in production.
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        ok: false,
        error: "Seed endpoint is disabled in production.",
      },
      { status: 403 },
    );
  }

  try {
    const supabase = getSupabaseClient();
    const inserted: InsertedCounts = {
      customers: 0,
      conversations: 0,
      appointments: 0,
      messages: 0,
    };

    const customers = [
      { phone: "+972500000001", name: "Demo Customer One" },
      { phone: "+972500000002", name: "Demo Customer Two" },
      { phone: "+972500000003", name: "Demo Customer Three" },
    ];

    for (const customer of customers) {
      const { data: existingCustomers, error: customerLookupError } = await supabase
        .from("customers")
        .select("id")
        .eq("phone", customer.phone)
        .limit(1);

      if (customerLookupError) {
        throw customerLookupError;
      }

      if (!existingCustomers || existingCustomers.length === 0) {
        const { error: customerInsertError } = await supabase.from("customers").insert({
          phone: customer.phone,
          name: customer.name,
        });

        if (customerInsertError) {
          throw customerInsertError;
        }

        inserted.customers += 1;
      }
    }

    const conversations: Array<{
      phone: string;
      state: ConversationState;
      context: Record<string, unknown>;
    }> = [
      { phone: "+972500000001", state: "NEW", context: {} },
      {
        phone: "+972500000002",
        state: "WAIT_TIME",
        context: { service: "Haircut", day: "tomorrow" },
      },
      { phone: "+972500000003", state: "WAIT_NAME", context: { service: "Beard Trim" } },
    ];

    for (const conversation of conversations) {
      const { data: existingConversations, error: conversationLookupError } = await supabase
        .from("conversations")
        .select("id")
        .eq("phone", conversation.phone)
        .limit(1);

      if (conversationLookupError) {
        throw conversationLookupError;
      }

      if (!existingConversations || existingConversations.length === 0) {
        const { error: conversationInsertError } = await supabase.from("conversations").insert({
          phone: conversation.phone,
          state: conversation.state,
          context: conversation.context,
        });

        if (conversationInsertError) {
          throw conversationInsertError;
        }

        inserted.conversations += 1;
      }
    }

    const appointmentTimes = buildAppointmentTimes();
    const appointments: Array<{
      phone: string;
      customer_name: string;
      service: string;
      start_time: string;
      status: AppointmentStatus;
    }> = [
      {
        phone: "+972500000001",
        customer_name: "Demo Customer One",
        service: "Haircut",
        start_time: appointmentTimes[0],
        status: "PENDING",
      },
      {
        phone: "+972500000002",
        customer_name: "Demo Customer Two",
        service: "Beard Trim",
        start_time: appointmentTimes[1],
        status: "CONFIRMED",
      },
      {
        phone: "+972500000003",
        customer_name: "Demo Customer Three",
        service: "Haircut",
        start_time: appointmentTimes[2],
        status: "PENDING",
      },
      {
        phone: "+972500000001",
        customer_name: "Demo Customer One",
        service: "Haircut + Beard",
        start_time: appointmentTimes[3],
        status: "CONFIRMED",
      },
      {
        phone: "+972500000002",
        customer_name: "Demo Customer Two",
        service: "Haircut",
        start_time: appointmentTimes[4],
        status: "PENDING",
      },
    ];

    for (const appointment of appointments) {
      const { data: existingAppointments, error: appointmentLookupError } = await supabase
        .from("appointments")
        .select("id")
        .eq("phone", appointment.phone)
        .eq("service", appointment.service)
        .eq("start_time", appointment.start_time)
        .eq("status", appointment.status)
        .limit(1);

      if (appointmentLookupError) {
        throw appointmentLookupError;
      }

      if (!existingAppointments || existingAppointments.length === 0) {
        const { error: appointmentInsertError } = await supabase
          .from("appointments")
          .insert(appointment);

        if (appointmentInsertError) {
          throw appointmentInsertError;
        }

        inserted.appointments += 1;
      }
    }

    const messages: Array<{ phone: string; direction: MessageDirection; body: string }> = [
      { phone: "+972500000001", direction: "IN", body: "Hi, I want to book a haircut" },
      { phone: "+972500000001", direction: "OUT", body: "Great. Please choose a day." },
      { phone: "+972500000002", direction: "IN", body: "Need beard trim tomorrow" },
      { phone: "+972500000002", direction: "OUT", body: "Available slots: 10:00, 12:30." },
      { phone: "+972500000003", direction: "IN", body: "Book me for tomorrow afternoon" },
    ];

    for (const message of messages) {
      const { data: existingMessages, error: messageLookupError } = await supabase
        .from("messages")
        .select("id")
        .eq("phone", message.phone)
        .eq("direction", message.direction)
        .eq("body", message.body)
        .limit(1);

      if (messageLookupError) {
        throw messageLookupError;
      }

      if (!existingMessages || existingMessages.length === 0) {
        const { error: messageInsertError } = await supabase.from("messages").insert({
          phone: message.phone,
          direction: message.direction,
          body: message.body,
          raw_payload: null,
        });

        if (messageInsertError) {
          throw messageInsertError;
        }

        inserted.messages += 1;
      }
    }

    return NextResponse.json({ ok: true, inserted });
  } catch (error) {
    console.error("Unhandled POST /api/dev/seed error", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to seed demo data.",
        details: error,
      },
      { status: 500 },
    );
  }
}
