"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { loginAction } from "@/app/actions/auth";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import PasswordInput from "@/components/PasswordInput";
import { inputClass, inputHeightClass } from "@/lib/formStyles";

type Props = {
  defaultEmail: string;
  defaultRemember: boolean;
};

export default function LoginForm({ defaultEmail, defaultRemember }: Props) {
  const [state, formAction, pending] = useActionState(loginAction, undefined);
  const [lembrar, setLembrar] = useState(defaultRemember);

  return (
    <div>
      <Logo size={34} className="mb-6 md:hidden" />

      <h1 className="mb-1 text-2xl font-bold text-reuse-text">Entrar</h1>
      <p className="mb-6 text-sm text-reuse-text-secondary">
        Entre na sua conta pra continuar trocando.
      </p>

      <form action={formAction} className="flex flex-col gap-3">
        <input
          name="email"
          type="email"
          autoCapitalize="none"
          defaultValue={defaultEmail}
          placeholder="E-mail"
          className={`${inputClass} ${inputHeightClass}`}
        />

        <PasswordInput name="password" placeholder="Senha" />

        <label className="mt-0.5 flex items-center gap-2">
          <input
            type="checkbox"
            name="remember"
            checked={lembrar}
            onChange={(e) => setLembrar(e.target.checked)}
            className="h-4 w-4 rounded border border-reuse-neutral-500 accent-reuse-green-dark"
          />
          <span className="text-sm text-reuse-text-secondary">Lembrar de mim</span>
        </label>

        {state?.error && (
          <p className="rounded-lg border border-reuse-danger/30 bg-red-50 px-3 py-2 text-sm text-reuse-danger">
            {state.error}
          </p>
        )}

        <Button type="submit" disabled={pending} className="mt-2">
          {pending ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <div className="mt-5 flex items-center justify-center gap-1">
        <span className="text-[13px] text-reuse-text-secondary">
          Ainda não tem uma conta?
        </span>
        <Link
          href="/register"
          className="text-[13px] font-semibold text-reuse-green underline"
        >
          Criar conta
        </Link>
      </div>
    </div>
  );
}
