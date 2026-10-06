import { autenticarAssistente } from "@/lib/assistenteAuth";
import { CATEGORIAS } from "@/lib/categorias";
import { prisma } from "@/lib/prisma";
import { Categoria } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = await autenticarAssistente(req);
  if ("erro" in auth) return auth.erro;

  const q = req.nextUrl.searchParams.get("q")?.trim();
  const cat = req.nextUrl.searchParams.get("categoria");
  const categoriaValida = CATEGORIAS.some((c) => c.value === cat)
    ? (cat as Categoria)
    : undefined;

  const itens = await prisma.item.findMany({
    where: {
      status: "DISPONIVEL",
      userId: { not: auth.user.id },
      ...(categoriaValida ? { categoria: categoriaValida } : {}),
      ...(q
        ? {
            OR: [
              { titulo: { contains: q, mode: "insensitive" } },
              { descricao: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      titulo: true,
      categoria: true,
      troca: true,
      user: { select: { name: true, cidade: true } },
    },
  });

  return NextResponse.json({ total: itens.length, itens });
}
