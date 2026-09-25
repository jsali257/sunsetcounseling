import { Phone, MessageSquareText, Siren, ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/metadata";
import { crisisResources, site } from "@/content/site";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = pageMetadata({
  title: "Crisis & Mental Health Resources",
  description:
    "24/7 crisis and mental health resources, including the 988 Suicide & Crisis Lifeline and the Tropical Texas Behavioral Health crisis line serving Hidalgo, Cameron, and Willacy counties.",
  path: "/crisis-resources",
});

export default function CrisisResourcesPage() {
  return (
    <>
      <PageHeader
        path="/crisis-resources"
        eyebrow="Crisis Resources"
        title="Crisis & Mental Health Resources"
        intro="If you or someone you know is experiencing suicidal thoughts, self-harm urges, or a mental health crisis, help is available."
      />

      <section aria-labelledby="emergency-now" className="pt-12 sm:pt-16">
        <Container>
          {/* Emergency guidance comes first so no one has to scroll for it. */}
          <div className="flex flex-col gap-6 rounded-[1.5rem] border-2 border-terracotta-600 bg-peach-100 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-terracotta-700 text-cream-50">
                <Siren aria-hidden="true" className="h-6 w-6" />
              </span>
              <div>
                <h2 id="emergency-now" className="font-sans text-xl font-semibold text-ink-950">
                  Emergency
                </h2>
                <p className="mt-2 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-900">
                  If you or someone else is in immediate danger, has made a suicide attempt, has a
                  serious injury, or cannot remain safe, <strong>call 911</strong> or go to the
                  nearest emergency department.
                </p>
              </div>
            </div>
            <ButtonLink
              href="tel:911"
              size="lg"
              className="shrink-0"
              icon={<Phone aria-hidden="true" className="h-5 w-5" />}
            >
              Call 911
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section aria-labelledby="support-lines" className="py-12 sm:py-16">
        <Container>
          <h2 id="support-lines" className="text-[1.75rem] leading-tight text-ink-900 sm:text-3xl">
            24/7 support lines
          </h2>
          <p className="mt-2 text-ink-600">Free and confidential. Tap a number to call or text.</p>

          <ul className="mt-8 grid gap-5 md:grid-cols-2">
            {crisisResources.map((resource) => (
              <li
                key={resource.name}
                className="flex flex-col rounded-2xl border border-sand-200 bg-cream-50 p-6 shadow-[var(--shadow-soft)] sm:p-7"
              >
                <h3 className="font-sans text-lg font-semibold leading-snug text-ink-900">
                  {resource.name}
                </h3>
                <p className="mt-2 leading-relaxed text-ink-700">{resource.description}</p>
                {resource.note && (
                  <p lang="es" className="mt-2 text-sm font-medium text-sage-700">
                    {resource.note}
                  </p>
                )}
                <div className="mt-auto flex flex-wrap gap-2.5 pt-5">
                  {resource.contacts.map((contact) => (
                    <ButtonLink
                      key={contact.href + contact.label}
                      href={contact.href}
                      variant="secondary"
                      icon={
                        contact.kind === "call" ? (
                          <Phone aria-hidden="true" className="h-4 w-4 text-terracotta-600" />
                        ) : (
                          <MessageSquareText aria-hidden="true" className="h-4 w-4 text-terracotta-600" />
                        )
                      }
                    >
                      {contact.label}
                    </ButtonLink>
                  ))}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-12 grid gap-6 rounded-2xl bg-sand-100 p-6 sm:p-8 md:grid-cols-[1.4fr_1fr] md:items-center">
            <p className="text-sm leading-relaxed text-ink-700">
              These services are run by independent organizations; availability and details may
              change. {site.name} is not a crisis service, and our website, contact form, and email
              are not monitored for emergencies.
            </p>
            <div className="md:text-right">
              <p className="font-serif text-lg text-ink-900">When you’re ready for ongoing support</p>
              <ButtonLink
                href="/contact"
                variant="text"
                iconPosition="end"
                className="mt-2"
                icon={
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  />
                }
              >
                Contact Sunset Counseling Center
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
