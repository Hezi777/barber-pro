import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { COPY } from "@/lib/copy";

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-secondary/30">
      <div className="container">
        <h2 className="mb-14 text-center text-3xl font-bold text-foreground sm:text-4xl">
          {COPY.faq.title}
        </h2>

        <div className="mx-auto max-w-2xl">
          <Accordion type="single" collapsible className="space-y-3">
            {COPY.faq.items.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-xl border border-border bg-card px-6 shadow-sm"
              >
                <AccordionTrigger className="text-right text-base font-semibold hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
