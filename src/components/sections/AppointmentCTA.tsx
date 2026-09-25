import { Suspense } from "react";
import { Phone, MapPin, Languages, Compass } from "lucide-react";
import { appointment, site, ctaLinks } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm, ContactFormWithParams } from "@/components/forms/ContactForm";
import { cn } from "@/lib/cn";

function ContactDetails() {
  return (
    <dl className="mt-10 grid gap-6 text-cream-50 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      <div className="flex gap-3.5">
        <dt>
          <Phone aria-hidden="true" className="mt-1 h-5 w-5 text-peach-300" />
          <span className="sr-only">Phone</span>
        </dt>
        <dd>
          <a href={site.phone.href} className="font-serif text-2xl text-cream-50 hover:text-peach-100">
            {site.phone.display}
          </a>
        </dd>
      </div>
      <div className="flex gap-3.5">
        <dt>
          <MapPin aria-hidden="true" className="mt-1 h-5 w-5 text-peach-300" />
          <span className="sr-only">McAllen Office</span>
        </dt>
        <dd className="leading-relaxed text-cream-50/85">
          <span className="block font-medium text-cream-50">McAllen Office</span>
          <address className="not-italic">
            {site.address.street}
            <br />
            {site.address.city}, {site.address.state} {site.address.zip}
          </address>
        </dd>
      </div>
      <div className="flex gap-3.5">
        <dt>
          <Compass aria-hidden="true" className="mt-0.5 h-5 w-5 text-peach-300" />
          <span className="sr-only">Service area</span>
        </dt>
        <dd className="leading-relaxed text-cream-50/85">{site.serviceArea}</dd>
      </div>
      <div className="flex gap-3.5">
        <dt>
          <Languages aria-hidden="true" className="mt-0.5 h-5 w-5 text-peach-300" />
          <span className="sr-only">Languages and formats</span>
        </dt>
        <dd className="leading-relaxed text-cream-50/85">
          English &amp; Spanish
          <br />
          In-Person &amp; Telehealth
        </dd>
      </div>
    </dl>
  );
}

export function AppointmentCTA({
  withForm = true,
  headingLevel = "h2",
}: {
  withForm?: boolean;
  headingLevel?: "h1" | "h2";
}) {
  const Heading = headingLevel;
  return (
    <section
      id="request-appointment"
      aria-labelledby="appointment-heading"
      className="relative isolate overflow-hidden bg-ink-900 py-20 text-cream-50 sm:py-28"
    >
      {/* a low, warm sunset glow */}
      <div
        aria-hidden="true"
        className="absolute bottom-[-18rem] left-1/2 -z-10 h-[34rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(208_130_95/0.45),rgb(236_188_158/0.12)_55%,transparent)]"
      />
      <div
        aria-hidden="true"
        className="absolute top-[-10rem] right-[-8rem] -z-10 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(closest-side,rgb(125_140_111/0.25),transparent)]"
      />

      <Container>
        <div
          className={cn(
            "grid gap-14",
            withForm ? "lg:grid-cols-[0.9fr_1.1fr] lg:gap-16" : "max-w-3xl",
          )}
        >
          <Reveal>
            <p className="mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-peach-200">
              <span aria-hidden="true" className="h-px w-8 bg-peach-200/60" />
              Request an Appointment
            </p>
            <Heading
              id="appointment-heading"
              className="text-[2.25rem] leading-[1.08] text-cream-50 sm:text-5xl lg:text-[3.5rem]"
            >
              {appointment.heading}
            </Heading>
            <div className="mt-7 space-y-5 text-lg leading-relaxed text-cream-50/85">
              <p className="font-serif text-[1.35rem] leading-snug text-cream-50 italic sm:text-2xl">
                {appointment.paragraphs[0]}
              </p>
              <p>{appointment.paragraphs[1]}</p>
            </div>

            <p className="mt-10 font-medium text-cream-50">{site.name}</p>
            <ContactDetails />

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              {!withForm && (
                <ButtonLink href={ctaLinks.appointment} variant="light" size="lg">
                  Request an Appointment
                </ButtonLink>
              )}
              <ButtonLink
                href={site.phone.href}
                variant="outline-light"
                size="lg"
                icon={<Phone aria-hidden="true" className="h-4 w-4" />}
              >
                Call {site.phone.display}
              </ButtonLink>
            </div>
          </Reveal>

          {withForm && (
            <Reveal delay={120}>
              <div className="rounded-[1.75rem] bg-cream-100 p-6 text-ink-900 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.6)] sm:p-9 lg:p-10">
                <h3 className="text-2xl text-ink-900 sm:text-[1.75rem]">Appointment inquiry</h3>
                <p className="mt-2 mb-7 text-ink-600">
                  Share a few details and the office will reach out to you.
                </p>
                <Suspense fallback={<ContactForm />}>
                  <ContactFormWithParams />
                </Suspense>
              </div>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}
