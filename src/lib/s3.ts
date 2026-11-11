import {
  CreateBucketCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let client: S3Client | null = null;
let bucketReady = false;

function bucketName(): string {
  const bucket = process.env.S3_BUCKET;
  if (!bucket) throw new Error("S3_BUCKET не задан");
  return bucket;
}

function getClient(): S3Client {
  if (client) return client;
  const accessKeyId = process.env.S3_ACCESS_KEY;
  const secretAccessKey = process.env.S3_SECRET_KEY;
  if (!process.env.S3_ENDPOINT || !accessKeyId || !secretAccessKey) {
    throw new Error("Настройки S3 не заданы в .env");
  }
  client = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION || "us-east-1",
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== "false",
    credentials: { accessKeyId, secretAccessKey },
    // Совместимость с S3-хранилищами, которые не понимают новые контрольные суммы
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
  return client;
}

// В разработке бакет создаётся сам. В проде его создают заранее.
async function ensureBucket(): Promise<void> {
  if (bucketReady || process.env.S3_AUTO_CREATE_BUCKET !== "true") return;
  const s3 = getClient();
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucketName() }));
  } catch {
    await s3.send(new CreateBucketCommand({ Bucket: bucketName() }));
  }
  bucketReady = true;
}

export async function putObject(key: string, body: Buffer, contentType: string): Promise<void> {
  await ensureBucket();
  await getClient().send(
    new PutObjectCommand({ Bucket: bucketName(), Key: key, Body: body, ContentType: contentType }),
  );
}

export async function deleteObjects(keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  await getClient().send(
    new DeleteObjectsCommand({
      Bucket: bucketName(),
      Delete: { Objects: keys.map((Key) => ({ Key })), Quiet: true },
    }),
  );
}

/** Временная ссылка на файл (по умолчанию на 60 секунд). */
export async function signedGetUrl(key: string, seconds = 60): Promise<string> {
  return getSignedUrl(getClient(), new GetObjectCommand({ Bucket: bucketName(), Key: key }), {
    expiresIn: seconds,
  });
}
