import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Drink Redeem",
  description: "Redeem your free drink",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


