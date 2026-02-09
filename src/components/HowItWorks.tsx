import { Smartphone, Settings, MessageCircle, LayoutDashboard } from "lucide-react";
import { COPY } from "@/lib/copy";

const icons = [Smartphone, Settings, MessageCircle, LayoutDashboard];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container">
        <h2 className="mb-14 text-center text-3xl font-bold text-foreground sm:text-4xl">
          {COPY.howItWorks.title}
        </h2>

        <div className="relative">
          {/* Connecting line - desktop */}
          <div className="absolute top-12 right-[10%] left-[10%] hidden h-0.5 bg-gradient-to-l from-primary/20 via-primary/40 to-primary/20 md:block" />

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            {COPY.howItWorks.steps.map((step, i) => {
              const Icon = icons[i];
              return (
                <div key={i} className="relative flex flex-col items-center text-center">
                  {/* Number badge */}
                  <div className="relative z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="mb-1 text-xs font-bold text-primary">
                    {String(step.number).padStart(2, "0")}
                  </span>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
