import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "OtoVizör Ekspertiz | Bağımsız Oto Ekspertiz Hizmeti",
    template: "%s | OtoVizör Ekspertiz",
  },
  description:
    "OtoVizör Ekspertiz ile aracınızı almadan önce gerçeği görün. 120'den fazla kontrol noktası, bağımsız raporlama ve online randevu.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
