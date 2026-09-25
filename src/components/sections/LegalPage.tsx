import type { ReactNode } from "react";
import { Phone } from "lucide-react";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "./PageHeader";

/**
 * Layout for policy pages. The copy on these pages is a general overview —
 * the practice should review and finalize it with its compliance or legal advisor.
 */
export function LegalPage({
  title,
  path,
  intro,
  children,
}: {
  title: string;
  path: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <PageHeader path={path} title={title} intro={intro} />
      <section aria-label={title} className="py-16 sm:py-20">
        <Container size="narrow">
          <div className="prose-legal">{children}</div>

          <div className="mt-14 flex flex-col gap-4 rounded-2xl bg-sand-100 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <p className="text-ink-800">
              Questions about this page? Contact {site.name}.
            </p>
            <a
              href={site.phone.href}
              className="inline-flex min-h-11 items-center gap-2 font-medium text-terracotta-800 underline decoration-terracotta-300 underline-offset-4 hover:decoration-terracotta-700"
            >
              <Phone aria-hidden="true" className="h-4 w-4" />
              {site.phone.display}
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
