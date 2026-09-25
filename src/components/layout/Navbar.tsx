"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { mainNav, site, ctaLinks } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { MobileNavigation } from "./MobileNavigation";
import { cn } from "@/lib/cn";
import { isActive } from "@/lib/nav";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-500 ease-[var(--ease-gentle)]",
        scrolled
          ? "border-b border-sand-200/80 bg-cream-100/88 shadow-[0_8px_30px_-20px_rgb(45_35_30/0.35)] backdrop-blur-md"
          : "border-b border-transparent bg-cream-100/0",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[88rem] items-center justify-between gap-3 px-5 sm:gap-6 transition-[padding] duration-500 sm:px-8 lg:px-10",
          scrolled ? "py-3" : "py-4 lg:py-5",
        )}
      >
        <Logo />

        <nav aria-label="Main" className="hidden nav:block">
          <ul className="flex items-center gap-0.5">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-2.5 py-2 text-[0.875rem] whitespace-nowrap transition-colors duration-300",
                      active ? "text-ink-950" : "text-ink-700 hover:text-ink-950",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-2.5 -bottom-0.5 h-px origin-left bg-terracotta-500 transition-transform duration-300",
                        active ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={site.phone.href}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm whitespace-nowrap text-ink-700 transition-colors hover:text-ink-950 lg:inline-flex nav:hidden wide:inline-flex"
          >
            <Phone aria-hidden="true" className="h-4 w-4 text-terracotta-600" />
            <span>{site.phone.display}</span>
          </a>
          <div className="hidden sm:block">
            <ButtonLink href={ctaLinks.appointment} className="whitespace-nowrap">
              Request an Appointment
            </ButtonLink>
          </div>
          <MobileNavigation pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
