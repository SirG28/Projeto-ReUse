"use client";

import { useState, useTransition } from "react";
import { toggleFavoriteAction } from "@/app/actions/interactions";
import { IconHeart } from "@/components/icons";

export default function FavoriteButton({
  itemId,
  favoritadoInicialmente,
}: {
  itemId: string;
  favoritadoInicialmente: boolean;
}) {
  const [favoritado, setFavoritado] = useState(favoritadoInicialmente);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setFavoritado((atual) => !atual);
    startTransition(async () => {
      await toggleFavoriteAction(itemId);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={favoritado ? "Remover dos favoritos" : "Salvar item"}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-reuse-border bg-white disabled:opacity-60 ${
        favoritado ? "text-reuse-danger" : "text-reuse-text-secondary"
      }`}
    >
      <IconHeart size={17} filled={favoritado} />
    </button>
  );
}
