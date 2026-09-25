import { pageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProfessionalReferralSection } from "@/components/sections/ProfessionalReferralSection";
import { EvaluationSection } from "@/components/sections/EvaluationSection";
import { AppointmentCTA } from "@/components/sections/AppointmentCTA";

export const metadata = pageMetadata({
  title: "For Attorneys & Professional Referrals",
  description:
    "Sunset Counseling Center, PLLC welcomes referrals from attorneys, healthcare professionals, and community organizations in McAllen and the Rio Grande Valley.",
  path: "/professional-referrals",
});

export default function ProfessionalReferralsPage() {
  return (
    <>
      <PageHeader
        path="/professional-referrals"
        eyebrow="For Professionals"
        title="For Professionals"
        intro="Referral information for attorneys, healthcare professionals, community organizations, and other referral partners."
      />
      <ProfessionalReferralSection />
      <EvaluationSection />
      <AppointmentCTA withForm={false} />
    </>
  );
}
