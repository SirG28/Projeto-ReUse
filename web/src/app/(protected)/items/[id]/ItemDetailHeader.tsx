"use client";

import { useRouter } from "next/navigation";
import ScreenHeader from "@/components/ScreenHeader";

// Usa router.back() (pop no histórico) em vez de um Link fixo (que empurra
// uma nova entrada). Assim, encadeamentos como Perfil > Meus Itens > Detalhe
// voltam corretamente passo a passo, em vez de criar um ciclo no histórico.
export default function ItemDetailHeader({
  title,
  fallbackHref,
}: {
  title: string;
  fallbackHref: string;
}) {
  const router = useRouter();

  return (
    <ScreenHeader
      title={title}
      backHref={fallbackHref}
      onBack={() => router.back()}
    />
  );
}
