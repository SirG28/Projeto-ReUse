import { autenticarAssistente } from "@/lib/assistenteAuth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await autenticarAssistente(req);
  if ("erro" in auth) return auth.erro;
  const { user } = auth;

  const { id } = await params;
  const { acao } = await req.json().catch(() => ({}));

  const s = await prisma.tradeRequest.findUnique({
    where: { id },
    include: { itemDesejado: true },
  });
  if (!s)
    return NextResponse.json(
      { error: "Solicitação não encontrada." },
      { status: 404 },
    );
  if (s.status !== "PENDENTE") {
    return NextResponse.json(
      { error: `Essa solicitação já está ${s.status}.` },
      { status: 409 },
    );
  }

  if (acao === "cancelar") {
    if (s.solicitanteId !== user.id) {
      return NextResponse.json(
        { error: "Só quem fez o pedido pode cancelar." },
        { status: 403 },
      );
    }
    await prisma.tradeRequest.updateMany({
      where: { id, status: "PENDENTE" },
      data: { status: "CANCELADA" },
    });
  } else if (acao === "recusar" || acao === "aceitar") {
    if (s.itemDesejado.userId !== user.id) {
      return NextResponse.json(
        { error: "Só o dono do item pode responder." },
        { status: 403 },
      );
    }
    if (acao === "recusar") {
      await prisma.tradeRequest.updateMany({
        where: { id, status: "PENDENTE" },
        data: { status: "RECUSADA" },
      });
    } else {
      const ids = [s.itemDesejadoId, s.itemOfertadoId];
      const ok = await prisma.$transaction(async (tx) => {
        const r = await tx.tradeRequest.updateMany({
          where: { id, status: "PENDENTE" },
          data: { status: "ACEITA" },
        });
        if (r.count === 0) return false;
        await tx.item.updateMany({
          where: { id: { in: ids }, status: { in: ["DISPONIVEL", "PAUSADO"] } },
          data: { status: "TROCADO" },
        });
        await tx.tradeRequest.updateMany({
          where: {
            id: { not: id },
            status: "PENDENTE",
            OR: [
              { itemDesejadoId: { in: ids } },
              { itemOfertadoId: { in: ids } },
            ],
          },
          data: { status: "RECUSADA" },
        });
        return true;
      });
      if (!ok)
        return NextResponse.json(
          { error: "Essa solicitação acabou de ser alterada." },
          { status: 409 },
        );
    }
  } else {
    return NextResponse.json(
      { error: "Ação inválida. Use aceitar, recusar ou cancelar." },
      { status: 400 },
    );
  }

  revalidatePath("/trocas");
  revalidatePath("/home");
  revalidatePath("/items");
  return NextResponse.json({ ok: true, acao });
}
