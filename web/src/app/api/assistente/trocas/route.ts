import { autenticarAssistente } from "@/lib/assistenteAuth";
import { prisma } from "@/lib/prisma";
import { TradeRequestStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const STATUS: TradeRequestStatus[] = [
  "PENDENTE",
  "ACEITA",
  "RECUSADA",
  "CANCELADA",
];

export async function GET(req: NextRequest) {
  const auth = await autenticarAssistente(req);
  if ("erro" in auth) return auth.erro;

  const tipo =
    req.nextUrl.searchParams.get("tipo") === "enviadas"
      ? "enviadas"
      : "recebidas";
  const s = req.nextUrl.searchParams.get("status") as TradeRequestStatus | null;
  const status = s && STATUS.includes(s) ? s : undefined;

  const filtroTipo =
    tipo === "recebidas"
      ? { itemDesejado: { userId: auth.user.id } }
      : { solicitanteId: auth.user.id };

  const trocas = await prisma.tradeRequest.findMany({
    where: { ...filtroTipo, ...(status ? { status } : {}) },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      status: true,
      mensagem: true,
      createdAt: true,
      itemDesejado: { select: { titulo: true } },
      itemOfertado: { select: { titulo: true } },
      solicitante: { select: { name: true } },
    },
  });

  return NextResponse.json({ tipo, total: trocas.length, trocas });
}
