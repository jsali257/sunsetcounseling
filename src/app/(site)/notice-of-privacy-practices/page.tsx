import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { LegalPage } from "@/components/sections/LegalPage";
import { site } from "@/content/site";

export const metadata = pageMetadata({
  title: "Notice of Privacy Practices",
  description: `Information about ${site.name}’s Notice of Privacy Practices and how to request a copy.`,
  path: "/notice-of-privacy-practices",
});

export default function NoticeOfPrivacyPracticesPage() {
  return (
    <LegalPage
      title="Notice of Privacy Practices"
      path="/notice-of-privacy-practices"
      intro="How health information is protected as part of counseling services, and how to request the full notice."
    >
      <p>
        Protecting client privacy is an important part of the counseling relationship. The
        practice’s Notice of Privacy Practices describes how health information about you may be
        used and disclosed, and how you can access that information.
      </p>
      <p>
        Clients receive the full Notice of Privacy Practices at the beginning of services. You may
        request a copy at any time — including before scheduling — by contacting the office at{" "}
        <a href={`${site.phone.href}`}>{site.phone.display}</a>.
      </p>

      <h2>What the notice covers</h2>
      <ul>
        <li>How health information may be used and disclosed for treatment, payment, and operations</li>
        <li>Situations in which information may be disclosed without authorization as required or permitted by law</li>
        <li>Your rights regarding your health information</li>
        <li>The practice’s responsibilities for protecting your information</li>
        <li>How to ask questions or file a complaint</li>
      </ul>

      <h2>Your rights</h2>
      <p>Under federal privacy law, individuals generally have the right to:</p>
      <ul>
        <li>Request access to and a copy of their health information</li>
        <li>Request a correction to their health information</li>
        <li>Request confidential communications, such as being contacted at a specific phone number or address</li>
        <li>Request restrictions on certain uses or disclosures</li>
        <li>Receive an accounting of certain disclosures</li>
        <li>Receive a paper copy of the Notice of Privacy Practices</li>
        <li>File a complaint if they believe their privacy rights have been violated</li>
      </ul>
      <p>
        The specific details, procedures, and exceptions are described in the full notice provided
        by the practice.
      </p>

      <h2>Website inquiries</h2>
      <p>
        Information submitted through this website’s inquiry form is described in the{" "}
        <Link href="/privacy">Website Privacy Policy</Link>. Please do not use the website form to
        share detailed or highly sensitive clinical information.
      </p>
    </LegalPage>
  );
}
