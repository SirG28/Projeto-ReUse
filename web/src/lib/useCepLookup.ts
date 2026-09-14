"use client";

import { useEffect, useState } from "react";

type CepResult = {
  localidade: string;
  uf: string;
  erro?: boolean;
};

// Autopreenche cidade/estado a partir de um CEP via ViaCEP. `initial` define
// os valores de partida (ex.: dados já salvos do usuário) — só é lido no
// primeiro render, exatamente como o inicializador de um useState.
export function useCepLookup(
  cep: string,
  initial?: { cidade?: string | null; estado?: string | null }
) {
  const [cidade, setCidade] = useState(initial?.cidade ?? "");
  const [estado, setEstado] = useState(initial?.estado ?? "");
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    let cancelado = false;

    async function buscar() {
      setBuscando(true);
      setErro(null);

      try {
        const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data: CepResult = await res.json();
        if (cancelado) return;

        if (data.erro) {
          setErro("CEP não encontrado.");
          return;
        }
        setCidade(data.localidade);
        setEstado(data.uf);
      } catch {
        if (!cancelado) setErro("Não foi possível buscar o CEP.");
      } finally {
        if (!cancelado) setBuscando(false);
      }
    }

    buscar();

    return () => {
      cancelado = true;
    };
  }, [cep]);

  return { cidade, setCidade, estado, setEstado, buscando, erro };
}
