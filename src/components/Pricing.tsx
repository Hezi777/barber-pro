import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/copy";

export function Pricing() {
  const { starter, pro } = COPY.pricing;

  return (
    <section id="pricing" className="py-24">
      <div className="container">
        <h2 className="mb-14 text-center text-3xl font-bold text-foreground sm:text-4xl">
          {COPY.pricing.title}
        </h2>

        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
          {/* Starter */}
          <div className="card-hover rounded-2xl border border-border bg-card p-8 shadow-sm">
            <Badge variant="secondary" className="mb-4">{starter.badge}</Badge>
            <h3 className="text-2xl font-bold text-foreground">{starter.title}</h3>
            <p className="mb-4 text-sm text-muted-foreground">{starter.subtitle}</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-foreground">{starter.price}</span>
              <span className="text-muted-foreground">/{starter.period}</span>
            </div>
            <ul className="mb-8 space-y-3">
              {starter.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant="heroOutline" className="w-full">
              {starter.cta}
            </Button>
          </div>

          {/* Pro */}
          <div className="card-hover relative rounded-2xl border-2 border-primary bg-card p-8 shadow-lg shadow-primary/10 md:-mt-4 md:mb-4">
            <Badge className="mb-4 bg-primary text-primary-foreground">{pro.badge}</Badge>
            <h3 className="text-2xl font-bold text-foreground">{pro.title}</h3>
            <p className="mb-4 text-sm text-muted-foreground">{pro.subtitle}</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-foreground">{pro.price}</span>
              <span className="text-muted-foreground">/{pro.period}</span>
            </div>
            <ul className="mb-8 space-y-3">
              {pro.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant="hero" className="w-full">
              {pro.cta}
            </Button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {COPY.pricing.note}
        </p>
      </div>
    </section>
  );
}
