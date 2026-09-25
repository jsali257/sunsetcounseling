import type { Metadata, Viewport } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Counseling in McAllen, TX`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "counseling McAllen TX",
    "counselor McAllen",
    "bilingual counseling",
    "Spanish-speaking counselor",
    "consejería en español McAllen",
    "telehealth counseling Texas",
    "Licensed Professional Counselor",
    "Rio Grande Valley counseling",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["es_US"],
    url: "/",
    siteName: site.name,
    title: `${site.name} | Counseling in McAllen, TX`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Counseling in McAllen, TX`,
    description: site.description,
  },
  formatDetection: { telephone: true, address: true, email: true },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#faf4ec",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Enables scroll-reveal styles only when JavaScript is running. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        {children}
      </body>
    </html>
  );
}
