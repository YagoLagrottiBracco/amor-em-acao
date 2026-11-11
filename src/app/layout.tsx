import type { Metadata, Viewport } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import "./globals.css";
import {
  SITE_CONFIG,
  buildMetadata,
  getOrganizationJsonLd,
  getWebsiteJsonLd,
} from "@/lib/seo";
import { DonateProvider } from "@/components/DonateContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-dm-sans",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: SITE_CONFIG.themeColor,
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  ...buildMetadata({
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    path: "/",
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = getOrganizationJsonLd();
  const websiteSchema = getWebsiteJsonLd();

  return (
    <html
      lang="pt-BR"
      className={`scroll-smooth ${dmSans.variable} ${manrope.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <DonateProvider>
          <Header />
          <main className="flex-grow page-fade">{children}</main>
          <Footer />
        </DonateProvider>
      </body>
    </html>
  );
}
