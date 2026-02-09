import { Calendar, ChevronLeft, ChevronRight, Clock, Timer } from "lucide-react";
import type { CalendarAppointment } from "@/components/CalendarDayView";

const DASHBOARD_LOCALE = "en-US";

interface SidebarSummaryProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  nextAppointment: CalendarAppointment | null;
  totalAppointments: number;
  freeHoursLabel: string;
  upcomingFreeSlots: string[];
  loading: boolean;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function SidebarSummary({
  selectedDate,
  onDateChange,
  nextAppointment,
  totalAppointments,
  freeHoursLabel,
  upcomingFreeSlots,
  loading,
}: SidebarSummaryProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const monthName = selectedDate.toLocaleDateString(DASHBOARD_LOCALE, {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days: Array<number | null> = [];
  for (let i = 0; i < startingDayOfWeek; i += 1) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(day);
  }

  const handlePreviousMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateChange(newDate);
  };

  const handleDayClick = (day: number) => {
    onDateChange(new Date(currentYear, currentMonth, day));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePreviousMonth}
            className="rounded-md p-1.5 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-sm font-medium">{monthName}</div>
          <button
            onClick={handleNextMonth}
            className="rounded-md p-1.5 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((day, index) => (
            <div key={`${day}-${index}`} className="py-1 text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dayDate = new Date(currentYear, currentMonth, day);
            dayDate.setHours(0, 0, 0, 0);

            const selectedDay = new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
            ).getTime();
            const isSelected = dayDate.getTime() === selectedDay;
            const isToday = dayDate.getTime() === today.getTime();

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : isToday
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-3 text-xs font-medium text-muted-foreground">Next appointment</h3>
        <div className="space-y-2">
          <div className="text-2xl font-semibold">
            {loading ? "--:--" : nextAppointment ? formatTimeLabel(nextAppointment.start_time) : "--:--"}
          </div>
          <div className="text-sm font-medium">{loading ? "Loading..." : nextAppointment?.customer_name ?? "No bookings"}</div>
          <div className="text-xs text-muted-foreground">{loading ? " " : nextAppointment?.service ?? " "}</div>
          <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
            <Timer className="w-3.5 h-3.5" />
            <span>{loading ? "Fetching..." : getRelativeTimeLabel(nextAppointment)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-1 text-xs text-muted-foreground">Total appointments</div>
            <div className="text-2xl font-semibold">{loading ? "-" : totalAppointments}</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-1 text-xs text-muted-foreground">Available hours</div>
            <div className="text-2xl font-semibold">{loading ? "-" : freeHoursLabel}</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/70">
            <Clock className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-3 text-xs font-medium text-muted-foreground">Upcoming free slots</h3>
        <div className="space-y-2">
          {loading ? (
            <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-center text-sm font-medium tabular-nums">
              Loading...
            </div>
          ) : upcomingFreeSlots.length === 0 ? (
            <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-center text-sm font-medium tabular-nums">
              Fully booked
            </div>
          ) : (
            upcomingFreeSlots.map((slot) => (
              <div
                key={slot}
                className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-center text-sm font-medium tabular-nums"
              >
                {slot}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function formatTimeLabel(iso: string): string {
  const date = new Date(iso);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function getRelativeTimeLabel(appointment: CalendarAppointment | null): string {
  if (!appointment) {
    return "No upcoming appointments";
  }

  const diffMinutes = Math.round((new Date(appointment.start_time).getTime() - Date.now()) / 60000);
  if (diffMinutes <= 0) {
    return "Starting soon";
  }

  if (diffMinutes < 60) {
    return `In ${diffMinutes} min`;
  }

  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  return mins > 0 ? `In ${hours}h ${mins}m` : `In ${hours}h`;
}
