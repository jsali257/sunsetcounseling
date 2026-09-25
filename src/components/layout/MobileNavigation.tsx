"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Phone, MapPin, ArrowRight } from "lucide-react";
import { mainNav, site, ctaLinks } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { cn } from "@/lib/cn";
import { isActive } from "@/lib/nav";


/**
 * Slide-out navigation built on the native <dialog> element,
 * which provides focus containment, Escape to close, and an inert background.
 */
export function MobileNavigation({ pathname }: { pathname: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const openMenu = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };
  const closeMenu = () => dialogRef.current?.close();

  // Close the drawer after navigating.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  // Prevent the page behind the drawer from scrolling.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="nav:hidden">
      <button
        type="button"
        onClick={openMenu}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink-900/15 bg-cream-50/70 text-ink-900 transition-colors hover:bg-cream-50"
      >
        <Menu aria-hidden="true" className="h-5 w-5" />
        <span className="sr-only">Open menu</span>
      </button>

      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        aria-label="Site navigation"
        className="nav-drawer"
        onClose={() => setOpen(false)}
        onClick={(e) => {
          // Clicking the backdrop closes the drawer.
          if (e.target === e.currentTarget) closeMenu();
        }}
      >
        <div className="flex h-full flex-col overflow-y-auto bg-cream-100 shadow-[-20px_0_60px_-30px_rgb(45_35_30/0.5)]">
          <div className="flex items-center justify-between border-b border-sand-200 px-5 py-4">
            <Logo />
            <button
              type="button"
              onClick={closeMenu}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-800 transition-colors hover:bg-sand-100"
            >
              <X aria-hidden="true" className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <nav aria-label="Mobile" className="px-3 py-4">
            <ul>
              {mainNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-13 items-center justify-between rounded-xl px-4 py-3 font-serif text-[1.3rem] transition-colors",
                        active
                          ? "bg-sand-100 text-ink-950"
                          : "text-ink-800 hover:bg-sand-100/70",
                      )}
                    >
                      {item.label}
                      <ArrowRight
                        aria-hidden="true"
                        className={cn(
                          "h-4 w-4",
                          active ? "text-terracotta-600" : "text-ink-500/60",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto space-y-3 border-t border-sand-200 bg-sand-100/60 px-5 py-6">
            <ButtonLink href={ctaLinks.appointment} size="lg" className="w-full" onClick={closeMenu}>
              Request an Appointment
            </ButtonLink>
            <ButtonLink
              href={site.phone.href}
              variant="secondary"
              size="lg"
              className="w-full"
              icon={<Phone aria-hidden="true" className="h-4 w-4" />}
            >
              Call {site.phone.display}
            </ButtonLink>
            <p className="flex items-start gap-2 pt-2 text-sm text-ink-600">
              <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" />
              {site.address.street} {site.address.city}, {site.address.state} {site.address.zip}
            </p>
          </div>
        </div>
      </dialog>
    </div>
  );
}
