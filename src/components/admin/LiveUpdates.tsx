"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BellRing, X } from "lucide-react";
import type { InquirySignature } from "@/lib/inquiries/repository";

const POLL_MS = 10_000;
const TITLE_PREFIX = /^\(\d+\)\s/;

/**
 * Keeps the dashboard current without manual reloads. Every 10 seconds (and
 * whenever the tab regains focus) it asks the server for a tiny signature of
 * the inquiries; only when that changes does it re-fetch the page data.
 * router.refresh() keeps typed text, open forms, and scroll position.
 */
export function LiveUpdates({ initial }: { initial: InquirySignature }) {
  const router = useRouter();
  const pathname = usePathname();
  const last = useRef(initial);
  const [newCount, setNewCount] = useState(initial.newCount);
  const [arrivals, setArrivals] = useState(0);

  useEffect(() => {
    let stopped = false;
    let inFlight = false;

    const check = async () => {
      if (stopped || inFlight || document.visibilityState !== "visible") return;
      inFlight = true;
      try {
        const res = await fetch("/admin/live", { cache: "no-store", redirect: "manual" });
        // Signed out or session expired: stop quietly; the next navigation shows the login page.
        if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) {
          stopped = true;
          return;
        }
        const next = (await res.json()) as InquirySignature;
        const prev = last.current;
        if (next.version !== prev.version) {
          if (next.total > prev.total) setArrivals((n) => n + (next.total - prev.total));
          last.current = next;
          setNewCount(next.newCount);
          router.refresh();
        }
      } catch {
        // Offline or a transient network error; try again next tick.
      } finally {
        inFlight = false;
      }
    };

    const timer = window.setInterval(check, POLL_MS);
    const onVisible = () => document.visibilityState === "visible" && check();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", check);
    return () => {
      stopped = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", check);
    };
  }, [router]);

  // Show the number of new inquiries in the browser tab, e.g. "(2) Inquiries | Staff Dashboard".
  useEffect(() => {
    const apply = () => {
      const base = document.title.replace(TITLE_PREFIX, "");
      const next = newCount > 0 ? `(${newCount}) ${base}` : base;
      if (document.title !== next) document.title = next;
    };
    apply();
    // Navigations and refreshes rewrite the title; re-apply the count whenever that happens.
    const observer = new MutationObserver(apply);
    observer.observe(document.head, { subtree: true, childList: true, characterData: true });
    return () => observer.disconnect();
  }, [newCount, pathname]);

  if (arrivals === 0) return null;

  return (
    <div
      role="status"
      className="fixed right-4 bottom-4 z-50 flex max-w-sm items-center gap-3 rounded-2xl border border-terracotta-300 bg-cream-50 p-4 shadow-[var(--shadow-lift)] sm:right-6 sm:bottom-6"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-peach-100 text-terracotta-700">
        <BellRing aria-hidden="true" className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink-900">
          {arrivals === 1 ? "New inquiry received" : `${arrivals} new inquiries received`}
        </p>
        <Link
          href="/admin?status=new"
          onClick={() => setArrivals(0)}
          className="text-sm text-terracotta-700 underline underline-offset-4"
        >
          View new inquiries
        </Link>
      </div>
      <button
        type="button"
        onClick={() => setArrivals(0)}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-600 hover:bg-sand-100"
      >
        <X aria-hidden="true" className="h-4 w-4" />
        <span className="sr-only">Dismiss</span>
      </button>
    </div>
  );
}
