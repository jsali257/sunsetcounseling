import { ChevronDown, ArrowRight } from "lucide-react";
import { faqs as allFaqs, type FAQ } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Accessible accordion built on native <details>/<summary>:
 * keyboard operable, announced as expandable, searchable, and functional without JavaScript.
 */
export function FAQList({ items = allFaqs }: { items?: FAQ[] }) {
  return (
    <div className="divide-y divide-sand-300/70 border-y border-sand-300/70">
      {items.map((faq) => (
        <details key={faq.question} className="faq-item group">
          <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 py-5 text-left font-serif text-[1.2rem] leading-snug text-ink-900 transition-colors hover:text-terracotta-800 sm:text-[1.35rem]">
            {faq.question}
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sand-300 bg-cream-50 text-ink-700 transition-colors group-open:border-terracotta-300 group-open:bg-peach-100 group-open:text-terracotta-800">
              <ChevronDown aria-hidden="true" className="faq-icon h-4 w-4" />
            </span>
          </summary>
          <div className="pr-4 pb-6 sm:pr-16">
            <p className="text-[1.0625rem] leading-relaxed text-ink-700">{faq.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

export function FAQAccordion({
  items,
  showPageLink = false,
  headingLevel = "h2",
}: {
  items?: FAQ[];
  showPageLink?: boolean;
  headingLevel?: "h1" | "h2";
}) {
  return (
    <section aria-labelledby="faq-heading" className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <SectionHeading
              id="faq-heading"
              as={headingLevel}
              eyebrow="FAQ"
              title="Frequently Asked Questions"
              intro="If you don’t see your question here, you are always welcome to call the office."
            />
            {showPageLink && (
              <ButtonLink
                href="/faq"
                variant="text"
                iconPosition="end"
                className="mt-8"
                icon={
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  />
                }
              >
                View all questions
              </ButtonLink>
            )}
          </Reveal>
          <Reveal delay={100}>
            <FAQList items={items} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
