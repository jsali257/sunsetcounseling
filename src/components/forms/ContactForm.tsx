"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, CircleCheck, CircleAlert, LoaderCircle, Lock, Phone } from "lucide-react";
import { submitAppointmentRequest } from "@/app/actions/appointment";
import { appointment, formOptions, site } from "@/content/site";
import { MESSAGE_MAX, type InquiryField, type InquiryState } from "@/lib/inquiry";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const initialState: InquiryState = { status: "idle" };

const inputClass =
  "block w-full min-h-12 rounded-xl border border-sand-300 bg-cream-50 px-4 py-3 text-base text-ink-900 placeholder:text-ink-500/70 transition-[border-color,box-shadow] duration-200 hover:border-sand-300 focus:border-terracotta-500 focus:outline-none focus:ring-4 focus:ring-terracotta-300/30 aria-[invalid=true]:border-terracotta-600";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-sm text-terracotta-800">
      <CircleAlert aria-hidden="true" className="h-4 w-4 shrink-0" />
      {message}
    </p>
  );
}

function Label({ htmlFor, children, optional }: { htmlFor: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-[0.9375rem] font-medium text-ink-900">
      {children}
      {optional && <span className="ml-1.5 font-normal text-ink-500">(optional)</span>}
    </label>
  );
}

