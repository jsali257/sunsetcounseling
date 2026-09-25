"use client";

import { useActionState, useState, useTransition } from "react";
import { Copy, Check, LoaderCircle, UserPlus } from "lucide-react";
import { createUser, resetUserPassword, setUserActive, setUserRole } from "@/app/admin/_actions/users";
import { idle, type ActionState } from "@/lib/admin/form-state";
import { roleLabels, roles, type Role } from "@/lib/db/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { FieldError, Notice, inputClass, labelClass } from "./ui";

/** Shows a one-time secret (temporary password) with a copy button. */
function SecretReveal({ state }: { state: ActionState }) {
  const [copied, setCopied] = useState(false);
  if (!state.secret) return null;
  return (
    <Notice tone="success">
      <p>{state.message}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <code className="rounded-md bg-white px-2.5 py-1 font-mono text-[0.95rem] text-ink-900 ring-1 ring-sage-300">
          {state.secret}
        </code>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(state.secret!);
            setCopied(true);
          }}
          className="inline-flex min-h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-sage-700 hover:bg-white/70"
        >
          {copied ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : <Copy aria-hidden="true" className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </Notice>
  );
}

export function CreateUserForm() {
  const [state, action, pending] = useActionState(createUser, idle);
  const e = state.fieldErrors ?? {};
  return (
    <form action={action} className="space-y-4" key={state.secret ?? "form"}>
      {state.ok && <SecretReveal state={state} />}
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="new-name" className={labelClass}>Name</label>
          <input id="new-name" name="name" autoComplete="off" required maxLength={100}
            aria-invalid={e.name ? true : undefined} aria-describedby={e.name ? "new-name-error" : undefined}
            className={inputClass} />
          <FieldError id="new-name-error" message={e.name} />
        </div>
        <div>
          <label htmlFor="new-email" className={labelClass}>Email</label>
          <input id="new-email" name="email" type="email" autoComplete="off" required
            aria-invalid={e.email ? true : undefined} aria-describedby={e.email ? "new-email-error" : undefined}
            className={inputClass} />
          <FieldError id="new-email-error" message={e.email} />
        </div>
      </div>
      <fieldset>
        <legend className={labelClass}>Role</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {roles.map((role) => (
            <label key={role} className="flex cursor-pointer gap-3 rounded-lg border border-sand-300 bg-white p-3 has-[:checked]:border-ink-900 has-[:checked]:ring-1 has-[:checked]:ring-ink-900">
              <input type="radio" name="role" value={role} defaultChecked={role === "staff"} className="mt-1 accent-terracotta-700" />
              <span>
                <span className="block text-sm font-medium text-ink-900">{roleLabels[role]}</span>
                <span className="block text-xs text-ink-600">
                  {role === "admin"
                    ? "Everything, including stats, team, audit log, export, and deleting inquiries."
                    : "View and work inquiries: update status and add notes."}
                </span>
              </span>
            </label>
          ))}
        </div>
        <FieldError id="new-role-error" message={e.role} />
      </fieldset>
      <Button type="submit" disabled={pending}>
        {pending ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : <UserPlus aria-hidden="true" className="h-4 w-4" />}
        Add team member
      </Button>
    </form>
  );
}

export function UserRowActions({
  userId,
  name,
  role,
  active,
}: {
  userId: string;
  name: string;
  role: Role;
  active: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionState>(idle);
  const [roleValue, setRoleValue] = useState<Role>(role);
  const run = (fn: () => Promise<ActionState>, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    startTransition(async () => setResult(await fn()));
  };
  const btn =
    "inline-flex min-h-9 items-center rounded-lg border border-sand-300 bg-white px-3 text-xs font-medium text-ink-800 hover:border-ink-500/50 disabled:opacity-50";

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <label className="sr-only" htmlFor={`role-${userId}`}>Role for {name}</label>
        <select
          id={`role-${userId}`}
          value={roleValue}
          disabled={pending}
          onChange={(ev) => {
            const next = ev.target.value as Role;
            setRoleValue(next);
            run(async () => {
              const res = await setUserRole(userId, next);
              if (res.error) setRoleValue(role); // refused — show the actual role again
              return res;
            });
          }}
          className={cn(btn, "pr-2")}
        >
          {roles.map((r) => (
            <option key={r} value={r}>{roleLabels[r]}</option>
          ))}
        </select>
        <button
          type="button"
          disabled={pending}
          className={btn}
          onClick={() => run(() => resetUserPassword(userId), `Reset ${name}’s password? They’ll be signed out and need the new temporary password.`)}
        >
          Reset password
        </button>
        <button
          type="button"
          disabled={pending}
          className={cn(btn, active && "text-terracotta-800")}
          onClick={() =>
            run(
              () => setUserActive(userId, !active),
              active ? `Deactivate ${name}? They’ll be signed out immediately.` : undefined,
            )
          }
        >
          {active ? "Deactivate" : "Reactivate"}
        </button>
      </div>
      <div aria-live="polite">
        {result.secret ? (
          <SecretReveal state={result} />
        ) : result.error ? (
          <p className="text-xs text-terracotta-800">{result.error}</p>
        ) : result.message ? (
          <p className="text-xs text-sage-700">{result.message}</p>
        ) : null}
      </div>
    </div>
  );
}
