import { pageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/sections/PageHeader";
import { AppointmentCTA } from "@/components/sections/AppointmentCTA";
import { SessionFormats } from "@/components/sections/SessionFormats";

export const metadata = pageMetadata({
  title: "Contact & Request an Appointment",
  description:
    "Request a counseling appointment with Sunset Counseling Center, PLLC. Call 956-601-8486 or visit 5517 N McColl Rd., McAllen, TX 78504. In-person and telehealth, English and Spanish.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        path="/contact"
        eyebrow="Contact"
        title="Contact & Appointments"
        intro="Reach out by phone or send a brief inquiry below. Counseling is available in English and Spanish, in person and through telehealth."
      />
      <AppointmentCTA />
      <SessionFormats />
    </>
  );
}
