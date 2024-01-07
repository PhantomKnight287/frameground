/*
  Warnings:

  - You are about to drop the column `smallDescription` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `test` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `difficulty` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `info` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tests` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Track` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('beginner', 'easy', 'medium', 'hard', 'extreme');

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Challenge" DROP COLUMN "smallDescription",
DROP COLUMN "test",
DROP COLUMN "title",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "difficulty" "Difficulty" NOT NULL,
ADD COLUMN     "info" TEXT NOT NULL,
ADD COLUMN     "initialFiles" JSONB[],
ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "playgroundNeeded" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "prerequisites" TEXT[],
ADD COLUMN     "tests" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "roles" "Role"[];

-- CreateTable
CREATE TABLE "_ChallengeToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChallengeToUser_AB_unique" ON "_ChallengeToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ChallengeToUser_B_index" ON "_ChallengeToUser"("B");

-- AddForeignKey
ALTER TABLE "_ChallengeToUser" ADD CONSTRAINT "_ChallengeToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChallengeToUser" ADD CONSTRAINT "_ChallengeToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
