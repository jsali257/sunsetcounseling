import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { LegalPage } from "@/components/sections/LegalPage";
import { site } from "@/content/site";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How the ${site.name} website handles information submitted through the site.`,
  path: "/privacy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy"
      intro="How this website handles information you choose to share with us."
    >
      <p>
        This Website Privacy Policy describes how {site.name} handles information submitted
        through this website. It is separate from the practice’s{" "}
        <Link href="/notice-of-privacy-practices">Notice of Privacy Practices</Link>, which
        describes how health information is handled as part of counseling services.
      </p>

      <h2>Information you provide</h2>
      <p>
        If you submit the appointment inquiry form, we receive the information you enter, such as
        your name, phone number, email address, preferred contact method, preferred session
        format, preferred language, and any message you include.
      </p>
      <p>
        Please do not use the website form for emergencies or to share detailed or highly
        sensitive clinical information. Those details can be discussed privately with the
        counselor.
      </p>

      <h2>How information is used</h2>
      <p>Information submitted through the website is used to:</p>
      <ul>
        <li>Respond to your inquiry and contact you using your preferred method</li>
        <li>Help arrange an appointment or answer questions about services, insurance, or fees</li>
        <li>Maintain the operation and security of the website</li>
      </ul>
      <p>We do not sell personal information submitted through this website.</p>

      <h2>Service providers</h2>
      <p>
        Like most websites, this site relies on third-party providers for services such as website
        hosting and delivering form submissions to the practice. These providers process
        information only as needed to provide those services.
      </p>

      <h2>Cookies and analytics</h2>
      <p>
        This website does not use advertising cookies. If analytics or similar tools are added in
        the future, this policy will be updated to describe them.
      </p>

      <h2>External links</h2>
      <p>
        Some links, such as map directions, open third-party websites. Those websites are governed
        by their own privacy policies.
      </p>

      <h2>Emergencies</h2>
      <p>
        This website is not monitored for emergencies. If you are experiencing a mental health
        emergency or believe you may be in immediate danger, call 911 or go to the nearest
        emergency department. You may also call or text 988 to reach the Suicide &amp; Crisis
        Lifeline.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        This policy may be updated from time to time. Changes will be posted on this page.
      </p>
    </LegalPage>
  );
}
