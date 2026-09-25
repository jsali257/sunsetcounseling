import { pageMetadata } from "@/lib/metadata";
import { faqs } from "@/content/site";
import { PageHeader } from "@/components/sections/PageHeader";
import { ServicesSection } from "@/components/sections/Services";
import { SessionFormats } from "@/components/sections/SessionFormats";
import { InsuranceSection } from "@/components/sections/InsuranceSection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { AppointmentCTA } from "@/components/sections/AppointmentCTA";

export const metadata = pageMetadata({
  title: "Counseling Services",
  description:
    "Individual counseling in McAllen, TX and via telehealth in Texas for anxiety and stress, depression, trauma, life transitions, self-esteem, and emotional regulation.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        path="/services"
        eyebrow="Services"
        title="Counseling Services"
        intro="One-on-one counseling tailored to your needs, available in person in McAllen or through telehealth for eligible clients in Texas."
      />
      <ServicesSection showPageLink={false} />
      <SessionFormats />
      <InsuranceSection />
      <FAQAccordion items={faqs.slice(1, 5)} showPageLink />
      <AppointmentCTA withForm={false} />
    </>
  );
}
