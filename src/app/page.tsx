import { Hero } from "@/components/sections/Hero";
import { Introduction } from "@/components/sections/Introduction";
import { CounselorProfile } from "@/components/sections/CounselorProfile";
import { ServicesSection } from "@/components/sections/Services";
import { BilingualSection } from "@/components/sections/BilingualSection";
import { SessionFormats } from "@/components/sections/SessionFormats";
import { EvaluationSection } from "@/components/sections/EvaluationSection";
import { ProfessionalReferralSection } from "@/components/sections/ProfessionalReferralSection";
import { InsuranceSection } from "@/components/sections/InsuranceSection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { AppointmentCTA } from "@/components/sections/AppointmentCTA";

export default function HomePage() {
  return (
    <>
      <Hero appointmentHref="#request-appointment" />
      <Introduction />
      <CounselorProfile />
      <ServicesSection />
      <BilingualSection />
      <SessionFormats />
      <EvaluationSection />
      <ProfessionalReferralSection />
      <InsuranceSection />
      <FAQAccordion />
      <AppointmentCTA />
    </>
  );
}
