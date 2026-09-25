"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";
import { addInquiryNote, deleteInquiry, updateInquiryStatus } from "@/app/admin/_actions/inquiries";
import { idle, type ActionState } from "@/lib/admin/form-state";
import { inquiryStatuses, statusLabels, type InquiryStatus } from "@/lib/db/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { FieldError, Notice, inputClass, labelClass } from "./ui";

export function StatusForm({ id, status }: { id: string; status: InquiryStatus }) {
  const [state, action, pending] = useActionState(updateInquiryStatus.bind(null, id), idle);
  return (
    <form action={action}>
      <fieldset disabled={pending}>
        <legend className={labelClass}>Status</legend>
        <div className="grid grid-cols-2 gap-2">
          {inquiryStatuses.map((s) => (
            <button
              key={s}
              type="submit"
              name="status"
              value={s}
              aria-pressed={s === status}
              className={cn(
                "min-h-10 rounded-lg border px-3 text-sm transition-colors",
                s === status
                  ? "border-ink-900 bg-ink-900 text-cream-50"
                  : "border-sand-300 bg-white text-ink-800 hover:border-ink-500/50",
              )}
            >
              {statusLabels[s]}
            </button>
          ))}
        </div>
      </fieldset>
      <div aria-live="polite" className="mt-2 min-h-5 text-sm">
        {pending ? (
          <span className="text-ink-600">Saving…</span>
        ) : state.error ? (
          <span className="text-terracotta-800">{state.error}</span>
        ) : state.message ? (
          <span className="text-sage-700">{state.message}</span>
        ) : null}
      </div>
    </form>
  );
}

export function NoteForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(addInquiryNote.bind(null, id), idle);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <label htmlFor="note" className={labelClass}>
        Add an internal note
      </label>
      <textarea
        id="note"
        name="body"
        rows={3}
        maxLength={2000}
        placeholder="e.g. Left a voicemail; will try again tomorrow."
        aria-invalid={state.fieldErrors?.body ? true : undefined}
        aria-describedby={state.fieldErrors?.body ? "note-error" : "note-hint"}
        className={cn(inputClass, "resize-y")}
      />
      <p id="note-hint" className="text-xs text-ink-600">
        Visible to all staff. Keep notes brief and avoid detailed clinical information.
      </p>
      <FieldError id="note-error" message={state.fieldErrors?.body} />
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <Button type="submit" disabled={pending}>
        {pending && <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />}
        Add note
      </Button>
    </form>
  );
}

export function DeleteInquiryButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionState>(idle);
  return (
    <div>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!window.confirm("Permanently delete this inquiry? This can’t be undone.")) return;
          startTransition(async () => setResult(await deleteInquiry(id)));
        }}
        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-terracotta-300 px-3.5 text-sm text-terracotta-800 hover:bg-peach-100 disabled:opacity-60"
      >
        <Trash2 aria-hidden="true" className="h-4 w-4" />
        {pending ? "Deleting…" : "Delete inquiry"}
      </button>
      {result.error && (
        <p role="alert" className="mt-2 text-sm text-terracotta-800">
          {result.error}
        </p>
      )}
    </div>
  );
}
