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
      <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-5">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePreviousMonth}
            className="p-1.5 rounded-md text-white/60 hover:text-white/90 hover:bg-white/5 transition-all"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-sm font-medium text-white/90">{monthName}</div>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-md text-white/60 hover:text-white/90 hover:bg-white/5 transition-all"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((day, index) => (
            <div key={`${day}-${index}`} className="text-center text-xs text-white/40 font-medium py-1">
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
                    ? "bg-[#dc2626] text-white"
                    : isToday
                      ? "bg-white/10 text-white/90 hover:bg-white/15"
                      : "text-white/60 hover:bg-white/5 hover:text-white/90"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-5">
        <h3 className="text-xs font-medium text-white/50 mb-3">Next appointment</h3>
        <div className="space-y-2">
          <div className="text-2xl font-semibold">
            {loading ? "--:--" : nextAppointment ? formatTimeLabel(nextAppointment.start_time) : "--:--"}
          </div>
          <div className="text-sm font-medium">{loading ? "Loading..." : nextAppointment?.customer_name ?? "No bookings"}</div>
          <div className="text-xs text-white/60">{loading ? " " : nextAppointment?.service ?? " "}</div>
          <div className="flex items-center gap-1.5 text-xs text-white/40 pt-1">
            <Timer className="w-3.5 h-3.5" />
            <span>{loading ? "Fetching..." : getRelativeTimeLabel(nextAppointment)}</span>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-white/50 mb-1">Total appointments</div>
            <div className="text-2xl font-semibold">{loading ? "-" : totalAppointments}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#dc2626]/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-[#dc2626]" />
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-white/50 mb-1">Available hours</div>
            <div className="text-2xl font-semibold">{loading ? "-" : freeHoursLabel}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white/40" />
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-5">
        <h3 className="text-xs font-medium text-white/50 mb-3">Upcoming free slots</h3>
        <div className="space-y-2">
          {loading ? (
            <div className="px-3 py-2 bg-white/[0.03] border border-white/5 rounded-lg text-center text-sm font-medium tabular-nums">
              Loading...
            </div>
          ) : upcomingFreeSlots.length === 0 ? (
            <div className="px-3 py-2 bg-white/[0.03] border border-white/5 rounded-lg text-center text-sm font-medium tabular-nums">
              Fully booked
            </div>
          ) : (
            upcomingFreeSlots.map((slot) => (
              <div
                key={slot}
                className="px-3 py-2 bg-white/[0.03] border border-white/5 rounded-lg text-center text-sm font-medium tabular-nums"
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
