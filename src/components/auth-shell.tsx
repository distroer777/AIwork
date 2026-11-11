import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <main className="scene-hero flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 block text-center font-heading text-xl font-bold text-accent">
          Ярчинвест
        </Link>
        <div className="rounded-card bg-surface p-6 text-ink shadow-card sm:p-8">
          <h1 className="font-heading text-2xl font-bold">{title}</h1>
          {subtitle ? <p className="mt-2 text-ink-muted">{subtitle}</p> : null}
          <div className="mt-6">{children}</div>
        </div>
        {footer ? <p className="mt-5 text-center text-ink-muted">{footer}</p> : null}
      </div>
    </main>
  );
}
