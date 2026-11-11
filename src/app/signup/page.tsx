import type { Metadata } from "next";
import { SignupFlow } from "@/components/signup-flow";

export const metadata: Metadata = { title: "Регистрация · Ярчинвест" };

export default function SignupPage() {
  return <SignupFlow />;
}
