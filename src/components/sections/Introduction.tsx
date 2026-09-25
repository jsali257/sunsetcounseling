import { ArrowRight } from "lucide-react";
import { introduction } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Sprig } from "@/components/ui/Decorations";

export function Introduction({ showLink = true }: { showLink?: boolean }) {
  const [lead, ...rest] = introduction.paragraphs;
  return (
    <section aria-labelledby="intro-heading" className="relative py-20 sm:py-28">
      <Sprig className="absolute top-16 left-[4%] hidden h-56 w-28 text-sage-500/30 lg:block" />
      <Container>
        <Reveal className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-700">
              <span aria-hidden="true" className="h-px w-8 bg-terracotta-400/70" />
              Welcome
            </p>
            <h2
              id="intro-heading"
              className="text-[1.875rem] leading-[1.15] text-ink-900 sm:text-4xl lg:text-[2.75rem]"
            >
              {introduction.heading}
            </h2>
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-ink-700">
            <p className="font-serif text-[1.35rem] leading-snug text-ink-900 sm:text-2xl">{lead}</p>
            {rest.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {showLink && (
              <div className="pt-3">
                <ButtonLink
                  href="/about"
                  variant="text"
                  icon={
                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  }
                  iconPosition="end"
                >
                  Learn more about our practice
                </ButtonLink>
              </div>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
