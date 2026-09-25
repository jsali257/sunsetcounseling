import {
  ArrowRight,
  User,
  Waves,
  Sunrise,
  HeartHandshake,
  Signpost,
  Sprout,
  Anchor,
  type LucideIcon,
} from "lucide-react";
import { services, type Service, type ServiceIcon } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

const icons: Record<ServiceIcon, LucideIcon> = {
  individual: User,
  anxiety: Waves,
  depression: Sunrise,
  trauma: HeartHandshake,
  transitions: Signpost,
  growth: Sprout,
  coping: Anchor,
};

export function ServiceCard({ service, featured = false }: { service: Service; featured?: boolean }) {
  const Icon = icons[service.icon];
  return (
    <article
      id={service.slug}
      className={cn(
        "group h-full rounded-2xl border border-sand-200 bg-cream-50 p-7 transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-gentle)] hover:-translate-y-1 hover:border-sand-300 hover:shadow-[var(--shadow-lift)] sm:p-8",
        featured &&
          "grid gap-6 bg-[linear-gradient(120deg,var(--color-cream-50)_40%,var(--color-peach-100))] md:grid-cols-[auto_1fr] md:items-start md:gap-8 md:p-10",
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-full bg-peach-100 text-terracotta-700 transition-colors duration-500 group-hover:bg-peach-200",
          featured ? "h-14 w-14" : "h-11 w-11",
        )}
      >
        <Icon aria-hidden="true" className={featured ? "h-6 w-6" : "h-5 w-5"} strokeWidth={1.6} />
      </span>
      <div>
        <h3
          className={cn(
            "text-ink-900",
            featured ? "text-[1.75rem] leading-tight md:text-3xl" : "mt-6 text-[1.4rem] leading-snug",
          )}
        >
          {service.title}
        </h3>
        <p
          className={cn(
            "mt-3 leading-relaxed text-ink-600",
            featured ? "max-w-2xl text-lg" : "text-[0.975rem]",
          )}
        >
          {service.description}
        </p>
      </div>
    </article>
  );
}

export function ServicesSection({
  showPageLink = true,
  headingLevel = "h2",
}: {
  showPageLink?: boolean;
  headingLevel?: "h1" | "h2";
}) {
  const [featured, ...rest] = services;
  return (
    <section aria-labelledby="services-heading" className="py-20 sm:py-28">
      <Container>
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="services-heading"
            as={headingLevel}
            eyebrow="Counseling Services"
            title="Support for what you are carrying"
            intro="Individualized counseling for people navigating stress, change, and difficult experiences — at a pace that feels right for you."
          />
          {showPageLink && (
            <ButtonLink
              href="/services"
              variant="text"
              iconPosition="end"
              className="shrink-0 self-start lg:self-auto"
              icon={
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              }
            >
              Explore all services
            </ButtonLink>
          )}
        </Reveal>

        <div className="mt-14 space-y-5">
          <Reveal>
            <ServiceCard service={featured} featured />
          </Reveal>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((service, i) => (
              <Reveal as="li" key={service.slug} delay={(i % 3) * 90}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
