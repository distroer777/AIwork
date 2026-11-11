import { getModel, getOpenAI } from "@/lib/openai";
import {
  buildSystemPrompt,
  countChars,
  getLimit,
  toPlainText,
  type RewriteFormat,
} from "@/lib/rewrite-prompts";

const MAX_ATTEMPTS = 3;

type RewriteInput = {
  text: string;
  format: RewriteFormat;
  hasMedia: boolean;
  instructions: string;
};

type Message = { role: "system" | "user" | "assistant"; content: string };

export async function rewritePost({ text, format, hasMedia, instructions }: RewriteInput): Promise<string> {
  const limit = getLimit(format, hasMedia);
  const messages: Message[] = [
    { role: "system", content: buildSystemPrompt(format, hasMedia, instructions) },
    { role: "user", content: `<post>\n${toPlainText(text)}\n</post>` },
  ];

  const openai = getOpenAI();

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const completion = await openai.chat.completions.create({
      model: getModel(),
      messages,
      temperature: 0.7,
    });
    const answer = toPlainText(completion.choices[0]?.message?.content ?? "");
    if (!answer) throw new Error("Пустой ответ нейросети");

    // Проверка длины: если больше лимита, просим переделать
    if (limit === null || countChars(answer) <= limit) return answer;

    messages.push(
      { role: "assistant", content: answer },
      {
        role: "user",
        content: `Получилось ${countChars(answer)} символов, а лимит ${limit}. Перепиши короче, чтобы было не больше ${Math.floor(limit * 0.9)} символов. Верни только текст.`,
      },
    );
  }

  throw new Error("Не удалось уложиться в лимит символов");
}
