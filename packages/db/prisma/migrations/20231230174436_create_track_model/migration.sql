-- CreateEnum
CREATE TYPE "TrackStatus" AS ENUM ('active', 'coming_soon');

-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "TrackStatus" NOT NULL DEFAULT 'coming_soon',
    "slug" TEXT NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TrackToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Track_id_key" ON "Track"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Track_slug_key" ON "Track"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_TrackToUser_AB_unique" ON "_TrackToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_TrackToUser_B_index" ON "_TrackToUser"("B");

-- AddForeignKey
ALTER TABLE "_TrackToUser" ADD CONSTRAINT "_TrackToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TrackToUser" ADD CONSTRAINT "_TrackToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
