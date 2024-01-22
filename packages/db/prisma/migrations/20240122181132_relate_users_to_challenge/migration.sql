/*
  Warnings:

  - You are about to drop the `_ChallengeToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ChallengeToUser" DROP CONSTRAINT "_ChallengeToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChallengeToUser" DROP CONSTRAINT "_ChallengeToUser_B_fkey";

-- DropTable
DROP TABLE "_ChallengeToUser";

-- CreateTable
CREATE TABLE "_ChallengeUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ChallengeAuthors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChallengeUsers_AB_unique" ON "_ChallengeUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_ChallengeUsers_B_index" ON "_ChallengeUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChallengeAuthors_AB_unique" ON "_ChallengeAuthors"("A", "B");

-- CreateIndex
CREATE INDEX "_ChallengeAuthors_B_index" ON "_ChallengeAuthors"("B");

-- AddForeignKey
ALTER TABLE "_ChallengeUsers" ADD CONSTRAINT "_ChallengeUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChallengeUsers" ADD CONSTRAINT "_ChallengeUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChallengeAuthors" ADD CONSTRAINT "_ChallengeAuthors_A_fkey" FOREIGN KEY ("A") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChallengeAuthors" ADD CONSTRAINT "_ChallengeAuthors_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
