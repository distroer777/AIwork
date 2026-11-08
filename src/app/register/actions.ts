"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export type RegisterState = { ok: boolean; message: string };

export async function register(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Введите корректный email" };
  }
  if (password.length < 8) {
    return { ok: false, message: "Пароль должен быть не короче 8 символов" };
  }

  try {
    await prisma.user.create({
      data: { email, passwordHash: hashPassword(password) },
    });
    return { ok: true, message: "Вы зарегистрированы" };
  } catch (e) {
    if (typeof e === "object" && e !== null && "code" in e && e.code === "P2002") {
      return { ok: false, message: "Такой email уже зарегистрирован" };
    }
    console.error(e);
    return { ok: false, message: "Не удалось сохранить, попробуйте позже" };
  }
}
