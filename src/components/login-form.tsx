"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { AuthShell } from "./auth-shell";

const inputClass =
  "w-full rounded-control border border-line bg-surface px-4 py-3 outline-none focus:border-accent";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const { error: signInError } = await authClient.signIn.email({
      email: email.trim().toLowerCase(),
      password,
    });
    if (signInError) {
      setPending(false);
      setError(
        signInError.code === "EMAIL_NOT_VERIFIED"
          ? "Email не подтверждён. Мы отправили код на почту, введите его на странице регистрации"
          : "Неверный email или пароль",
      );
      return;
    }
    router.replace("/home");
  }

  return (
    <AuthShell
      title="Вход"
      subtitle="Войдите в личный кабинет"
      footer={
        <>
          Нет аккаунта?{" "}
          <Link href="/signup" className="font-semibold text-accent hover:underline">
            Зарегистрироваться
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="font-semibold">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-semibold">Пароль</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
          />
        </label>
        {error ? <p className="text-danger" role="alert">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-pill bg-accent px-7 py-4 text-base font-semibold text-on-accent shadow-glow transition hover:bg-accent-hover disabled:opacity-60"
        >
          {pending ? "Входим…" : "Войти"}
        </button>
      </form>
    </AuthShell>
  );
}
