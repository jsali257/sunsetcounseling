import { Building2, MapPin, Navigation, Video } from "lucide-react";
import { site, sessionFormats, ctaLinks } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

const cardClass =
  "flex h-full flex-col rounded-[1.75rem] border border-sand-200 bg-cream-50 p-7 shadow-[var(--shadow-soft)] transition-[transform,box-shadow] duration-500 ease-[var(--ease-gentle)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:p-10";

export function LocationCard() {
  const { inPerson } = sessionFormats;
  return (
    <article aria-labelledby="in-person-heading" className={cardClass}>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-peach-100 text-terracotta-700">
        <Building2 aria-hidden="true" className="h-5 w-5" strokeWidth={1.6} />
      </span>
      <h3 id="in-person-heading" className="mt-6 text-[1.6rem] leading-tight text-ink-900 sm:text-3xl">
        {inPerson.title}
      </h3>
      <p className="mt-3 text-lg leading-relaxed text-ink-600">{inPerson.body}</p>

      <div className="mt-7 flex gap-3 rounded-2xl bg-sand-100 p-5">
        <MapPin aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-terracotta-600" />
        <div>
          <p className="font-medium text-ink-900">{inPerson.officeLabel}</p>
          <address className="mt-1 leading-relaxed text-ink-700 not-italic">
            {site.address.street}
            <br />
            {site.address.city}, {site.address.state} {site.address.zip}
          </address>
        </div>
      </div>

      <div className="mt-auto pt-8">
        <ButtonLink
          href={site.address.mapsUrl}
          variant="secondary"
          icon={<Navigation aria-hidden="true" className="h-4 w-4 text-terracotta-600" />}
          aria-label="Get directions to the McAllen office (opens Google Maps in a new tab)"
        >
          {inPerson.cta}
        </ButtonLink>
      </div>
    </article>
  );
}

export function TelehealthCard() {
  const { telehealth } = sessionFormats;
  return (
    <article aria-labelledby="telehealth-heading" className={cardClass}>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-sage-700">
        <Video aria-hidden="true" className="h-5 w-5" strokeWidth={1.6} />
      </span>
      <h3 id="telehealth-heading" className="mt-6 text-[1.6rem] leading-tight text-ink-900 sm:text-3xl">
        {telehealth.title}
      </h3>
      <div className="mt-3 space-y-4 text-lg leading-relaxed text-ink-600">
        {telehealth.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <div className="mt-auto pt-8">
        <ButtonLink href={ctaLinks.telehealth}>{telehealth.cta}</ButtonLink>
      </div>
    </article>
  );
}

export function SessionFormats() {
  return (
    <section aria-labelledby="formats-heading" className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            id="formats-heading"
            eyebrow="In-Person & Telehealth"
            title="Meet in our McAllen office or from home"
            intro="Choose the setting that feels most comfortable and practical for you."
            align="center"
          />
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Reveal className="h-full">
            <LocationCard />
          </Reveal>
          <Reveal className="h-full" delay={120}>
            <TelehealthCard />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
