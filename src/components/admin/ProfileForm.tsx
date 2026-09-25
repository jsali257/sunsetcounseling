"use client";

import { useActionState, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { updateOwnProfile } from "@/app/admin/_actions/auth";
import { idle } from "@/lib/admin/form-state";
import { Button } from "@/components/ui/Button";
import { FieldError, Notice, inputClass, labelClass } from "./ui";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [state, action, pending] = useActionState(updateOwnProfile, idle);
  const [emailValue, setEmailValue] = useState(email);
  const e = state.fieldErrors ?? {};
  const emailChanged = emailValue.trim().toLowerCase() !== email;

  return (
    <form action={action} className="space-y-4">
      {state.ok && <Notice tone="success">{state.message}</Notice>}
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <div>
        <label htmlFor="profile-name" className={labelClass}>Name</label>
        <input
          id="profile-name"
          name="name"
          defaultValue={name}
          required
          maxLength={100}
          autoComplete="name"
          aria-invalid={e.name ? true : undefined}
          aria-describedby={e.name ? "profile-name-error" : undefined}
          className={inputClass}
        />
        <FieldError id="profile-name-error" message={e.name} />
      </div>
      <div>
        <label htmlFor="profile-email" className={labelClass}>Email (used to sign in)</label>
        <input
          id="profile-email"
          name="email"
          type="email"
          value={emailValue}
          onChange={(ev) => setEmailValue(ev.target.value)}
          required
          autoComplete="email"
          aria-invalid={e.email ? true : undefined}
          aria-describedby={e.email ? "profile-email-error" : undefined}
          className={inputClass}
        />
        <FieldError id="profile-email-error" message={e.email} />
      </div>
      {emailChanged && (
        <div>
          <label htmlFor="profile-password" className={labelClass}>Current password</label>
          <input
            id="profile-password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            aria-invalid={e.password ? true : undefined}
            aria-describedby={e.password ? "profile-password-error" : "profile-password-hint"}
            className={inputClass}
          />
          <p id="profile-password-hint" className="mt-1.5 text-xs text-ink-600">
            Required to change the email you sign in with.
          </p>
          <FieldError id="profile-password-error" message={e.password} />
        </div>
      )}
      <Button type="submit" disabled={pending}>
        {pending && <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />}
        Save profile
      </Button>
    </form>
  );
}
