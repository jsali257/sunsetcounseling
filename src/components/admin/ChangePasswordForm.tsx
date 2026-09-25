"use client";

import { useActionState } from "react";
import { LoaderCircle } from "lucide-react";
import { changePassword } from "@/app/admin/_actions/auth";
import { idle } from "@/lib/admin/form-state";
import { PASSWORD_MIN_LENGTH } from "@/lib/auth/password-rules";
import { Button } from "@/components/ui/Button";
import { FieldError, Notice, inputClass, labelClass } from "./ui";

const fields = [
  { name: "current", label: "Current password", autoComplete: "current-password" },
  { name: "next", label: "New password", autoComplete: "new-password" },
  { name: "confirm", label: "Confirm new password", autoComplete: "new-password" },
] as const;

export function ChangePasswordForm({ required }: { required: boolean }) {
  const [state, action, pending] = useActionState(changePassword, idle);
  const e = state.fieldErrors ?? {};
  return (
    <form action={action} className="space-y-4" key={state.ok ? "done" : "form"}>
      {state.ok && <Notice tone="success">{state.message}</Notice>}
      {fields.map((f) => (
        <div key={f.name}>
          <label htmlFor={`pw-${f.name}`} className={labelClass}>
            {required && f.name === "current" ? "Temporary password" : f.label}
          </label>
          <input
            id={`pw-${f.name}`}
            name={f.name}
            type="password"
            autoComplete={f.autoComplete}
            required
            minLength={f.name === "current" ? undefined : PASSWORD_MIN_LENGTH}
            aria-invalid={e[f.name] ? true : undefined}
            aria-describedby={
              [e[f.name] ? `pw-${f.name}-error` : null, f.name === "next" ? "pw-hint" : null]
                .filter(Boolean)
                .join(" ") || undefined
            }
            className={inputClass}
          />
          {f.name === "next" && (
            <p id="pw-hint" className="mt-1.5 text-xs text-ink-600">
              At least {PASSWORD_MIN_LENGTH} characters. A few unrelated words make a strong, memorable password.
            </p>
          )}
          <FieldError id={`pw-${f.name}-error`} message={e[f.name]} />
        </div>
      ))}
      <Button type="submit" disabled={pending}>
        {pending && <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />}
        {required ? "Set password and continue" : "Update password"}
      </Button>
    </form>
  );
}
