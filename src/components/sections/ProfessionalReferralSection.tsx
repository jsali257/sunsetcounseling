import { Scale, Stethoscope, Users, Briefcase, Lock } from "lucide-react";
import { referrals, ctaLinks } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

const audienceIcons = [Scale, Stethoscope, Users, Briefcase];

/** Deliberately more formal: structured, restrained palette, document-like framing. */
export function ProfessionalReferralSection({
  headingLevel = "h2",
}: {
  headingLevel?: "h1" | "h2";
}) {
  const Heading = headingLevel;
  const [welcome, evaluationRequest, collaboration] = referrals.paragraphs;

  return (
    <section aria-labelledby="referrals-heading" className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <div className="overflow-hidden rounded-[1.25rem] border border-ink-900/15 bg-cream-50 shadow-[var(--shadow-soft)]">
            <div className="flex flex-col gap-2 border-b border-ink-900/10 bg-ink-900 px-7 py-4 text-cream-50 sm:flex-row sm:items-center sm:justify-between sm:px-10">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-peach-200">
                For Professionals
              </p>
              <p className="text-xs tracking-[0.08em] text-cream-50/70">
                Attorneys · Healthcare · Community Organizations
              </p>
            </div>

            <div className="grid gap-12 p-7 sm:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:p-14">
              <div>
                <Heading
                  id="referrals-heading"
                  className="text-[1.875rem] leading-[1.15] text-ink-900 sm:text-4xl"
                >
                  {referrals.heading}
                </Heading>
                <div className="mt-6 h-px w-16 bg-ink-900/30" aria-hidden="true" />
                <div className="mt-6 space-y-5 text-[1.0625rem] leading-relaxed text-ink-700">
                  <p>{welcome}</p>
                  <p>{evaluationRequest}</p>
                </div>

                <p className="mt-7 flex gap-3 rounded-xl bg-sand-100 p-4 text-[0.975rem] leading-relaxed text-ink-800">
                  <Lock aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-sage-700" />
                  {collaboration}
                </p>

                <ButtonLink href={ctaLinks.referral} variant="dark" size="lg" className="mt-9">
                  {referrals.cta}
                </ButtonLink>
              </div>

              <div className="space-y-10 lg:border-l lg:border-ink-900/10 lg:pl-12">
                <div>
                  <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-ink-600">
                    Referral inquiries should include
                  </h3>
                  <ol className="mt-5 space-y-4">
                    {referrals.checklist.map((item, i) => (
                      <li key={item} className="flex gap-4">
                        <span
                          aria-hidden="true"
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink-900/20 font-serif text-sm text-ink-800"
                        >
                          {i + 1}
                        </span>
                        <span className="pt-0.5 leading-relaxed text-ink-800">{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-ink-600">
                    We welcome referrals from
                  </h3>
                  <ul className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                    {referrals.audiences.map((a, i) => {
                      const Icon = audienceIcons[i % audienceIcons.length];
                      return (
                        <li key={a} className="flex items-center gap-2.5 text-[0.95rem] text-ink-800">
                          <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-sage-700" strokeWidth={1.7} />
                          {a}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
