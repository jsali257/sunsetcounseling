import Link from "next/link";
import { LogoMark } from "@/components/ui/Decorations";
import { cn } from "@/lib/cn";

export function Logo({ tone = "default", className }: { tone?: "default" | "light"; className?: string }) {
  const light = tone === "light";
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5 rounded-lg sm:gap-3", className)}
      aria-label="Sunset Counseling Center, PLLC — Home"
    >
      <LogoMark className="h-8 w-8 sm:h-9 sm:w-9 transition-transform duration-500 group-hover:-translate-y-0.5" />
      <span className="flex flex-col leading-none whitespace-nowrap">
        <span
          className={cn(
            "font-serif text-[0.9375rem] tracking-[-0.01em] min-[380px]:text-[1.0625rem] sm:text-[1.2rem]",
            light ? "text-cream-50" : "text-ink-900",
          )}
        >
          Sunset Counseling Center
        </span>
        <span
          className={cn(
            "mt-1 text-[0.625rem] font-semibold uppercase tracking-[0.28em]",
            light ? "text-peach-200" : "text-terracotta-700",
          )}
        >
          PLLC
        </span>
      </span>
    </Link>
  );
}
