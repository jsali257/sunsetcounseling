import { ClipboardList, Check, Info } from "lucide-react";
import { evaluations, ctaLinks } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function EvaluationSection({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  return (
    <section aria-labelledby="evaluations-heading" className="bg-sand-100 py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              id="evaluations-heading"
              as={headingLevel}
              eyebrow="Evaluations"
              title={evaluations.heading}
            />
            <div className="mt-7 space-y-5 text-lg leading-relaxed text-ink-700">
              <p>{evaluations.intro}</p>
              <p>{evaluations.detail}</p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-[1.75rem] border border-sand-200 bg-cream-50 p-7 shadow-[var(--shadow-soft)] sm:p-9">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-100 text-sage-700">
                  <ClipboardList aria-hidden="true" className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <h3 className="text-xl leading-snug text-ink-900">Before scheduling</h3>
              </div>
              <p className="mt-5 leading-relaxed text-ink-700">{evaluations.discussLead}</p>
              <ul className="mt-5 divide-y divide-sand-200 border-y border-sand-200">
                {evaluations.discussItems.map((item) => (
                  <li key={item} className="flex items-center gap-3 py-3 text-ink-800">
                    <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-terracotta-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <ButtonLink href={ctaLinks.evaluation} className="mt-8 w-full sm:w-auto">
                {evaluations.cta}
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div
            role="note"
            aria-label="Evaluation disclaimer"
            className="mt-12 flex gap-4 rounded-2xl border-l-4 border-terracotta-500 bg-cream-50 p-5 sm:p-6"
          >
            <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-terracotta-700" />
            <p className="leading-relaxed text-ink-800">
              <strong className="font-semibold">Please note: </strong>
              {evaluations.disclaimer}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
