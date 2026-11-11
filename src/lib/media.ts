import { randomUUID } from "node:crypto";

export const MAX_FILES_PER_DRAFT = 10;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

export type MediaKind = "image" | "video";

type Detected = { contentType: string; ext: string; kind: MediaKind };

function startsWith(buf: Buffer, bytes: number[], offset = 0): boolean {
  return bytes.every((byte, index) => buf[offset + index] === byte);
}

/** Определяем тип по первым байтам файла, а не по тому, что прислал браузер. */
export function detectMedia(buf: Buffer): Detected | null {
  if (startsWith(buf, [0xff, 0xd8, 0xff])) return { contentType: "image/jpeg", ext: "jpg", kind: "image" };
  if (startsWith(buf, [0x89, 0x50, 0x4e, 0x47])) return { contentType: "image/png", ext: "png", kind: "image" };
  if (startsWith(buf, [0x47, 0x49, 0x46, 0x38])) return { contentType: "image/gif", ext: "gif", kind: "image" };
  if (startsWith(buf, [0x52, 0x49, 0x46, 0x46]) && startsWith(buf, [0x57, 0x45, 0x42, 0x50], 8)) {
    return { contentType: "image/webp", ext: "webp", kind: "image" };
  }
  if (startsWith(buf, [0x66, 0x74, 0x79, 0x70], 4)) return { contentType: "video/mp4", ext: "mp4", kind: "video" };
  if (startsWith(buf, [0x1a, 0x45, 0xdf, 0xa3])) return { contentType: "video/webm", ext: "webm", kind: "video" };
  return null;
}

export type PreparedFile = {
  key: string;
  buffer: Buffer;
  contentType: string;
  size: number;
  kind: MediaKind;
};

/** Проверяет файлы и готовит их к загрузке. Имя файла от пользователя в ключ не попадает. */
export async function prepareFiles(
  files: File[],
  userId: string,
  draftId: string,
): Promise<{ ok: true; files: PreparedFile[] } | { ok: false; error: string }> {
  const prepared: PreparedFile[] = [];
  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const detected = detectMedia(buffer);
    if (!detected) return { ok: false, error: "Можно загружать только фото (JPG, PNG, GIF, WebP) и видео (MP4, WebM)" };
    const limit = detected.kind === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
    if (buffer.length > limit) {
      return {
        ok: false,
        error: `Файл слишком большой: ${detected.kind === "image" ? "фото до 10 МБ" : "видео до 50 МБ"}`,
      };
    }
    prepared.push({
      key: `drafts/${userId}/${draftId}/${randomUUID()}.${detected.ext}`,
      buffer,
      contentType: detected.contentType,
      size: buffer.length,
      kind: detected.kind,
    });
  }
  return { ok: true, files: prepared };
}
