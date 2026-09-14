"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { registerAction } from "@/app/actions/auth";
import Button from "@/components/Button";
import Logo from "@/components/Logo";
import PasswordInput from "@/components/PasswordInput";
import { inputClass, inputHeightClass, labelClass } from "@/lib/formStyles";
import { useCepLookup } from "@/lib/useCepLookup";

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, undefined);

  const [cep, setCep] = useState("");
  const {
    cidade,
    setCidade,
    estado,
    setEstado,
    buscando: buscandoCep,
    erro: cepError,
  } = useCepLookup(cep);

  return (
    <div>
      <Logo size={34} className="mb-6 md:hidden" />

      <h1 className="mb-1 text-2xl font-bold text-reuse-text">Criar conta</h1>
      <p className="mb-6 text-sm text-reuse-text-secondary">
        Já tem uma conta?{" "}
        <Link href="/login" className="font-semibold text-reuse-green underline">
          Entrar
        </Link>
      </p>

      <form action={formAction}>
        <label className={labelClass} htmlFor="name">
          Nome completo *
        </label>
        <input
          id="name"
          name="name"
          className={`${inputClass} ${inputHeightClass} mb-3.5`}
          placeholder="Como devemos te chamar?"
        />

        <label className={labelClass} htmlFor="email">
          E-mail *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoCapitalize="none"
          className={`${inputClass} ${inputHeightClass} mb-3.5`}
          placeholder="seuemail@exemplo.com"
        />

        <label className={labelClass} htmlFor="password">
          Senha *
        </label>
        <PasswordInput
          id="password"
          name="password"
          className="mb-3.5"
          placeholder="Mínimo 4 caracteres"
        />

        <label className={labelClass} htmlFor="confirmPassword">
          Confirmar senha *
        </label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          className="mb-3.5"
          placeholder="Repita a senha"
        />

        <h2 className="mb-3.5 mt-2 text-base font-bold text-reuse-text">
          Endereço
        </h2>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className={labelClass} htmlFor="cep">
              CEP
            </label>
            <input
              id="cep"
              name="cep"
              inputMode="numeric"
              maxLength={9}
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              className={`${inputClass} ${inputHeightClass} mb-3.5`}
              placeholder="00000-000"
            />
          </div>
          {buscandoCep && (
            <span className="mt-3.5 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-reuse-green border-t-transparent" />
          )}
        </div>
        {cepError && (
          <p className="-mt-2 mb-3.5 text-xs text-reuse-danger">{cepError}</p>
        )}

        <label className={labelClass} htmlFor="cidade">
          Cidade
        </label>
        <input
          id="cidade"
          name="cidade"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          className={`${inputClass} ${inputHeightClass} mb-3.5`}
          placeholder="Sua cidade"
        />

        <label className={labelClass} htmlFor="estado">
          Estado
        </label>
        <input
          id="estado"
          name="estado"
          maxLength={2}
          value={estado}
          onChange={(e) => setEstado(e.target.value.toUpperCase())}
          className={`${inputClass} ${inputHeightClass} mb-3.5`}
          placeholder="UF"
        />

        {state?.error && (
          <p className="mb-3 rounded-lg border border-reuse-danger/30 bg-red-50 px-3 py-2 text-sm text-reuse-danger">
            {state.error}
          </p>
        )}

        <div className="mt-5">
          <Button type="submit" disabled={pending}>
            {pending ? "Criando conta..." : "Criar conta"}
          </Button>
        </div>
      </form>
    </div>
  );
}
