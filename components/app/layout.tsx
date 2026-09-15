import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soft Life Club — Oversized Collection",
  description: "Luxury comfort. Expensive peace. Shop the Soft Life Club oversized collection.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
