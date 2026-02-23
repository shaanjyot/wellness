import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { supabaseAdmin } from "@/lib/supabase";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch settings for scripts
  const { data: settings } = await supabaseAdmin
    .from('site_settings')
    .select('*')
    .single();

  return (
    <html lang="en">
      <head>
        {/* Google Ads Auto Ads */}
        {settings?.google_ads_client && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.google_ads_client}`}
            crossOrigin="anonymous"
          />
        )}

        {settings?.header_scripts && (
          <script dangerouslySetInnerHTML={{ __html: settings.header_scripts }} />
        )}
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        {children}
        {settings?.footer_scripts && (
          <div dangerouslySetInnerHTML={{ __html: settings.footer_scripts }} />
        )}
      </body>
    </html>
  );
}
