"use client";

import { useState, type InputHTMLAttributes } from "react";
import { inputClass, inputHeightClass } from "@/lib/formStyles";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

// O espaçamento externo (className, ex.: "mb-3.5") vai no wrapper, nunca no
// <input>: como o wrapper é `flex items-center`, uma margem no <input> (item
// do flex) inflava a altura do próprio wrapper — e então `top-1/2` no botão
// centralizava contra essa altura errada, empurrando o "Mostrar" pra baixo.
export default function PasswordInput({ className = "", ...rest }: Props) {
  const [mostrar, setMostrar] = useState(false);

  return (
    <div className={`relative flex items-center ${className}`}>
      <input
        {...rest}
        type={mostrar ? "text" : "password"}
        className={`${inputClass} ${inputHeightClass} pr-16 w-full`}
      />
      <button
        type="button"
        onClick={() => setMostrar((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 px-1 py-1 text-xs font-semibold text-reuse-green"
      >
        {mostrar ? "Ocultar" : "Mostrar"}
      </button>
    </div>
  );
}
