import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { COPY } from "@/lib/copy";

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const items = COPY.testimonials.items;

  const next = () => setCurrent((c) => (c + 1) % items.length);
  const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length);

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container">
        <h2 className="mb-14 text-center text-3xl font-bold text-foreground sm:text-4xl">
          {COPY.testimonials.title}
        </h2>

        <div className="mx-auto max-w-3xl">
          {/* Cards */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(${current * 100}%)` }}
            >
              {items.map((item, i) => (
                <div key={i} className="min-w-full px-4">
                  <div className="rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
                    <Quote className="mx-auto mb-4 h-8 w-8 text-primary/30" />
                    <p className="mb-6 text-lg leading-relaxed text-foreground">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted" />
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Previous"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    i === current ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Next"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
