import Link from "next/link";
import { ArrowRight, CircleAlert } from "lucide-react";
import { emergencyNotice } from "@/content/site";
import { Container } from "@/components/ui/Container";

/** Always-visible emergency and informational notice, rendered directly above the footer. */
export function EmergencyNotice() {
  return (
    <aside aria-labelledby="emergency-heading" className="bg-sand-100">
      <Container className="py-8 sm:py-10">
        <div className="grid gap-5 rounded-2xl border border-terracotta-300/50 bg-cream-50 p-6 sm:p-8 md:grid-cols-[auto_1fr] md:gap-7">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-peach-100 text-terracotta-700">
            <CircleAlert aria-hidden="true" className="h-5 w-5" />
          </div>
          <div className="space-y-3">
            <h2 id="emergency-heading" className="font-sans text-base font-semibold text-ink-900">
              If this is an emergency
            </h2>
            <p className="text-[0.975rem] leading-relaxed text-ink-800">
              If you are experiencing a mental health emergency or believe you may be in immediate
              danger, <strong className="font-semibold">call <a href="tel:911" className="underline decoration-terracotta-400 underline-offset-4">911</a></strong> or
              go to the nearest emergency department. In the United States, you may also{" "}
              <strong className="font-semibold">
                call or text{" "}
                <a href="tel:988" className="underline decoration-terracotta-400 underline-offset-4">
                  988
                </a>
              </strong>{" "}
              to reach the Suicide &amp; Crisis Lifeline.
            </p>
            <p>
              <Link
                href="/crisis-resources"
                className="inline-flex min-h-10 items-center gap-1.5 text-[0.975rem] font-medium text-terracotta-800 underline decoration-terracotta-300 underline-offset-4 hover:decoration-terracotta-700"
              >
                More crisis and mental health resources
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </p>
            <p className="text-sm leading-relaxed text-ink-600">{emergencyNotice.disclaimer}</p>
          </div>
        </div>
      </Container>
    </aside>
  );
}
