import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "../../../../../lib/supabaseServer";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function POST(
  _request: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse<{ ok: boolean; data?: unknown; error?: string; details?: unknown }>> {
  const id = params.id?.trim();
  if (!id) {
    return NextResponse.json({ ok: false, error: "Appointment id is required." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("appointments")
      .update({ status: "CONFIRMED" })
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: "Failed to confirm appointment.",
          details: error,
        },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json({ ok: false, error: "Appointment not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("Unhandled POST /api/appointments/[id]/confirm error", error);
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
