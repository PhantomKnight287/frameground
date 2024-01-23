-- CreateEnum
CREATE TYPE "Solvetype" AS ENUM ('accepted', 'failed');

-- DropIndex
DROP INDEX "Solves_challengeId_userId_key";

-- AlterTable
ALTER TABLE "Solves" ADD COLUMN     "output" TEXT,
ADD COLUMN     "type" "Solvetype" NOT NULL DEFAULT 'accepted';
