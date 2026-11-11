-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO');

-- AlterTable
ALTER TABLE "auth_user" ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'FREE',
ADD COLUMN     "planUntil" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "draft" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "draft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "draft_media" (
    "id" TEXT NOT NULL,
    "draftId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "draft_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rewrite_usage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rewrite_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "draft_userId_createdAt_idx" ON "draft"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "draft_media_key_key" ON "draft_media"("key");

-- CreateIndex
CREATE INDEX "draft_media_draftId_idx" ON "draft_media"("draftId");

-- CreateIndex
CREATE INDEX "rewrite_usage_userId_createdAt_idx" ON "rewrite_usage"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "consent_userId_idx" ON "consent"("userId");

-- AddForeignKey
ALTER TABLE "draft" ADD CONSTRAINT "draft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "draft_media" ADD CONSTRAINT "draft_media_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "draft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rewrite_usage" ADD CONSTRAINT "rewrite_usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent" ADD CONSTRAINT "consent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
