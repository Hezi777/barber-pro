import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/copy";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center pt-16">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-primary" />
            {COPY.hero.badge}
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl animate-fade-up">
            {COPY.hero.headline}
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground animate-fade-up" style={{ animationDelay: "0.1s" }}>
            {COPY.hero.subheadline}
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <Button variant="hero" size="lg" className="min-w-[200px] text-base">
              {COPY.hero.cta}
            </Button>
            <Button variant="heroOutline" size="lg" asChild className="min-w-[200px] text-base">
              <Link to="/dashboard-preview">
                {COPY.hero.secondaryCta}
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Social proof logos */}
          <div className="mt-16 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <p className="mb-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              מוכר לקהילת הברברים
            </p>
            <div className="flex items-center justify-center gap-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-8 w-20 rounded-md bg-muted opacity-40"
                />
              ))}
            </div>
          </div>

          {/* Stat pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {COPY.hero.stats.map((stat) => (
              <span
                key={stat}
                className="rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground"
              >
                {stat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
