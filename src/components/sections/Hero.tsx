import { Phone, MapPin, Languages } from "lucide-react";
import { hero, site, ctaLinks } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SunsetLandscape } from "@/components/ui/Decorations";

export function Hero({ appointmentHref = ctaLinks.appointment }: { appointmentHref?: string }) {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden">
      {/* soft, warm light behind the hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-[-16rem] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(closest-side,var(--color-peach-100),transparent)] opacity-90"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-[-14rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,var(--color-sage-100),transparent)] opacity-80"
      />

      <Container size="wide" className="relative grid items-center gap-12 pt-6 pb-16 sm:pt-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:pt-12 lg:pb-24">
        <div>
          <p className="inline-flex items-center gap-2.5 rounded-full border border-sage-300/70 bg-cream-50/80 py-1.5 pr-4 pl-3 text-sm text-sage-700">
            <span aria-hidden="true" className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage-500 opacity-40 [animation-duration:2.4s]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sage-600" />
            </span>
            {hero.trust.status}
          </p>

          <h1
            id="hero-heading"
            className="mt-7 text-[2.5rem] leading-[1.06] text-ink-900 sm:text-[3.4rem] lg:text-[4rem] xl:text-[4.5rem]"
          >
            {hero.headline}{" "}
            <em className="text-terracotta-700 italic [font-variation-settings:'SOFT'_100]">
              {hero.headlineAccent}
            </em>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-700 sm:text-xl">
            {hero.subhead}
          </p>

          <ul
            aria-label="Services at a glance"
            className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.95rem] text-ink-600"
          >
            {hero.serviceLine.map((item, i) => (
              <li key={item} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-terracotta-400" />}
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href={appointmentHref} size="lg">
              Request an Appointment
            </ButtonLink>
            <ButtonLink
              href={site.phone.href}
              variant="secondary"
              size="lg"
              icon={<Phone aria-hidden="true" className="h-4 w-4 text-terracotta-600" />}
            >
              Call {site.phone.display}
            </ButtonLink>
          </div>

          <p className="mt-8 flex items-center gap-2 text-sm text-ink-600">
            <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-sage-600" />
            {hero.trust.area}
          </p>
        </div>

        <div className="relative">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] shadow-[0_30px_80px_-40px_rgb(111_55_37/0.45)] sm:aspect-[16/11] lg:aspect-[4/5] lg:rounded-[2.5rem]">
            <SunsetLandscape className="absolute inset-0 h-full w-full" />
          </div>

          <div className="absolute -bottom-6 left-4 rounded-2xl border border-cream-50/60 bg-cream-50/90 p-4 shadow-[var(--shadow-lift)] backdrop-blur-sm sm:left-8 lg:-left-8 lg:bottom-10">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-700">
                <Languages aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <p className="font-serif text-lg leading-tight whitespace-nowrap text-ink-900">
                  Welcome <span className="text-ink-500">·</span>{" "}
                  <span lang="es" className="italic">Bienvenidos</span>
                </p>
                <p className="mt-1 text-sm text-ink-600">English &amp; Spanish sessions</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
