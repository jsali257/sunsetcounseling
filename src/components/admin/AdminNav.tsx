"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, ChartColumn, Users, ScrollText, UserRound, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type Item = { href: string; label: string; icon: LucideIcon; adminOnly?: boolean; badge?: number };

export function AdminNav({ isAdmin, newCount }: { isAdmin: boolean; newCount: number }) {
  const pathname = usePathname();
  const items: Item[] = [
    { href: "/admin", label: "Inquiries", icon: Inbox, badge: newCount },
    { href: "/admin/stats", label: "Stats", icon: ChartColumn, adminOnly: true },
    { href: "/admin/team", label: "Team", icon: Users, adminOnly: true },
    { href: "/admin/audit", label: "Audit log", icon: ScrollText, adminOnly: true },
    { href: "/admin/account", label: "My account", icon: UserRound },
  ];

  const isActive = (href: string) =>
    href === "/admin"
      ? pathname === "/admin" || pathname.startsWith("/admin/inquiries")
      : pathname.startsWith(href);

  return (
    <nav aria-label="Dashboard">
      <ul className="flex gap-1 overflow-x-auto [scrollbar-width:none] lg:flex-col lg:overflow-visible">
        {items
          .filter((item) => isAdmin || !item.adminOnly)
          .map(({ href, label, icon: Icon, badge }) => {
            const active = isActive(href);
            return (
              <li key={href} className="shrink-0">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-10 items-center gap-2.5 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors",
                    active
                      ? "bg-sand-100 font-medium text-ink-950"
                      : "text-ink-700 hover:bg-sand-100/70 hover:text-ink-950",
                  )}
                >
                  <Icon aria-hidden="true" className={cn("h-4 w-4", active ? "text-terracotta-700" : "text-ink-500")} />
                  {label}
                  {badge ? (
                    <span className="ml-auto rounded-full bg-terracotta-700 px-2 py-0.5 text-xs font-semibold text-cream-50">
                      {badge}
                      <span className="sr-only"> new</span>
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}
