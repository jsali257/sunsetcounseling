import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { EmergencyNotice } from "./EmergencyNotice";
import { MobileCTABar } from "./MobileCTABar";
import { JsonLd, practiceSchema, websiteSchema } from "@/lib/structured-data";

/** Header, emergency notice, and footer shared by every public page. */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-ink-900 px-5 py-3 text-cream-50 focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to main content
      </a>
      <JsonLd data={practiceSchema()} />
      <JsonLd data={websiteSchema()} />
      <Navbar />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <EmergencyNotice />
      <Footer />
      <MobileCTABar />
    </>
  );
}
