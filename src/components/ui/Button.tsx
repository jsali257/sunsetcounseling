import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "dark" | "light" | "outline-light" | "text";
type Size = "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[0.01em] transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-[var(--ease-gentle)] focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-terracotta-700 text-cream-50 shadow-[0_6px_18px_-8px_rgb(139_69_47/0.55)] hover:bg-terracotta-800 hover:-translate-y-px hover:shadow-[0_10px_24px_-10px_rgb(139_69_47/0.6)] active:translate-y-0",
  secondary:
    "border border-ink-900/20 bg-cream-50/60 text-ink-900 hover:border-ink-900/40 hover:bg-cream-50",
  dark: "bg-ink-900 text-cream-50 hover:bg-ink-950 hover:-translate-y-px shadow-[0_8px_20px_-12px_rgb(33_25_21/0.6)]",
  light:
    "bg-cream-50 text-ink-900 hover:bg-white hover:-translate-y-px shadow-[0_8px_24px_-12px_rgb(0_0_0/0.45)]",
  "outline-light":
    "border border-cream-50/35 text-cream-50 hover:border-cream-50/70 hover:bg-cream-50/10",
  text: "px-0! py-0! min-h-0! rounded-none text-terracotta-700 underline decoration-terracotta-300 decoration-1 underline-offset-[6px] hover:decoration-terracotta-700",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 py-2.5 text-[0.9375rem]",
  lg: "min-h-12 px-7 py-3 text-base",
};

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;

/**
 * Link styled as a button. Internal routes use next/link;
 * tel:, mailto:, and external URLs render a plain anchor.
 */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "start",
  children,
  className,
  ...rest
}: ButtonLinkProps) {
  const classes = cn(base, variants[variant], sizes[size], className);
  const content = (
    <>
      {icon && iconPosition === "start" && icon}
      <span>{children}</span>
      {icon && iconPosition === "end" && icon}
    </>
  );

  const isInternal = href.startsWith("/") || href.startsWith("#");
  if (isInternal) {
    return (
      <Link href={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  const isExternal = href.startsWith("http");
  return (
    <a
      href={href}
      className={classes}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {content}
    </a>
  );
}

type ButtonProps = {
  variant?: Variant;
  size?: Size;
} & ComponentPropsWithoutRef<"button">;

export function Button({ variant = "primary", size = "md", className, ...rest }: ButtonProps) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...rest} />;
}
