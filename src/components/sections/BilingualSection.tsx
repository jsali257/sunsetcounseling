import { ArrowRight } from "lucide-react";
import { bilingual } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Sprig } from "@/components/ui/Decorations";

export function BilingualSection({
  showPageLink = true,
  headingLevel = "h2",
}: {
  showPageLink?: boolean;
  headingLevel?: "h1" | "h2";
}) {
  const Heading = headingLevel;
  return (
    <section
      aria-labelledby="bilingual-heading"
      className="relative overflow-hidden bg-[linear-gradient(180deg,var(--color-sage-100),var(--color-cream-100))] py-20 sm:py-28"
    >
      <Sprig className="absolute -top-6 right-[6%] hidden h-80 w-44 rotate-12 text-sage-500/25 md:block" />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-sage-700">
              <span aria-hidden="true" className="h-px w-8 bg-sage-500/70" />
              Bilingual Counseling
            </p>
            <Heading
              id="bilingual-heading"
              className="text-[2rem] leading-[1.12] text-ink-900 sm:text-[2.6rem] lg:text-[3rem]"
            >
              Counseling in English <em className="text-terracotta-700 italic">&amp;</em> Spanish
            </Heading>
            <div className="mt-7 space-y-5 text-lg leading-relaxed text-ink-700">
              {bilingual.english.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {showPageLink && (
              <div className="mt-8">
                <ButtonLink
                  href="/bilingual-counseling"
                  variant="text"
                  iconPosition="end"
                  icon={
                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  }
                >
                  More about bilingual counseling
                </ButtonLink>
              </div>
            )}
          </Reveal>

          <Reveal delay={140}>
            <div
              lang="es"
              className="relative rounded-[2rem] border border-sage-200 bg-cream-50/85 p-8 shadow-[var(--shadow-soft)] sm:p-11"
            >
              <p className="inline-flex items-center gap-2 rounded-full bg-sage-100 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sage-700">
                En español
              </p>
              <div className="mt-6">
                <p className="font-serif text-[1.5rem] leading-snug text-ink-900 sm:text-[1.75rem]">
                  {bilingual.spanish.heading}
                </p>
                <p className="mt-5 text-lg leading-relaxed text-ink-700 italic">
                  {bilingual.spanish.body}
                </p>
              </div>
              <p className="mt-8 flex items-center gap-3 border-t border-sage-200 pt-6 text-sm text-sage-700">
                <span aria-hidden="true" className="h-px w-6 bg-sage-500" />
                Sunset Counseling Center, PLLC
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
