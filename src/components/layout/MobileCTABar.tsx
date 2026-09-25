import { Phone, CalendarCheck } from "lucide-react";
import { site, ctaLinks } from "@/content/site";
import Link from "next/link";

/** Persistent, understated appointment actions on phones. */
export function MobileCTABar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-sand-200 bg-cream-100/92 px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden">
      <div className="flex gap-2.5">
        <a
          href={site.phone.href}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-ink-900/20 bg-cream-50 text-[0.9375rem] font-medium text-ink-900"
        >
          <Phone aria-hidden="true" className="h-4 w-4 text-terracotta-600" />
          Call
        </a>
        <Link
          href={ctaLinks.appointment}
          className="inline-flex min-h-12 flex-[1.8] items-center justify-center gap-2 rounded-full bg-terracotta-700 text-[0.9375rem] font-medium text-cream-50"
        >
          <CalendarCheck aria-hidden="true" className="h-4 w-4" />
          Request Appointment
        </Link>
      </div>
    </div>
  );
}
