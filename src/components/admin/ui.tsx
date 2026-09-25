import type { ReactNode } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";
import { statusLabels, type InquiryStatus } from "@/lib/db/types";
import { cn } from "@/lib/cn";

export const inputClass =
  "block w-full min-h-11 rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-[0.9375rem] text-ink-900 placeholder:text-ink-500/70 transition-[border-color,box-shadow] focus:border-terracotta-500 focus:outline-none focus:ring-4 focus:ring-terracotta-300/30 aria-[invalid=true]:border-terracotta-600";

export const labelClass = "mb-1.5 block text-sm font-medium text-ink-900";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-sand-200 bg-cream-50 shadow-[var(--shadow-soft)]", className)}>
      {children}
    </div>
  );
}

export function PageTitle({
  title,
  description,
  actions,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[1.75rem] leading-tight text-ink-900 sm:text-[2rem]">{title}</h1>
        {description && <p className="mt-1.5 text-ink-600">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

const statusStyles: Record<InquiryStatus, string> = {
  new: "bg-peach-100 text-terracotta-800 ring-terracotta-300/60",
  contacted: "bg-sand-100 text-ink-800 ring-sand-300",
  scheduled: "bg-sage-100 text-sage-700 ring-sage-300",
  closed: "bg-white text-ink-600 ring-sand-300",
};

export function StatusBadge({ status }: { status: InquiryStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap",
        statusStyles[status],
      )}
    >
      {status === "new" && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-terracotta-600" />}
      {statusLabels[status]}
    </span>
  );
}

export function Notice({
  tone,
  children,
  id,
}: {
  tone: "error" | "success" | "info";
  children: ReactNode;
  id?: string;
}) {
  const Icon = tone === "success" ? CircleCheck : CircleAlert;
  return (
    <div
      id={id}
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-xl border p-3.5 text-sm leading-relaxed",
        tone === "error" && "border-terracotta-300 bg-peach-100 text-terracotta-800",
        tone === "success" && "border-sage-300 bg-sage-100 text-sage-700",
        tone === "info" && "border-sand-300 bg-sand-100 text-ink-800",
      )}
    >
      <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-terracotta-800">
      {message}
    </p>
  );
}
