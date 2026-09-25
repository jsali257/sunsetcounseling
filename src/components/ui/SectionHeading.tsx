import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  id?: string;
  tone?: "default" | "light";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  as: Heading = "h2",
  id,
  tone = "default",
  className,
}: SectionHeadingProps) {
  const light = tone === "light";
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em]",
            light ? "text-peach-200" : "text-terracotta-700",
          )}
        >
          <span
            aria-hidden="true"
            className={cn("h-px w-8", light ? "bg-peach-200/60" : "bg-terracotta-400/70")}
          />
          {eyebrow}
        </p>
      )}
      <Heading
        id={id}
        className={cn(
          Heading === "h1"
            ? "text-[2.25rem] leading-[1.1] sm:text-5xl lg:text-[3.5rem]"
            : "text-[1.875rem] leading-[1.15] sm:text-4xl lg:text-[2.75rem]",
          light ? "text-cream-50" : "text-ink-900",
        )}
      >
        {title}
      </Heading>
      {intro && (
        <div
          className={cn(
            "mt-5 text-lg leading-relaxed",
            light ? "text-cream-50/85" : "text-ink-600",
          )}
        >
          {intro}
        </div>
      )}
    </div>
  );
}
