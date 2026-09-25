import { pageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/sections/PageHeader";
import { Introduction } from "@/components/sections/Introduction";
import { CounselorProfile } from "@/components/sections/CounselorProfile";
import { SessionFormats } from "@/components/sections/SessionFormats";
import { AppointmentCTA } from "@/components/sections/AppointmentCTA";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Learn about Sunset Counseling Center, PLLC in McAllen, Texas, and Diana Arredondo, M.S., LPC — a Licensed Professional Counselor offering counseling in English and Spanish.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        path="/about"
        eyebrow="About"
        title="About Sunset Counseling Center"
        intro="A private counseling practice in McAllen, Texas, offering compassionate, culturally responsive care in English and Spanish."
      />
      <Introduction showLink={false} />
      <CounselorProfile variant="full" />
      <SessionFormats />
      <AppointmentCTA withForm={false} />
    </>
  );
}
