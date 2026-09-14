import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type Params = { id: string };

// GET  -> lista os comentários de topo do item (mais antigos primeiro), cada
//         um já com suas respostas
// POST -> cria um comentário (ou, com `parentId`, uma resposta a um
//         comentário existente), em nome do usuário da sessão
// Ambos exigem sessão ativa: comentários são uma área só para usuários logados.

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;

  const comentarios = await prisma.comment.findMany({
    where: { itemId: id, parentId: null },
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { name: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: { name: true } } },
      },
    },
  });

  return NextResponse.json(comentarios);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;

  const body = await request.json().catch(() => null);
  const conteudo = String(body?.conteudo ?? "").trim();
  const parentId = body?.parentId ? String(body.parentId) : null;

  if (!conteudo) {
    return NextResponse.json(
      { error: "Escreva um comentário antes de enviar." },
      { status: 400 }
    );
  }

  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) {
    return NextResponse.json(
      { error: "Item não encontrado." },
      { status: 404 }
    );
  }

  if (parentId) {
    const comentarioPai = await prisma.comment.findUnique({
      where: { id: parentId },
    });
    if (!comentarioPai || comentarioPai.itemId !== id) {
      return NextResponse.json(
        { error: "Comentário original não encontrado." },
        { status: 404 }
      );
    }
    // Só um nível de profundidade: responder a uma resposta (em vez de a um
    // comentário de topo) deixaria o registro fora de qualquer GET, já que
    // este só busca comentários de topo com um nível de `replies`.
    if (comentarioPai.parentId !== null) {
      return NextResponse.json(
        { error: "Não é possível responder a uma resposta." },
        { status: 400 }
      );
    }
  }

  const comentario = await prisma.comment.create({
    data: {
      conteudo,
      itemId: id,
      userId: session.user.id,
      parentId,
    },
    include: { user: { select: { name: true } } },
  });

  return NextResponse.json(comentario, { status: 201 });
}
