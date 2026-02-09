import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseServer";

interface RouteContext {
  params: {
    phone: string;
  };
}

function resolvePhoneParam(rawPhone: string | undefined): string {
  return decodeURIComponent(rawPhone ?? "").trim();
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse<{ ok: boolean; data?: unknown; error?: string; details?: unknown }>> {
  const phone = resolvePhoneParam(params.phone);
  if (!phone) {
    return NextResponse.json({ ok: false, error: "Phone is required." }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("phone", phone)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: "Failed to fetch conversation.",
          details: error,
        },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json({ ok: false, error: "Conversation not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("Unhandled GET /api/conversations/[phone] error", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Unexpected server error.",
        details: error,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse<{ ok: boolean; data?: unknown; error?: string; details?: unknown }>> {
  const phone = resolvePhoneParam(params.phone);
  if (!phone) {
    return NextResponse.json({ ok: false, error: "Phone is required." }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("conversations")
      .update({
        state: "NEW",
        context: {},
        updated_at: new Date().toISOString(),
      })
      .eq("phone", phone)
      .select("*")
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: "Failed to reset conversation.",
          details: error,
        },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json({ ok: false, error: "Conversation not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("Unhandled DELETE /api/conversations/[phone] error", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Unexpected server error.",
        details: error,
      },
      { status: 500 },
    );
  }
}
