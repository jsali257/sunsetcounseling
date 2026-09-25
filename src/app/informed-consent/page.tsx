import { pageMetadata } from "@/lib/metadata";
import { LegalPage } from "@/components/sections/LegalPage";
import { site } from "@/content/site";

export const metadata = pageMetadata({
  title: "Informed Consent",
  description: `An overview of the informed-consent process at ${site.name} before counseling begins.`,
  path: "/informed-consent",
});

export default function InformedConsentPage() {
  return (
    <LegalPage
      title="Informed Consent"
      path="/informed-consent"
      intro="What informed consent means, and what is reviewed with you before counseling begins."
    >
      <p>
        Informed consent is an ongoing conversation about what counseling involves, so that you
        can make informed decisions about your care. Before services begin, the practice’s
        informed-consent documents are reviewed with you, and you are encouraged to ask questions
        at any time.
      </p>

      <h2>Topics reviewed before services begin</h2>
      <ul>
        <li>The nature of counseling, including potential benefits and challenges</li>
        <li>Confidentiality and the specific legal and professional exceptions to confidentiality</li>
        <li>Fees, insurance, payment, and scheduling policies</li>
        <li>Telehealth considerations, including privacy and technology requirements</li>
        <li>How to reach the office and what to do in an emergency</li>
        <li>Client records and your privacy rights</li>
        <li>Your right to ask questions, discuss your goals, and end services at any time</li>
      </ul>

      <h2>Confidentiality</h2>
      <p>
        Information discussed in counseling is generally confidential, subject to applicable laws,
        professional requirements, and specific exceptions that will be reviewed as part of the
        informed-consent process.
      </p>

      <h2>Telehealth</h2>
      <p>
        Telehealth counseling is available for eligible clients located in Texas. Additional
        consent information related to telehealth is reviewed before virtual sessions begin.
      </p>

      <h2>Professional licensure</h2>
      <p>
        Licensed Professional Counselors in Texas are regulated by the Texas Behavioral Health
        Executive Council. Information about licensure and filing a complaint is available at{" "}
        <a href="https://bhec.texas.gov" target="_blank" rel="noopener noreferrer">
          bhec.texas.gov
        </a>
        .
      </p>

      <h2>Requesting a copy</h2>
      <p>
        To review the practice’s informed-consent documents before scheduling, please contact the
        office at <a href={site.phone.href}>{site.phone.display}</a>.
      </p>
    </LegalPage>
  );
}
