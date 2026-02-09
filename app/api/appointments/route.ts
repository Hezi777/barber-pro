import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseServer";

function getUtcDayRange(date: string): { start: string; end: string } {
  const startDate = new Date(`${date}T00:00:00.000Z`);
  const endDate = new Date(startDate);
  endDate.setUTCDate(endDate.getUTCDate() + 1);
  return {
    start: startDate.toISOString(),
    end: endDate.toISOString(),
  };
}

export async function GET(
  request: NextRequest,
): Promise<NextResponse<{ ok: boolean; data?: unknown; error?: string; details?: unknown }>> {
  const dateParam = request.nextUrl.searchParams.get("date");

  if (dateParam && !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid 'date' format. Use YYYY-MM-DD.",
      },
      { status: 400 },
    );
  }

  try {
    if (dateParam) {
      const range = getUtcDayRange(dateParam);
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .gte("start_time", range.start)
        .lt("start_time", range.end)
        .order("start_time", { ascending: true });

      if (error) {
        return NextResponse.json(
          {
            ok: false,
            error: "Failed to fetch appointments.",
            details: error,
          },
          { status: 500 },
        );
      }

      return NextResponse.json({ ok: true, data: data ?? [] });
    }

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("start_time", { ascending: false });

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: "Failed to fetch appointments.",
          details: error,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, data: data ?? [] });
  } catch (error) {
    console.error("Unhandled GET /api/appointments error", error);
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
