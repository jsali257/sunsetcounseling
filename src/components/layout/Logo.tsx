import Link from "next/link";
import Image from "next/image";
import { brand } from "@/content/brand";
import { cn } from "@/lib/cn";

/** Horizontal arrangement of the logo artwork, sized for navigation bars. */
export function LogoLockup({ preload = false }: { preload?: boolean }) {
  return (
    <span className="flex items-center gap-2.5 sm:gap-3">
      <Image
        src={brand.logoMark}
        alt=""
        preload={preload}
        sizes="96px"
        className="h-[1.9rem] w-auto shrink-0 sm:h-[2.6rem]"
      />
      <span className="flex flex-col items-start">
        <Image
          src={brand.logoScript}
          alt=""
          preload={preload}
          sizes="128px"
          className="h-[1.8rem] w-auto sm:h-[2.2rem]"
        />
        {/* Real text, so the name stays legible at small sizes and readable by screen readers. */}
        <span className="mt-0.5 text-[0.56rem] font-semibold tracking-[0.2em] whitespace-nowrap text-ink-700 uppercase sm:text-[0.64rem]">
          Counseling Center, PLLC
        </span>
      </span>
    </span>
  );
}

export function Logo({
  variant = "lockup",
  className,
  preload = false,
}: {
  /** "lockup" for navigation bars, "full" for the complete stacked logo. */
  variant?: "lockup" | "full";
  className?: string;
  preload?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex rounded-lg", className)}
      aria-label="Sunset Counseling Center, PLLC — Home"
    >
      {variant === "full" ? (
        <Image
          src={brand.logoFull}
          alt=""
          sizes="208px"
          className="h-auto w-44 sm:w-52"
        />
      ) : (
        <span className="transition-transform duration-500 group-hover:-translate-y-0.5">
          <LogoLockup preload={preload} />
        </span>
      )}
    </Link>
  );
}
