import type { Metadata } from "next";
import { Providers } from "./providers";
import "../src/index.css";

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
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
