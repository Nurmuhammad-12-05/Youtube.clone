/*
  Warnings:

  - The values [UNILISTED] on the enum `VideoStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `updatedAt` to the `videos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VideoStatus_new" AS ENUM ('UPLOADING', 'PROCESSING', 'PUBLISHED', 'PRIVATE', 'UNLISTED', 'DELETED');
ALTER TABLE "videos" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "videos" ALTER COLUMN "status" TYPE "VideoStatus_new" USING ("status"::text::"VideoStatus_new");
ALTER TYPE "VideoStatus" RENAME TO "VideoStatus_old";
ALTER TYPE "VideoStatus_new" RENAME TO "VideoStatus";
DROP TYPE "VideoStatus_old";
ALTER TABLE "videos" ALTER COLUMN "status" SET DEFAULT 'PROCESSING';
COMMIT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "channelName" TEXT;

-- AlterTable
ALTER TABLE "videos" ADD COLUMN     "availableQualities" TEXT[],
ADD COLUMN     "hasAudio" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
