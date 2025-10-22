import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Wellness IV Drip - Mobile IV Vitamin Therapy Service",
  description: "Professional mobile IV vitamin therapy service in Canberra. Bespoke IV drips delivered in comfort by qualified nurses. Official licensee of IV League Drips.",
  keywords: "IV therapy, vitamin drips, mobile IV, wellness, Canberra, hydration therapy, energy boost, immunity support",
  authors: [{ name: "Wellness IV Drip" }],
  openGraph: {
    title: "Wellness IV Drip - Mobile IV Vitamin Therapy Service",
    description: "Professional mobile IV vitamin therapy service in Canberra. Bespoke IV drips delivered in comfort.",
    type: "website",
    locale: "en_AU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
