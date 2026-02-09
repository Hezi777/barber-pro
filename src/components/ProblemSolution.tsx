import { MessageSquareX, Clock, CalendarX, Zap, Check, Bot, BellRing, LayoutDashboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { COPY } from "@/lib/copy";

const problemIcons = [MessageSquareX, Clock, CalendarX, Zap];
const solutionIcons = [Bot, Check, BellRing, LayoutDashboard];

export function ProblemSolution() {
  return (
    <section id="benefits" className="py-24">
      <div className="container">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Problem card */}
          <div className="card-hover rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h3 className="mb-6 text-2xl font-bold text-foreground">{COPY.problem.title}</h3>
            <ul className="space-y-4">
              {COPY.problem.points.map((point, i) => {
                const Icon = problemIcons[i];
                return (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                      <Icon className="h-4 w-4 text-destructive" />
                    </div>
                    {point}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Solution card */}
          <div className="card-hover rounded-2xl border border-primary/20 bg-card p-8 shadow-sm">
            <h3 className="mb-6 text-2xl font-bold text-foreground">{COPY.solution.title}</h3>
            <ul className="space-y-4">
              {COPY.solution.points.map((point, i) => {
                const Icon = solutionIcons[i];
                return (
                  <li key={i} className="flex items-center gap-3 text-foreground">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="flex items-center gap-2">
                      {point.text}
                      {point.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {point.badge}
                        </Badge>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
