import { Phone } from "lucide-react";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { SiteChrome } from "@/components/layout/SiteChrome";

export default function NotFound() {
  return (
    <SiteChrome>
    <section className="py-24 sm:py-32">
      <Container size="narrow" className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-700">
          Page not found
        </p>
        <h1 className="mt-5 text-4xl text-ink-900 sm:text-5xl">This page has moved or doesn’t exist</h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-ink-700">
          Let’s get you back on your way. You can return home or reach the office directly.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/">Return Home</ButtonLink>
          <ButtonLink
            href={site.phone.href}
            variant="secondary"
            icon={<Phone aria-hidden="true" className="h-4 w-4 text-terracotta-600" />}
          >
            Call {site.phone.display}
          </ButtonLink>
        </div>
      </Container>
    </section>
    </SiteChrome>
  );
}
