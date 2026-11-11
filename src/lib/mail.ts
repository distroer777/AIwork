// Отправка писем через RuSender. Без ключа (локальная разработка) код печатается в терминал.
const DEFAULT_URL = "https://api.beta.rusender.ru/api/v1/external-mails/send";

export async function sendVerificationCode(email: string, otp: string): Promise<void> {
  const apiKey = process.env.RUSENDER_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEV] Код подтверждения: ${otp}`);
    } else {
      console.error("RUSENDER_API_KEY не задан, письмо не отправлено");
    }
    return;
  }

  const response = await fetch(process.env.RUSENDER_API_URL || DEFAULT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Api-Key": apiKey },
    body: JSON.stringify({
      mail: {
        to: { email },
        from: {
          email: process.env.RUSENDER_FROM_EMAIL,
          name: process.env.RUSENDER_FROM_NAME || "Ярчинвест",
        },
        subject: "Код подтверждения Ярчинвест",
        text: `Ваш код подтверждения: ${otp}. Он действует 5 минут.`,
        html: `<p>Ваш код подтверждения:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${otp}</p><p>Код действует 5 минут. Если вы не регистрировались, просто проигнорируйте письмо.</p>`,
      },
    }),
  });

  if (!response.ok) {
    console.error(`RuSender: письмо не отправлено, статус ${response.status}`);
  }
}
