import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { FlowLine } from "@/components/ui/Decorations";
import { JsonLd, breadcrumbSchema } from "@/lib/structured-data";

export function PageHeader({
  title,
  eyebrow,
  intro,
  path,
  children,
}: {
  title: string;
  eyebrow?: string;
  intro?: ReactNode;
  /** Route path, used for breadcrumbs. */
  path: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden">
      <JsonLd data={breadcrumbSchema([{ name: title, path }])} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-[-14rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(closest-side,var(--color-peach-100),transparent)]"
      />
      <Container className="relative pt-8 pb-14 sm:pt-12 sm:pb-20">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-sm text-ink-600">
            <li>
              <Link href="/" className="rounded hover:text-ink-900">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5 text-ink-500" />
            </li>
            <li>
              <span aria-current="page" className="text-ink-900">
                {eyebrow ?? title}
              </span>
            </li>
          </ol>
        </nav>
        <h1 className="mt-8 max-w-3xl text-[2.25rem] leading-[1.1] text-ink-900 sm:text-5xl lg:text-[3.5rem]">
          {title}
        </h1>
        {intro && (
          <div className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-700 sm:text-xl">{intro}</div>
        )}
        {children}
      </Container>
      <FlowLine className="absolute bottom-0 text-sand-300" />
    </header>
  );
}
