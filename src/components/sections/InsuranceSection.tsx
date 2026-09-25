import { Wallet } from "lucide-react";
import { insurance, ctaLinks } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function InsuranceSection() {
  const [coverage, verify, selfPay, contact] = insurance.paragraphs;
  return (
    <section id="insurance" aria-labelledby="insurance-heading" className="bg-sand-100 py-20 sm:py-24">
      <Container>
        <Reveal className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <p className="mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-700">
              <span aria-hidden="true" className="h-px w-8 bg-terracotta-400/70" />
              Payment
            </p>
            <h2
              id="insurance-heading"
              className="text-[1.875rem] leading-[1.15] text-ink-900 sm:text-4xl lg:text-[2.75rem]"
            >
              {insurance.heading}
            </h2>
            <p className="mt-8 inline-flex items-center gap-3 rounded-full bg-cream-50 py-2 pr-5 pl-2 text-ink-900 shadow-[var(--shadow-soft)]">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-100 text-sage-700">
                <Wallet aria-hidden="true" className="h-4 w-4" />
              </span>
              <span className="font-serif text-xl">{insurance.lead}</span>
            </p>
          </div>

          <div className="space-y-5 text-lg leading-relaxed text-ink-700">
            <p>{coverage}</p>
            <p>
              {verify} {selfPay}
            </p>
            <p>{contact}</p>
            <div className="pt-3">
              <ButtonLink href={ctaLinks.insurance} variant="secondary" size="lg">
                {insurance.cta}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
