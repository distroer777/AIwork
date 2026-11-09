import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

const base =
  "inline-flex items-center justify-center rounded-pill px-7 py-4 text-base font-semibold transition duration-300 hover:-translate-y-0.5";

const variants = {
  primary: "bg-accent text-on-accent shadow-glow hover:bg-accent-hover",
  secondary: "bg-surface/75 text-ink shadow-card hover:text-accent",
};

export function ButtonLink({ href, children, variant = "primary", className = "" }: ButtonLinkProps) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
