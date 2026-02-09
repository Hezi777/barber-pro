"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CalendarDayView, { type CalendarAppointment } from "@/components/CalendarDayView";
import { SidebarSummary } from "@/components/dashboard/SidebarSummary";
import { TopBar } from "@/components/dashboard/TopBar";

interface AppointmentsResponse {
  ok: boolean;
  data?: CalendarAppointment[];
  error?: string;
}

const START_HOUR = 8;
const END_HOUR = 20;
const SLOT_MINUTES = 30;

export default function DashboardPreview() {
  const [selectedDate, setSelectedDate] = useState(() => startOfLocalDay(new Date()));
  const selectedDateKey = useMemo(() => formatDateForApi(selectedDate), [selectedDate]);

  const {
    data: appointments = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["appointments", selectedDateKey],
    queryFn: async (): Promise<CalendarAppointment[]> => {
      const response = await fetch(`/api/appointments?date=${selectedDateKey}`, { cache: "no-store" });
      const result = (await response.json()) as AppointmentsResponse;

      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "Failed to load appointments.");
      }

      return Array.isArray(result.data) ? result.data : [];
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
  });

  const sortedAppointments = useMemo(
    () =>
      [...appointments].sort(
        (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
      ),
    [appointments],
  );

  const visibleAppointments = useMemo(
    () => sortedAppointments.filter((appointment) => appointment.status !== "CANCELED"),
    [sortedAppointments],
  );

  const nextAppointment = useMemo(() => {
    if (visibleAppointments.length === 0) {
      return null;
    }

    if (isSameLocalDay(selectedDate, new Date())) {
      const now = Date.now();
      return (
        visibleAppointments.find((appointment) => new Date(appointment.start_time).getTime() >= now) ?? null
      );
    }

    return visibleAppointments[0] ?? null;
  }, [visibleAppointments, selectedDate]);

  const freeSlotSummary = useMemo(() => {
    const totalSlots = ((END_HOUR - START_HOUR) * 60) / SLOT_MINUTES;
    const occupiedSlots = new Set<number>();

    for (const appointment of visibleAppointments) {
      const start = new Date(appointment.start_time);
      const minutesOfDay = start.getHours() * 60 + start.getMinutes();
      const slotIndex = Math.floor((minutesOfDay - START_HOUR * 60) / SLOT_MINUTES);

      if (slotIndex >= 0 && slotIndex < totalSlots) {
        occupiedSlots.add(slotIndex);
      }
    }

    const freeSlots: number[] = [];
    for (let slot = 0; slot < totalSlots; slot += 1) {
      if (!occupiedSlots.has(slot)) {
        freeSlots.push(slot);
      }
    }

    const freeHours = freeSlots.length / 2;
    const freeHoursLabel = Number.isInteger(freeHours) ? `${freeHours}` : freeHours.toFixed(1);
    const upcomingFreeSlots = freeSlots.slice(0, 3).map((slot) => formatSlotTime(slot));

    return { freeHoursLabel, upcomingFreeSlots };
  }, [visibleAppointments]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar
        selectedDate={selectedDate}
        onRefresh={() => {
          void refetch();
        }}
        isRefreshing={isFetching}
      />

      <main className="mx-auto max-w-[1450px] px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
          <div>
            {isLoading ? (
              <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
                Loading appointments...
              </div>
            ) : isError ? (
              <div className="rounded-xl border border-destructive/30 bg-card p-5 text-sm text-destructive">
                {error instanceof Error ? error.message : "Failed to load appointments."}
              </div>
            ) : (
              <CalendarDayView appointments={sortedAppointments} />
            )}
          </div>

          <SidebarSummary
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            nextAppointment={nextAppointment}
            totalAppointments={visibleAppointments.length}
            freeHoursLabel={freeSlotSummary.freeHoursLabel}
            upcomingFreeSlots={freeSlotSummary.upcomingFreeSlots}
            loading={isLoading}
          />
        </div>
      </main>
    </div>
  );
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatSlotTime(slotIndex: number): string {
  const totalMinutes = START_HOUR * 60 + slotIndex * SLOT_MINUTES;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