function RadioPills({
  legend,
  name,
  options,
  defaultValue,
  error,
  formId,
}: {
  legend: string;
  name: InquiryField;
  options: readonly { value: string; label: string }[];
  defaultValue?: string;
  error?: string;
  formId: string;
}) {
  const errorId = `${formId}-${name}-error`;
  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="mb-2.5 text-[0.9375rem] font-medium text-ink-900">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const id = `${formId}-${name}-${option.value}`;
          return (
            <div key={option.value}>
              <input
                type="radio"
                id={id}
                name={name}
                value={option.value}
                defaultChecked={defaultValue === option.value}
                required
                className="peer sr-only"
              />
              <label
                htmlFor={id}
                className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-sand-300 bg-cream-50 px-4 py-2 text-[0.9375rem] text-ink-800 transition-colors duration-200 select-none hover:border-ink-500/50 peer-checked:border-terracotta-700 peer-checked:bg-terracotta-700 peer-checked:text-cream-50 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-terracotta-600"
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}

type ContactFormProps = { initialReason?: string };

export function ContactForm({ initialReason }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(submitAppointmentRequest, initialState);
  const formId = useId();
  const statusRef = useRef<HTMLDivElement>(null);
  const [messageLength, setMessageLength] = useState(state.values?.message?.length ?? 0);

  const v = state.values ?? {};
  const e = state.errors ?? {};
  const reasonDefault =
    v.reason ??
    (formOptions.reason.some((r) => r.value === initialReason) ? initialReason : "counseling");
  const formatDefault = v.format ?? (initialReason === "telehealth" ? "telehealth" : undefined);

  // Move focus to the result so screen reader and keyboard users hear the outcome.
  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl border border-sage-200 bg-sage-100/60 p-8 text-center focus:outline-none sm:p-10"
      >
        <CircleCheck aria-hidden="true" className="mx-auto h-10 w-10 text-sage-700" strokeWidth={1.5} />
        <h3 className="mt-5 text-2xl text-ink-900">Thank you for reaching out</h3>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-700">
          Your request has been sent. The office will contact you using your preferred method. If
          you need to speak with someone sooner, please call{" "}
          <a href={site.phone.href} className="font-medium text-terracotta-800 underline underline-offset-4">
            {site.phone.display}
          </a>
          .
        </p>
      </div>
    );
  }

  const describedBy = (field: InquiryField, extra?: string) =>
    [e[field] ? `${formId}-${field}-error` : null, extra].filter(Boolean).join(" ") || undefined;

  return (
    <form action={formAction} noValidate className="space-y-7" aria-describedby={`${formId}-privacy`}>
      <div
        id={`${formId}-privacy`}
        className="flex gap-3 rounded-xl border border-sand-200 bg-sand-100/70 p-4 text-sm leading-relaxed text-ink-700"
      >
        <Lock aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sage-700" />
        <p>
          <strong className="font-semibold text-ink-900">Privacy notice: </strong>
          {appointment.formPrivacyNotice} If this is an emergency, call 911 or call or text 988.
        </p>
      </div>

      <div
        ref={statusRef}
        tabIndex={-1}
        aria-live="polite"
        className="focus:outline-none empty:hidden"
      >
        {state.status === "error" && state.message && (
          <p className="flex items-start gap-2 rounded-xl border border-terracotta-300 bg-peach-100 p-4 text-[0.95rem] text-terracotta-800">
            <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            {state.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor={`${formId}-reason`}>What can we help with?</Label>
        <div className="relative">
        <select
          id={`${formId}-reason`}
          name="reason"
          defaultValue={reasonDefault}
          aria-invalid={e.reason ? true : undefined}
          aria-describedby={describedBy("reason")}
          className={cn(inputClass, "appearance-none pr-11")}
        >
          {formOptions.reason.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-ink-600" />
        </div>
        <FieldError id={`${formId}-reason-error`} message={e.reason} />
      </div>

      <div>
        <Label htmlFor={`${formId}-name`}>Name</Label>
        <input
          id={`${formId}-name`}
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={100}
          defaultValue={v.name}
          aria-invalid={e.name ? true : undefined}
          aria-describedby={describedBy("name")}
          className={inputClass}
        />
        <FieldError id={`${formId}-name-error`} message={e.name} />
      </div>

      <div className="grid gap-7 sm:grid-cols-2 sm:gap-5">
        <div>
          <Label htmlFor={`${formId}-phone`}>Phone</Label>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            defaultValue={v.phone}
            aria-invalid={e.phone ? true : undefined}
            aria-describedby={describedBy("phone")}
            className={inputClass}
          />
          <FieldError id={`${formId}-phone-error`} message={e.phone} />
        </div>
        <div>
          <Label htmlFor={`${formId}-email`}>Email</Label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            defaultValue={v.email}
            aria-invalid={e.email ? true : undefined}
            aria-describedby={describedBy("email")}
            className={inputClass}
          />
          <FieldError id={`${formId}-email-error`} message={e.email} />
        </div>
      </div>

      <RadioPills
        legend="Preferred contact method"
        name="contactMethod"
        options={formOptions.contactMethod}
        defaultValue={v.contactMethod}
        error={e.contactMethod}
        formId={formId}
      />
      <RadioPills
        legend="In-person or telehealth?"
        name="format"
        options={formOptions.format}
        defaultValue={formatDefault}
        error={e.format}
        formId={formId}
      />
      <RadioPills
        legend="Preferred language / Idioma preferido"
        name="language"
        options={formOptions.language}
        defaultValue={v.language}
        error={e.language}
        formId={formId}
      />

      <div>
        <Label htmlFor={`${formId}-message`} optional>
          General message
        </Label>
        <p id={`${formId}-message-hint`} className="-mt-1 mb-2 text-sm text-ink-600">
          A brief note about what you are looking for is enough — for example, availability or
          questions about services.
        </p>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={4}
          maxLength={MESSAGE_MAX}
          defaultValue={v.message}
          onChange={(ev) => setMessageLength(ev.target.value.length)}
          aria-invalid={e.message ? true : undefined}
          aria-describedby={describedBy("message", `${formId}-message-hint`)}
          className={cn(inputClass, "min-h-32 resize-y")}
        />
        <div className="mt-1.5 flex justify-between gap-4">
          <FieldError id={`${formId}-message-error`} message={e.message} />
          <p className="ml-auto text-xs text-ink-500" aria-hidden="true">
            {messageLength}/{MESSAGE_MAX}
          </p>
        </div>
      </div>

      {/* Honeypot for spam bots — hidden from people and assistive technology. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${formId}-company`}>Company</label>
        <input id={`${formId}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <div className="flex gap-3">
          <input
            id={`${formId}-ack`}
            name="acknowledgement"
            type="checkbox"
            required
            defaultChecked={v.acknowledgement === "on"}
            aria-invalid={e.acknowledgement ? true : undefined}
            aria-describedby={describedBy("acknowledgement")}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-sand-300 accent-terracotta-700"
          />
          <label htmlFor={`${formId}-ack`} className="cursor-pointer text-[0.9375rem] leading-relaxed text-ink-700">
            I understand this form is not for emergencies and I will not include detailed or
            sensitive clinical information.
          </label>
        </div>
        <FieldError id={`${formId}-acknowledgement-error`} message={e.acknowledgement} />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-sand-200 pt-7 sm:justify-between">
        <Button type="submit" size="lg" disabled={pending} className="w-full whitespace-nowrap sm:w-auto">
          {pending && <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />}
          {pending ? "Sending…" : "Request an Appointment"}
        </Button>
        <a
          href={site.phone.href}
          className="inline-flex min-h-11 items-center justify-center gap-2 text-[0.9375rem] whitespace-nowrap text-ink-700 hover:text-ink-950"
        >
          <Phone aria-hidden="true" className="h-4 w-4 text-terracotta-600" />
          Prefer to call? {site.phone.display}
        </a>
      </div>
    </form>
  );
}

/** Reads ?reason= from the URL so CTAs like “Discuss an Evaluation” preselect the inquiry type. */
export function ContactFormWithParams() {
  const params = useSearchParams();
  return <ContactForm initialReason={params.get("reason") ?? undefined} />;
}
