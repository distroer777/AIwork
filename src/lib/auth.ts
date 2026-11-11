import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { prisma } from "@/lib/prisma";
import { sendVerificationCode } from "@/lib/mail";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  // Свои имена моделей, чтобы не пересекаться со старой таблицей User
  user: { modelName: "authUser" },
  session: { modelName: "authSession" },
  account: { modelName: "authAccount" },
  verification: { modelName: "authVerification" },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
  },
  emailVerification: { autoSignInAfterVerification: true },
  plugins: [
    emailOTP({
      overrideDefaultEmailVerification: true,
      sendVerificationOnSignUp: true,
      otpLength: 6,
      expiresIn: 300,
      async sendVerificationOTP({ email, otp }) {
        // Без await, чтобы по времени ответа нельзя было отличить существующий email
        void sendVerificationCode(email, otp).catch(() => {
          console.error("Не удалось отправить код подтверждения");
        });
      },
    }),
    nextCookies(), // всегда последним
  ],
});
