import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soft Life Club — Love, Escapes, Wardrobe & Society",
  description: "Explore the four sides of SLC. Join the waitlist for Love, Escapes, Wardrobe and Society, or share a partnership idea.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
