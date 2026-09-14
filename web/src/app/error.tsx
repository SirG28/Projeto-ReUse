"use client";

import { useEffect } from "react";
import Logo from "@/components/Logo";
import Button from "@/components/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-reuse-bg px-6 text-center animate-page-in">
      <Logo size={40} />
      <p className="text-lg font-bold text-reuse-text">Algo deu errado</p>
      <p className="max-w-xs text-sm text-reuse-text-secondary">
        Não foi possível carregar esta página. Tente novamente em instantes.
      </p>
      <Button onClick={reset} className="w-full max-w-xs">
        Tentar novamente
      </Button>
    </div>
  );
}
