import { cn } from "@/lib/cn";

/** Brand mark: a setting sun resting on soft horizon lines. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn("shrink-0", className)}>
      <path d="M8 25a12 12 0 0 1 24 0Z" fill="var(--color-terracotta-500)" />
      <path d="M13.5 25a6.5 6.5 0 0 1 13 0Z" fill="var(--color-peach-200)" opacity="0.55" />
      <g stroke="var(--color-sage-600)" strokeLinecap="round" strokeWidth="1.8" fill="none">
        <path d="M4 29.5h32" />
        <path d="M9.5 33.5h21" />
        <path d="M15 37.5h10" />
      </g>
    </svg>
  );
}

/** Thin botanical silhouette used as a quiet accent. */
export function Sprig({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 220"
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
    >
      <path d="M62 216C58 160 60 96 76 8" />
      <path d="M61 176c-18-4-32-16-38-34 18 2 32 14 38 34Z" />
      <path d="M61 150c14-8 30-10 44-4-10 12-26 16-44 4Z" />
      <path d="M62 122c-16-8-26-22-28-40 16 6 26 20 28 40Z" />
      <path d="M64 96c12-12 26-18 42-16-6 14-22 22-42 16Z" />
      <path d="M67 70c-12-10-18-24-16-40 12 8 18 22 16 40Z" />
      <path d="M71 44c8-12 20-20 34-20-4 14-16 22-34 20Z" />
    </svg>
  );
}

/** A single thin, organic curve for section transitions. */
export function FlowLine({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("pointer-events-none h-10 w-full", className)}
      fill="none"
    >
      <path
        d="M0 38C160 10 300 8 460 26s320 34 480 14 220-20 260-16"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
