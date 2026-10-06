import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { prisma } from "./prisma";

export async function autenticarAssistente(req: NextRequest) {
  const token = (req.headers.get("authorization") ?? "").replace(
    /^Bearer\s+/i,
    "",
  );
  const chave = process.env.ASSISTENTE_API_KEY;

  if (!chave || token !== chave) {
    return {
      erro: NextResponse.json({ error: "Não autorizado." }, { status: 401 }),
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: process.env.ASSISTENTE_USER_EMAIL ?? "" },
  });
  if (!user) {
    return {
      erro: NextResponse.json(
        { error: "Usuário do assistente não encontrado." },
        { status: 500 },
      ),
    };
  }

  return { user };
}
