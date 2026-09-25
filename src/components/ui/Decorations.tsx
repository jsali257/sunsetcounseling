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

/**
 * Abstract sunset landscape for the hero — layered hills, a low sun and grasses.
 * Pure SVG: no network request, crisp at any size.
 */
export function SunsetLandscape({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 640"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf1e7" />
          <stop offset="0.45" stopColor="#f8e0cd" />
          <stop offset="0.68" stopColor="#f1c7aa" />
        </linearGradient>
        <radialGradient id="hero-sun" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#fdf0e2" />
          <stop offset="1" stopColor="#f2c09d" />
        </radialGradient>
        <radialGradient id="hero-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff6ec" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff6ec" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hero-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dca086" />
          <stop offset="1" stopColor="#e7b89c" />
        </linearGradient>
        <linearGradient id="hero-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bcc5ad" />
          <stop offset="1" stopColor="#a8b499" />
        </linearGradient>
        <linearGradient id="hero-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#84937a" />
          <stop offset="1" stopColor="#6c7c61" />
        </linearGradient>
      </defs>

      <rect width="560" height="640" fill="url(#hero-sky)" />

      {/* soft light and organic rings */}
      <circle cx="310" cy="380" r="210" fill="url(#hero-glow)" />
      <g fill="none" stroke="#fffaf3" strokeWidth="1" opacity="0.7">
        <circle cx="310" cy="380" r="118" />
        <circle cx="310" cy="380" r="160" opacity="0.6" />
        <circle cx="310" cy="380" r="206" opacity="0.4" />
      </g>
      <circle cx="310" cy="380" r="80" fill="url(#hero-sun)" />

      {/* quiet clouds */}
      <g fill="#fffaf4" opacity="0.55">
        <rect x="58" y="180" width="150" height="7" rx="3.5" />
        <rect x="96" y="196" width="96" height="6" rx="3" opacity="0.7" />
        <rect x="360" y="132" width="120" height="6" rx="3" />
      </g>

      {/* layered hills */}
      <path
        d="M0 405C80 370 160 376 240 394s170 2 230-18c38-12 66-10 90-4V640H0Z"
        fill="url(#hero-far)"
        opacity="0.85"
      />
      <path
        d="M0 452c110-40 200-30 300-4s180 8 260-10V640H0Z"
        fill="url(#hero-mid)"
      />
      <path
        d="M0 520c130-44 250-26 370 2 80 18 140 12 190-4V640H0Z"
        fill="url(#hero-near)"
      />
      <path d="M0 588c150-34 320-6 560-22V640H0Z" fill="#56654c" />

      {/* reflective line on the horizon */}
      <path
        d="M178 468c40-6 90-6 132 0M214 480c30-4 64-4 92 0"
        stroke="#fbeee2"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
        fill="none"
      />

      {/* foreground grasses */}
      <g stroke="#3f4b37" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.9">
        <path d="M58 640c-2-44 4-86 22-124" />
        <path d="M66 640c4-36 16-66 38-92" />
        <path d="M48 640c-8-30-20-54-38-72" />
        <path d="M78 560c10-4 18-12 22-22-10 2-18 10-22 22Z" fill="#3f4b37" />
        <path d="M70 588c-12-2-22-10-26-20 12 0 22 8 26 20Z" fill="#3f4b37" />
        <path d="M494 640c2-40-4-74-18-104" />
        <path d="M506 640c6-28 18-52 34-68" />
        <path d="M478 574c-10-4-16-12-18-22 10 4 16 12 18 22Z" fill="#3f4b37" />
      </g>
    </svg>
  );
}
