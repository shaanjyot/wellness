import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { getSupabaseAdmin } from "@/lib/supabase";
import Providers from "@/components/Providers";

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
  let settings: any = null;
  try {
    const { data } = await getSupabaseAdmin()
      .from('site_settings')
      .select('*')
      .single();
    settings = data;
  } catch (e) {
    // Settings fetch failed - continue rendering without injected scripts
    console.error('Failed to fetch site settings:', e);
  }

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
        <Providers>
          {children}
        </Providers>
        {settings?.footer_scripts && (
          <div dangerouslySetInnerHTML={{ __html: settings.footer_scripts }} />
        )}
      </body>
    </html>
  );
}
