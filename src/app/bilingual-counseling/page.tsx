import { pageMetadata } from "@/lib/metadata";
import { faqs } from "@/content/site";
import { PageHeader } from "@/components/sections/PageHeader";
import { BilingualSection } from "@/components/sections/BilingualSection";
import { SessionFormats } from "@/components/sections/SessionFormats";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { AppointmentCTA } from "@/components/sections/AppointmentCTA";

export const metadata = pageMetadata({
  title: "Bilingual Counseling in English & Spanish",
  description:
    "Counseling in English and Spanish in McAllen, Texas and via telehealth. Servicios de consejería disponibles en inglés y español.",
  path: "/bilingual-counseling",
});

export default function BilingualCounselingPage() {
  return (
    <>
      <PageHeader
        path="/bilingual-counseling"
        eyebrow="Bilingual Counseling"
        title="Bilingual Counseling"
        intro={
          <>
            <p>Counseling in the language that feels most natural to you.</p>
            <p lang="es" className="mt-2 text-ink-600 italic">
              Consejería en el idioma que le resulte más natural.
            </p>
          </>
        }
      />
      <BilingualSection showPageLink={false} />
      <SessionFormats />
      <FAQAccordion items={faqs.slice(0, 3)} showPageLink />
      <AppointmentCTA withForm={false} />
    </>
  );
}
