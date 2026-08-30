import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PT Kalimantan Prima Persada — Safety Dashboard",
  description: "Program Kerja Plant Safety & Form Inspeksi K3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
