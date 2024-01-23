/*
  Warnings:

  - You are about to drop the `_ChallengeSolvers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ChallengeSolvers" DROP CONSTRAINT "_ChallengeSolvers_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChallengeSolvers" DROP CONSTRAINT "_ChallengeSolvers_B_fkey";

-- DropTable
DROP TABLE "_ChallengeSolvers";

-- CreateTable
CREATE TABLE "Solves" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Solves_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Solves_id_key" ON "Solves"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Solves_challengeId_userId_key" ON "Solves"("challengeId", "userId");

-- AddForeignKey
ALTER TABLE "Solves" ADD CONSTRAINT "Solves_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solves" ADD CONSTRAINT "Solves_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
