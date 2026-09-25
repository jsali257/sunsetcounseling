import { Phone } from "lucide-react";
import { pageMetadata } from "@/lib/metadata";
import { site, ctaLinks } from "@/content/site";
import { JsonLd, faqSchema } from "@/lib/structured-data";
import { PageHeader } from "@/components/sections/PageHeader";
import { FAQList } from "@/components/sections/FAQAccordion";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = pageMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers about Spanish-language counseling, telehealth and in-person appointments, insurance, session length, and confidentiality at Sunset Counseling Center, PLLC.",
  path: "/faq",
});

export default function FAQPage() {
  return (
    <>
      <JsonLd data={faqSchema()} />
      <PageHeader
        path="/faq"
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        intro="Common questions about counseling at Sunset Counseling Center. If you don’t see your question here, you are always welcome to call."
      />
      <section aria-label="Questions and answers" className="py-16 sm:py-24">
        <Container size="narrow">
          <FAQList />
          <div className="mt-14 rounded-[1.75rem] bg-sand-100 p-8 text-center sm:p-10">
            <h2 className="text-2xl text-ink-900 sm:text-3xl">Still have questions?</h2>
            <p className="mx-auto mt-3 max-w-md text-ink-700">
              The office is happy to help you understand your options before you begin.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href={ctaLinks.appointment}>Request an Appointment</ButtonLink>
              <ButtonLink
                href={site.phone.href}
                variant="secondary"
                icon={<Phone aria-hidden="true" className="h-4 w-4 text-terracotta-600" />}
              >
                Call {site.phone.display}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
