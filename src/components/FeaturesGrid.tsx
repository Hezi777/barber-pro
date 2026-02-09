import { CalendarCheck, LayoutList, ShieldCheck, MessageSquare, BellRing, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { COPY } from "@/lib/copy";

const icons = [CalendarCheck, LayoutList, ShieldCheck, MessageSquare, BellRing, BarChart3];

export function FeaturesGrid() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container">
        <h2 className="mb-14 text-center text-3xl font-bold text-foreground sm:text-4xl">
          {COPY.features.title}
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COPY.features.items.map((feature, i) => {
            const Icon = icons[i];
            return (
              <div
                key={i}
                className="card-hover rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  {feature.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
