import { randomBytes, scryptSync } from "node:crypto";

// Пароль хранится только в виде хеша: соль и хеш через двоеточие
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}
