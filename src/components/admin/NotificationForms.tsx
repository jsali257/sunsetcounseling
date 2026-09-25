"use client";

import { useActionState, useState, useTransition } from "react";
import { LoaderCircle, Plus, Send, Trash2 } from "lucide-react";
import { addRecipient, removeRecipient, sendTestAlert } from "@/app/admin/_actions/notifications";
import { idle, type ActionState } from "@/lib/admin/form-state";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { FieldError, Notice, inputClass, labelClass } from "./ui";

export function AddRecipientForm() {
  const [state, action, pending] = useActionState(addRecipient, idle);
  const e = state.fieldErrors ?? {};
  return (
    // Remount after a successful add so the fields clear.
    <form action={action} className="space-y-4" key={state.ok ? state.message : "form"}>
      {state.ok && <Notice tone="success">{state.message}</Notice>}
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="recipient-email" className={labelClass}>Email</label>
          <input
            id="recipient-email"
            name="email"
            type="email"
            required
            autoComplete="off"
            aria-invalid={e.email ? true : undefined}
            aria-describedby={e.email ? "recipient-email-error" : undefined}
            className={inputClass}
          />
          <FieldError id="recipient-email-error" message={e.email} />
        </div>
        <div>
          <label htmlFor="recipient-name" className={labelClass}>
            Name <span className="font-normal text-ink-500">(optional)</span>
          </label>
          <input id="recipient-name" name="name" maxLength={100} autoComplete="off" className={inputClass} />
        </div>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Plus aria-hidden="true" className="h-4 w-4" />}
        Add recipient
      </Button>
    </form>
  );
}

export function RecipientActions({ email, label }: { email: string; label: string }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionState>(idle);
  const btn =
    "inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-sand-300 bg-white px-3 text-xs font-medium text-ink-800 hover:border-ink-500/50 disabled:opacity-50";

  return (
    <div className="space-y-2 sm:text-right">
      <div className="flex flex-wrap gap-2 sm:justify-end">
        <button
          type="button"
          disabled={pending}
          className={btn}
          onClick={() => startTransition(async () => setResult(await sendTestAlert(email)))}
        >
          <Send aria-hidden="true" className="h-3.5 w-3.5" />
          Send test
        </button>
        <button
          type="button"
          disabled={pending}
          className={cn(btn, "text-terracotta-800")}
          onClick={() => {
            if (!window.confirm(`Stop sending new-inquiry alerts to ${label}?`)) return;
            startTransition(async () => setResult(await removeRecipient(email)));
          }}
        >
          <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
          Remove
        </button>
      </div>
      <p aria-live="polite" className="text-xs">
        {pending ? (
          <span className="text-ink-600">Working…</span>
        ) : result.error ? (
          <span className="text-terracotta-800">{result.error}</span>
        ) : result.message ? (
          <span className="text-sage-700">{result.message}</span>
        ) : null}
      </p>
    </div>
  );
}
