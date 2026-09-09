"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login, type LoginState } from "@/app/admin/login/actions";
import { Banner, Field, PrimaryButton, inputClass } from "@/components/admin/ui";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <PrimaryButton type="submit" disabled={pending} className="w-full">
      {pending ? "Signing in…" : "Sign in"}
    </PrimaryButton>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.error && <Banner tone="error">{state.error}</Banner>}
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label="Email">
        <input
          className={inputClass}
          type="email"
          name="email"
          autoComplete="username"
          required
          autoFocus
        />
      </Field>
      <Field label="Password">
        <input
          className={inputClass}
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
      </Field>
      <SubmitButton />
    </form>
  );
}
