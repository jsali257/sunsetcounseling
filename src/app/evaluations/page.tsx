import { pageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/sections/PageHeader";
import { EvaluationSection } from "@/components/sections/EvaluationSection";
import { ProfessionalReferralSection } from "@/components/sections/ProfessionalReferralSection";
import { AppointmentCTA } from "@/components/sections/AppointmentCTA";

export const metadata = pageMetadata({
  title: "Clinical & Professional Evaluations",
  description:
    "Clinical evaluations and professional mental health documentation in McAllen, Texas, when appropriate and within the counselor’s professional scope of practice.",
  path: "/evaluations",
});

export default function EvaluationsPage() {
  return (
    <>
      <PageHeader
        path="/evaluations"
        eyebrow="Evaluations"
        title="Evaluations"
        intro="Information for individuals and attorneys seeking a clinical evaluation or professional mental health documentation."
      />
      <EvaluationSection />
      <ProfessionalReferralSection />
      <AppointmentCTA withForm={false} />
    </>
  );
}
