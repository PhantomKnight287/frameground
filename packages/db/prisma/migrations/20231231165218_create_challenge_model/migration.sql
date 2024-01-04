-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "smallDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "test" TEXT NOT NULL,
    "trackId" TEXT,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Challenge_id_key" ON "Challenge"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Challenge_trackId_slug_key" ON "Challenge"("trackId", "slug");

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE SET NULL ON UPDATE CASCADE;
