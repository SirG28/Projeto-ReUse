import { autenticarAssistente } from "@/lib/assistenteAuth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const auth = await autenticarAssistente(req);
  if ("erro" in auth) return auth.erro;

  const body = await req.json().catch(() => ({}));
  const ids: string[] | undefined =
    Array.isArray(body.itemIds) && body.itemIds.length
      ? body.itemIds
      : undefined;

  const r = await prisma.item.updateMany({
    where: {
      userId: auth.user.id,
      status: "DISPONIVEL",
      ...(ids ? { id: { in: ids } } : {}),
    },
    data: { status: "PAUSADO" },
  });

  revalidatePath("/home");
  revalidatePath("/items");
  revalidatePath("/profile");
  return NextResponse.json({ pausados: r.count });
}
