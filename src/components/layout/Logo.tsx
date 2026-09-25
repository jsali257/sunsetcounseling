import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";

export function Logo({ tone = "default", className }: { tone?: "default" | "light"; className?: string }) {
  const light = tone === "light";
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5 rounded-lg sm:gap-3", className)}
      aria-label="Sunset Counseling Center, PLLC — Home"
    >
      <Image
        src="/sunsetlogo.png"
        alt="Sunset Counseling Center, PLLC"
        width={1280}
        height={1280}
        priority
        className={cn(
          "h-16 w-16 object-contain transition-transform duration-500 group-hover:-translate-y-0.5",
          light && "h-24 w-24",
        )}
      />
    </Link>
  );
}
