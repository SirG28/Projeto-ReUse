"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createSession,
  destroySession,
  hashPassword,
  requireSession,
  verifyPassword,
} from "@/lib/auth";

const REMEMBER_COOKIE = "reuse_remember_email";

export type AuthActionState = { error?: string } | undefined;

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const remember = formData.get("remember") === "on";

  if (!email || !password) {
    return { error: "Preencha e-mail e senha." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "Usuário não encontrado." };
  }

  const validPassword = await verifyPassword(password, user.passwordHash);
  if (!validPassword) {
    return { error: "Senha incorreta." };
  }

  const cookieStore = await cookies();
  if (remember) {
    cookieStore.set(REMEMBER_COOKIE, email, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    });
  } else {
    cookieStore.delete(REMEMBER_COOKIE);
  }

  await createSession(user.id);
  redirect("/home");
}

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");
  const cep = String(formData.get("cep") || "").trim() || null;
  const cidade = String(formData.get("cidade") || "").trim() || null;
  const estado = String(formData.get("estado") || "").trim() || null;

  if (!name || !email || !password || !confirmPassword) {
    return { error: "Preencha todos os campos obrigatórios." };
  }
  if (password !== confirmPassword) {
    return { error: "As senhas não conferem." };
  }
  if (password.length < 4) {
    return { error: "A senha precisa ter pelo menos 4 caracteres." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "E-mail já cadastrado." };
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, cep, cidade, estado },
  });

  await createSession(user.id);
  redirect("/home");
}

export type UpdateProfileState = { error?: string; success?: boolean } | undefined;

export async function updateProfileAction(
  _prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const user = await requireSession();

  const name = String(formData.get("name") || "").trim();
  const cep = String(formData.get("cep") || "").trim() || null;
  const cidade = String(formData.get("cidade") || "").trim() || null;
  const estado = String(formData.get("estado") || "").trim() || null;

  if (!name) {
    return { error: "Preencha seu nome." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name, cep, cidade, estado },
  });

  return { success: true };
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
