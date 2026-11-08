"use client";

import { useActionState } from "react";
import { register, type RegisterState } from "./actions";

const initialState: RegisterState = { ok: false, message: "" };

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, initialState);

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 p-6">
      <h1 className="text-2xl font-semibold">Регистрация</h1>

      <form action={formAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="rounded border border-gray-400 px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm">Пароль</span>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="rounded border border-gray-400 px-3 py-2"
          />
        </label>

        <button
          type="submit"
          disabled={pending}
          className="rounded bg-[#6b7340] px-4 py-2 text-white disabled:opacity-60"
        >
          {pending ? "Отправляю..." : "Зарегистрироваться"}
        </button>
      </form>

      {state.message && (
        <p className={state.ok ? "text-green-700" : "text-red-700"}>{state.message}</p>
      )}
    </main>
  );
}
