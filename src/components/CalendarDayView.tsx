import { useMemo } from "react";

type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELED";

export interface CalendarAppointment {
  id: string;
  customer_name: string;
  service: string;
  start_time: string;
  status: AppointmentStatus;
}

interface CalendarDayViewProps {
  appointments: CalendarAppointment[];
}

const START_HOUR = 8;
const END_HOUR = 20;
const SLOT_HEIGHT = 60;
const SLOT_MINUTES = 30;
const BASE_MINUTES = START_HOUR * 60;
const END_MINUTES = END_HOUR * 60;
const APPOINTMENT_HEIGHT = SLOT_HEIGHT - 4;

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = START_HOUR; hour <= END_HOUR; hour += 1) {
    slots.push(`${String(hour).padStart(2, "0")}:00`);
    if (hour < END_HOUR) {
      slots.push(`${String(hour).padStart(2, "0")}:30`);
    }
  }
  return slots;
}

function getMinutesFromIso(iso: string): number {
  const date = new Date(iso);
  return date.getHours() * 60 + date.getMinutes();
}

function formatTimeLabel(iso: string): string {
  const date = new Date(iso);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function getStatusLabel(status: AppointmentStatus): string {
  if (status === "CONFIRMED") {
    return "Confirmed";
  }
  if (status === "PENDING") {
    return "Pending";
  }
  return "Canceled";
}

export default function CalendarDayView({ appointments }: CalendarDayViewProps) {
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  const visibleAppointments = useMemo(
    () =>
      appointments
        .filter((appointment) => appointment.status !== "CANCELED")
        .map((appointment) => {
          const startMinutes = getMinutesFromIso(appointment.start_time);
          const top = ((startMinutes - BASE_MINUTES) / SLOT_MINUTES) * SLOT_HEIGHT;
          return { appointment, startMinutes, top };
        })
        .filter(({ startMinutes }) => startMinutes >= BASE_MINUTES && startMinutes <= END_MINUTES)
        .sort((a, b) => a.startMinutes - b.startMinutes),
    [appointments],
  );

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative">
        <div className="relative">
          {timeSlots.map((time) => (
            <div
              key={time}
              className="flex items-start border-b border-border/70"
              style={{ height: `${SLOT_HEIGHT}px` }}
            >
              <div className="w-20 flex-shrink-0 px-4 py-2 text-sm font-medium tabular-nums text-muted-foreground">
                {time}
              </div>

              <div className="flex-1 relative h-full">
                <div className="absolute inset-0 border-r border-border/70" />
              </div>
            </div>
          ))}
        </div>

        <div className="absolute top-0 right-0 left-20 bottom-0 pointer-events-none">
          <div className="relative h-full">
            {visibleAppointments.map(({ appointment, top }) => {
              const isConfirmed = appointment.status === "CONFIRMED";

              return (
                <div
                  key={appointment.id}
                  className="absolute right-2 left-2 pointer-events-auto cursor-pointer"
                  style={{ top: `${top}px`, height: `${APPOINTMENT_HEIGHT}px` }}
                >
                  <div
                    className={`h-full rounded-lg p-3 border transition-all hover:scale-[1.02] ${
                      isConfirmed
                        ? "bg-[#16a34a]/10 border-[#16a34a]/30 hover:bg-[#16a34a]/15"
                        : "bg-[#dc2626]/10 border-[#dc2626]/30 hover:bg-[#dc2626]/15"
                    }`}
                    dir="rtl"
                  >
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className={`font-semibold text-sm ${isConfirmed ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                          {appointment.customer_name}
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">{appointment.service}</div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className={`text-xs tabular-nums ${isConfirmed ? "text-[#22c55e]/70" : "text-[#ef4444]/70"}`}>
                          {formatTimeLabel(appointment.start_time)}
                        </div>
                        <div
                          className={`text-xs px-2 py-0.5 rounded ${
                            isConfirmed ? "bg-[#16a34a]/20 text-[#22c55e]" : "bg-[#dc2626]/20 text-[#ef4444]"
                          }`}
                        >
                          {getStatusLabel(appointment.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
