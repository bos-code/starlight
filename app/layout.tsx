import type { Metadata } from "next";
import { Inter, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { QuoteProvider } from "@/lib/quote-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Starlite Tools | Digital Showroom & Dealer Quote System",
  description:
    "Starlite Tools Company Limited — power tools, hand tools, welding equipment, safety products and industrial supplies for dealers, technicians and contractors across Nigeria. Browse the catalogue and request a quote on WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-brand-graphite text-brand-white">
        <QuoteProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </QuoteProvider>
      </body>
    </html>
  );
}
