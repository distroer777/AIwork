import OpenAI from "openai";
import { ProxyAgent } from "undici";

let client: OpenAI | null = null;

/** Клиент OpenAI. Запросы идут через прокси: HTTP-прокси (OPENAI_PROXY_URL) и/или другой адрес API (OPENAI_BASE_URL). */
export function getOpenAI(): OpenAI {
  if (client) return client;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY не задан");

  const proxyUrl = process.env.OPENAI_PROXY_URL;
  client = new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL || undefined,
    timeout: 60_000,
    fetchOptions: proxyUrl ? { dispatcher: new ProxyAgent(proxyUrl) } : undefined,
  });
  return client;
}

export function getModel(): string {
  return process.env.OPENAI_MODEL || "gpt-4o-mini";
}
