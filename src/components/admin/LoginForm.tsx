"use client";

import { useActionState } from "react";
import { LoaderCircle } from "lucide-react";
import { login } from "@/app/admin/_actions/auth";
import { idle } from "@/lib/admin/form-state";
import { Button } from "@/components/ui/Button";
import { inputClass, labelClass, Notice } from "./ui";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(login, idle);
  return (
    <form action={action} className="space-y-5">
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <input type="hidden" name="next" value={next ?? ""} />
      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          autoFocus
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>
      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending && <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />}
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
