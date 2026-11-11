"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { AuthShell } from "./auth-shell";
import { OtpInput } from "./otp-input";

const RESEND_SECONDS = 60;

const inputClass =
  "w-full rounded-control border border-line bg-surface px-4 py-3 outline-none focus:border-accent";
const primaryClass =
  "w-full rounded-pill bg-accent px-7 py-4 text-base font-semibold text-on-accent shadow-glow transition hover:bg-accent-hover disabled:opacity-60";
const linkButtonClass = "font-semibold text-accent hover:underline disabled:text-ink-muted disabled:no-underline";

function signupError(code?: string): string {
  if (code === "USER_ALREADY_EXISTS" || code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
    return "Такой email уже зарегистрирован";
  }
  if (code === "PASSWORD_TOO_SHORT") return "Пароль должен быть не короче 8 символов";
  if (code === "INVALID_EMAIL") return "Введите корректный email";
  return "Не удалось зарегистрироваться, попробуйте позже";
}

export function SignupFlow() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "code">("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const { error: signUpError } = await authClient.signUp.email({
      email: email.trim().toLowerCase(),
      password,
      name: email.split("@")[0],
    });
    setPending(false);
    if (signUpError) {
      setError(signupError(signUpError.code));
      return;
    }
    setCode("");
    setSeconds(RESEND_SECONDS);
    setStep("code");
  }

  async function verify(value: string) {
    setError(null);
    setPending(true);
    const { error: verifyError } = await authClient.emailOtp.verifyEmail({
      email: email.trim().toLowerCase(),
      otp: value,
    });
    if (verifyError) {
      setPending(false);
      setCode("");
      setError("Неверный или просроченный код");
      return;
    }
    // Если автоматический вход не сработал, входим по введённым данным
    const session = await authClient.getSession();
    if (!session.data) {
      await authClient.signIn.email({ email: email.trim().toLowerCase(), password });
    }
    router.replace("/home");
  }

  async function resend() {
    setError(null);
    const { error: sendError } = await authClient.emailOtp.sendVerificationOtp({
      email: email.trim().toLowerCase(),
      type: "email-verification",
    });
    if (sendError) {
      setError("Не удалось отправить код, попробуйте позже");
      return;
    }
    setSeconds(RESEND_SECONDS);
  }

  function changeEmail() {
    setStep("form");
    setCode("");
    setError(null);
  }

  const footer = (
    <>
      Уже есть аккаунт?{" "}
      <Link href="/login" className="font-semibold text-accent hover:underline">
        Войти
      </Link>
    </>
  );

  if (step === "code") {
    return (
      <AuthShell
        title="Введите код"
        subtitle={`Мы отправили 6-значный код на ${email}`}
        footer={footer}
      >
        <div className="flex flex-col gap-5">
          <OtpInput value={code} onChange={setCode} onComplete={verify} disabled={pending} />
          {error ? <p className="text-danger" role="alert">{error}</p> : null}
          <p className="text-sm text-ink-muted" aria-live="polite">
            {seconds > 0 ? `Повторная отправка доступна через ${seconds} сек` : "Можно отправить код ещё раз"}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <button type="button" onClick={resend} disabled={seconds > 0 || pending} className={linkButtonClass}>
              Отправить код повторно
            </button>
            <button type="button" onClick={changeEmail} disabled={pending} className={linkButtonClass}>
              Изменить email
            </button>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Регистрация" subtitle="Создайте аккаунт, чтобы начать обучение" footer={footer}>
      <form onSubmit={submitForm} className="flex flex-col gap-4">
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
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
          />
          <span className="text-sm text-ink-muted">Не короче 8 символов</span>
        </label>
        {error ? <p className="text-danger" role="alert">{error}</p> : null}
        <button type="submit" disabled={pending} className={primaryClass}>
          {pending ? "Отправляем код…" : "Зарегистрироваться"}
        </button>
      </form>
    </AuthShell>
  );
}
