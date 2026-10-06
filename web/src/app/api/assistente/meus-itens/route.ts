import { autenticarAssistente } from "@/lib/assistenteAuth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = await autenticarAssistente(req);
  if ("erro" in auth) return auth.erro;

  const itens = await prisma.item.findMany({
    where: { userId: auth.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      titulo: true,
      categoria: true,
      status: true,
      troca: true,
    },
  });

  return NextResponse.json({ total: itens.length, itens });
}
