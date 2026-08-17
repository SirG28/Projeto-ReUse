"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { loginAction } from "@/app/actions/auth";
import Logo from "@/components/Logo";
import PrimaryButton from "@/components/PrimaryButton";
import { inputClass, inputHeightClass } from "@/lib/formStyles";

type Props = {
  defaultEmail: string;
  defaultRemember: boolean;
};

export default function LoginForm({ defaultEmail, defaultRemember }: Props) {
  const [state, formAction, pending] = useActionState(loginAction, undefined);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(defaultRemember);

  return (
    <div className="flex h-dvh flex-col px-4">
      <div className="flex-1">
        <div className="mb-7 mt-[88px]">
          <Logo markSize={38} className="mb-3" />
          <p className="text-sm text-[#7B7B7B]">Entre na sua conta:</p>
        </div>

        <form id="login-form" action={formAction} className="flex flex-col gap-3">
          <input
            name="email"
            type="email"
            autoCapitalize="none"
            defaultValue={defaultEmail}
            placeholder="E-mail"
            className={`${inputClass} ${inputHeightClass}`}
          />

          <div className="relative flex items-center">
            <input
              name="password"
              type={mostrarSenha ? "text" : "password"}
              placeholder="Senha"
              className={`${inputClass} ${inputHeightClass} pr-16`}
            />
            <button
              type="button"
              onClick={() => setMostrarSenha((v) => !v)}
              className="absolute right-3 text-xs font-semibold text-reuse-green"
            >
              {mostrarSenha ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          <label className="mt-0.5 flex items-center gap-2">
            <input
              type="checkbox"
              name="remember"
              checked={lembrar}
              onChange={(e) => setLembrar(e.target.checked)}
              className="h-4 w-4 rounded border border-[#707070] accent-[#639922]"
            />
            <span className="text-sm text-[#7B7B7B]">Lembrar de mim</span>
          </label>

          {state?.error && (
            <p className="rounded-lg border border-reuse-danger/30 bg-red-50 px-3 py-2 text-sm text-reuse-danger">
              {state.error}
            </p>
          )}
        </form>
      </div>

      <div className="pb-[18px]">
        <div className="mb-3.5 flex items-center justify-center gap-1">
          <span className="text-[13px] text-[#8B8B8B]">
            Ainda não tem uma conta?
          </span>
          <Link
            href="/register"
            className="text-[13px] text-reuse-green underline"
          >
            Criar conta
          </Link>
        </div>

        <PrimaryButton form="login-form" disabled={pending}>
          {pending ? "Entrando..." : "Entrar"}
        </PrimaryButton>
      </div>
    </div>
  );
}
