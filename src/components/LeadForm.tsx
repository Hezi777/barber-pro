import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COPY } from "@/lib/copy";

export function LeadForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;

    setStatus("loading");
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section className="py-24">
        <div className="container">
          <div className="mx-auto max-w-md text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <span className="text-3xl">🎉</span>
            </div>
            <p className="text-xl font-bold text-foreground">{COPY.leadForm.success}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24">
      <div className="container">
        <div className="mx-auto max-w-md text-center">
          <h2 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
            {COPY.leadForm.title}
          </h2>
          <p className="mb-10 text-muted-foreground">{COPY.leadForm.subtitle}</p>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="space-y-4">
              <Input
                placeholder={COPY.leadForm.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-right"
                maxLength={100}
              />
              <Input
                placeholder={COPY.leadForm.contactPlaceholder}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                className="text-right"
                maxLength={255}
              />
              <Button
                type="submit"
                variant="hero"
                className="w-full"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  COPY.leadForm.cta
                )}
              </Button>
              {status === "error" && (
                <p className="text-sm text-destructive">{COPY.leadForm.error}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
