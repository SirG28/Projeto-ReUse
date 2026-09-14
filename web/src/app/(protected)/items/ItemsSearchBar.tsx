"use client";

import { useEffect, useRef, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { IconSearch } from "@/components/icons";
import { inputClass, inputHeightClass } from "@/lib/formStyles";

const DEBOUNCE_MS = 350;

export default function ItemsSearchBar({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [valor, setValor] = useState(defaultValue);
  const isFirstRender = useRef(true);

  function irPara(termo: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (termo) {
      params.set("q", termo);
    } else {
      params.delete("q");
    }
    router.push(`/items${params.toString() ? `?${params.toString()}` : ""}`);
  }

  // Busca ao vivo: campo vazio já volta pra lista completa na hora (sem
  // esperar debounce nem Enter); com texto, espera um pouco pra não navegar
  // a cada tecla digitada.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const termo = valor.trim();
    if (!termo) {
      irPara("");
      return;
    }

    const timer = setTimeout(() => irPara(termo), DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor]);

  function buscarAgora(e: FormEvent) {
    e.preventDefault();
    irPara(valor.trim());
  }

  return (
    <form onSubmit={buscarAgora} className="px-4 pt-4">
      <div className="relative">
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-reuse-neutral-500">
          <IconSearch size={16} />
        </span>
        <input
          type="search"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="Buscar por título ou descrição..."
          className={`${inputClass} ${inputHeightClass} pl-9`}
        />
      </div>
    </form>
  );
}
