import type { Metadata } from "next";
import { Providers } from "./providers";
import "../src/index.css";

const themeInitScript = `
(() => {
  try {
    const key = "barber-pro-theme";
    const stored = localStorage.getItem(key);
    const theme =
      stored === "light" || stored === "dark"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  } catch {
    // no-op
  }
})();
`;

export const metadata: Metadata = {
  title: "Barber Pro",
  description: "Barber Pro MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
