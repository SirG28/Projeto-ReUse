"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

// Código de erro do Prisma para violação de constraint única/registro
// inexistente — usado abaixo para tratar o duplo-clique como no-op em vez de
// deixar vazar um 500 pro usuário.
const PRISMA_UNIQUE_VIOLATION = "P2002";
const PRISMA_NOT_FOUND = "P2025";

function isPrismaError(err: unknown, code: string) {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === code;
}

export async function toggleFavoriteAction(itemId: string) {
  const user = await requireSession();

  const existente = await prisma.favorite.findUnique({
    where: { userId_itemId: { userId: user.id, itemId } },
  });

  try {
    if (existente) {
      await prisma.favorite.delete({ where: { id: existente.id } });
    } else {
      await prisma.favorite.create({ data: { userId: user.id, itemId } });
    }
  } catch (err) {
    // Duplo clique rápido: duas chamadas leem `existente` antes de qualquer
    // uma escrever, e a segunda escrita colide com a primeira (create
    // duplicado ou delete de uma linha que a outra chamada já apagou). Nos
    // dois casos o resultado desejado (favoritado/desfavoritado) já foi
    // alcançado pela primeira chamada — trata como no-op.
    const jaResolvido =
      isPrismaError(err, PRISMA_UNIQUE_VIOLATION) || isPrismaError(err, PRISMA_NOT_FOUND);
    if (!jaResolvido) {
      throw err;
    }
  }

  revalidatePath(`/items/${itemId}`);
  revalidatePath("/home");
}
