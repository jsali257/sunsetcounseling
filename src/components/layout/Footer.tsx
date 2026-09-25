import Link from "next/link";
import { Phone, MapPin } from "lucide-react";
import { site, footerNav, legalNav } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { Sprig } from "@/components/ui/Decorations";

function FooterLinks({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-peach-200">
        {title}
      </h2>
      <ul className="mt-5 space-y-1">
        {items.map((item) => (
          <li key={item.href + item.label}>
            <Link
              href={item.href}
              className="inline-flex min-h-10 items-center text-[0.95rem] text-cream-50/80 transition-colors hover:text-cream-50"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink-900 text-cream-50">
      <Sprig className="absolute -right-6 bottom-6 hidden h-72 w-40 text-cream-50/[0.07] md:block" />
      <Container className="relative pt-16 pb-28 sm:pb-12 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo tone="light" />
            <p className="mt-6 font-serif text-xl leading-snug text-cream-50/95">{site.tagline}</p>
            <p className="mt-3 text-[0.95rem] text-cream-50/70">
              Counseling services available in English and Spanish.
            </p>
            <p className="mt-1 text-[0.95rem] text-cream-50/70">McAllen • Telehealth</p>
          </div>

          <div>
            <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-peach-200">
              Contact
            </h2>
            <ul className="mt-5 space-y-4 text-[0.95rem]">
              <li>
                <a
                  href={site.phone.href}
                  className="inline-flex min-h-10 items-center gap-2.5 text-cream-50/90 transition-colors hover:text-cream-50"
                >
                  <Phone aria-hidden="true" className="h-4 w-4 text-peach-300" />
                  {site.phone.display}
                </a>
              </li>
              <li>
                <address className="flex gap-2.5 not-italic leading-relaxed text-cream-50/80">
                  <MapPin aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-peach-300" />
                  <span>
                    {site.address.street}
                    <br />
                    {site.address.city}, {site.address.state} {site.address.zip}
                  </span>
                </address>
              </li>
            </ul>
          </div>

          <FooterLinks title="Navigation" items={footerNav} />
          <FooterLinks title="Legal" items={legalNav} />
        </div>

        <div className="mt-14 border-t border-cream-50/10 pt-6 text-sm text-cream-50/60">
          <p>
            © {site.year} {site.name}. All Rights Reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
