"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export type CreateItemState = { error?: string } | undefined;

export async function createItemAction(
  _prevState: CreateItemState,
  formData: FormData
): Promise<CreateItemState> {
  const user = await requireSession();

  const titulo = String(formData.get("titulo") || "").trim();
  const descricao = String(formData.get("descricao") || "").trim();
  const troca = String(formData.get("troca") || "").trim();
  const whatsapp = String(formData.get("whatsapp") || "").trim();
  const imagem = String(formData.get("imagem") || "").trim() || null;

  if (!titulo || !descricao || !troca || !whatsapp) {
    return {
      error: "Preencha pelo menos título, descrição, troca e WhatsApp.",
    };
  }

  await prisma.item.create({
    data: {
      titulo,
      descricao,
      troca,
      whatsapp,
      imagem,
      userId: user.id,
    },
  });

  redirect("/home?toast=published");
}

export type UpdateItemState = { error?: string; success?: boolean } | undefined;

export async function updateItemAction(
  _prevState: UpdateItemState,
  formData: FormData
): Promise<UpdateItemState> {
  const user = await requireSession();

  const id = String(formData.get("id") || "");
  const titulo = String(formData.get("titulo") || "").trim();
  const descricao = String(formData.get("descricao") || "").trim();
  const troca = String(formData.get("troca") || "").trim();

  if (!titulo || !descricao || !troca) {
    return { error: "Preencha todos os campos." };
  }

  const item = await prisma.item.findUnique({ where: { id } });
  if (!item || item.userId !== user.id) {
    return { error: "Item não encontrado." };
  }

  await prisma.item.update({
    where: { id },
    data: { titulo, descricao, troca },
  });

  revalidatePath("/items/mine");
  return { success: true };
}

export async function deleteItemAction(formData: FormData) {
  const user = await requireSession();
  const id = String(formData.get("id") || "");

  const item = await prisma.item.findUnique({ where: { id } });
  if (!item || item.userId !== user.id) {
    return;
  }

  await prisma.item.delete({ where: { id } });
  revalidatePath("/items/mine");
}
