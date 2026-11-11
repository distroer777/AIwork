import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = { title: "Вход · Ярчинвест" };

export default function LoginPage() {
  return <LoginForm />;
}
