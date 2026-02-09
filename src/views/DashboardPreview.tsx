import Link from "next/link";
import { ArrowRight, Clock, Users, CalendarCheck, Badge as BadgeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { COPY } from "@/lib/copy";

const MOCK_APPOINTMENTS = [
  { time: "10:00", status: "booked", customer: "אבי לוי", service: "תספורת גברים" },
  { time: "10:30", status: "booked", customer: "משה כהן", service: "תספורת + זקן" },
  { time: "11:00", status: "booked", customer: "דוד ישראלי", service: "תספורת גברים" },
  { time: "12:00", status: "booked", customer: "נדב רון", service: "תספורת ילדים" },
  { time: "13:00", status: "free", customer: "", service: "" },
  { time: "14:30", status: "booked", customer: "יוסי כהן", service: "תספורת גברים" },
  { time: "16:00", status: "free", customer: "", service: "" },
  { time: "16:30", status: "free", customer: "", service: "" },
];

const GAPS = ["16:00", "16:30"];

export default function DashboardPreview() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between py-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">{COPY.dashboard.title}</h1>
            <p className="text-xs text-muted-foreground">{COPY.dashboard.previewNote}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="hero" size="sm">{COPY.dashboard.today}</Button>
            <Button variant="secondary" size="sm">{COPY.dashboard.tomorrow}</Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowRight className="ml-1 h-4 w-4" />
                חזרה
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Summary cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <SummaryCard icon={CalendarCheck} label={COPY.dashboard.appointmentsToday} value="12" />
          <SummaryCard icon={Clock} label={COPY.dashboard.freeSlots} value="4" />
          <SummaryCard icon={Users} label={COPY.dashboard.nextAppointment} value="14:30" highlight />
        </div>

        {/* Next appointment */}
        <div className="mb-8 rounded-2xl border-2 border-primary/20 bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{COPY.dashboard.nextAppointment}</p>
              <p className="text-4xl font-extrabold text-foreground">14:30</p>
              <p className="mt-1 font-medium text-foreground">יוסי כהן</p>
              <p className="text-sm text-muted-foreground">תספורת גברים</p>
              <p className="mt-2 text-xs text-primary font-medium">{COPY.dashboard.inMinutes}</p>
            </div>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button variant="success" size="sm" disabled>
                      {COPY.dashboard.confirmBtn}
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>{COPY.dashboard.previewOnly}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button variant="dangerOutline" size="sm" disabled>
                      {COPY.dashboard.cancelBtn}
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>{COPY.dashboard.previewOnly}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Timeline */}
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-lg font-bold text-foreground">לוח תורים — היום</h2>
            <div className="space-y-3">
              {MOCK_APPOINTMENTS.map((apt, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm"
                >
                  <span className="min-w-[50px] text-lg font-bold text-foreground">{apt.time}</span>
                  {apt.status === "booked" ? (
                    <>
                      <Badge variant="destructive" className="text-xs">
                        {COPY.dashboard.booked}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{apt.customer}</p>
                        <p className="text-xs text-muted-foreground">{apt.service}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Badge variant="secondary" className="text-xs text-success">
                        {COPY.dashboard.available}
                      </Badge>
                      <p className="flex-1 text-sm text-muted-foreground">—</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Gaps card */}
          <div>
            <h2 className="mb-4 text-lg font-bold text-foreground">{COPY.dashboard.gapsTitle}</h2>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <ul className="mb-4 space-y-2">
                {GAPS.map((time) => (
                  <li key={time} className="flex items-center gap-2 text-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium">{time}</span>
                  </li>
                ))}
              </ul>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="block">
                    <Button variant="heroOutline" size="sm" className="w-full" disabled>
                      {COPY.dashboard.sendFill}
                      <Badge variant="secondary" className="mr-2 text-xs">בקרוב</Badge>
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>{COPY.dashboard.previewOnly}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: typeof CalendarCheck;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border bg-card p-6 shadow-sm ${
        highlight ? "border-primary/30" : "border-border"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${highlight ? "bg-primary/10" : "bg-muted"}`}>
          <Icon className={`h-5 w-5 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}
