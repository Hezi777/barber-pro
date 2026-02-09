import { COPY } from "@/lib/copy";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Logo & tagline */}
          <div className="text-center md:text-right">
            <p className="text-lg font-bold text-foreground">{COPY.brand}</p>
            <p className="text-sm text-muted-foreground">{COPY.tagline}</p>
          </div>

          {/* Links */}
          <div className="flex gap-6">
            {[COPY.footer.privacy, COPY.footer.terms, COPY.footer.contact].map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Social icons (placeholders) */}
          <div className="flex gap-3">
            {["WhatsApp", "Instagram", "LinkedIn"].map((name) => (
              <div
                key={name}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground"
                title={name}
              >
                {name[0]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
