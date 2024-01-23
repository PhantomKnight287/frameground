/*
  Warnings:

  - You are about to drop the `_ChallengeAuthors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ChallengeUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ChallengeAuthors" DROP CONSTRAINT "_ChallengeAuthors_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChallengeAuthors" DROP CONSTRAINT "_ChallengeAuthors_B_fkey";

-- DropForeignKey
ALTER TABLE "_ChallengeUsers" DROP CONSTRAINT "_ChallengeUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChallengeUsers" DROP CONSTRAINT "_ChallengeUsers_B_fkey";

-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "authors" TEXT[];

-- DropTable
DROP TABLE "_ChallengeAuthors";

-- DropTable
DROP TABLE "_ChallengeUsers";

-- CreateTable
CREATE TABLE "_ChallengeSolvers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChallengeSolvers_AB_unique" ON "_ChallengeSolvers"("A", "B");

-- CreateIndex
CREATE INDEX "_ChallengeSolvers_B_index" ON "_ChallengeSolvers"("B");

-- AddForeignKey
ALTER TABLE "_ChallengeSolvers" ADD CONSTRAINT "_ChallengeSolvers_A_fkey" FOREIGN KEY ("A") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChallengeSolvers" ADD CONSTRAINT "_ChallengeSolvers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
