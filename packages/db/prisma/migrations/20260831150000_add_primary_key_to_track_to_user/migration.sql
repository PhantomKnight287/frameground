-- Prisma creates implicit many-to-many tables with a primary key on ("A", "B")
-- instead of a unique index since v6, so the schema drifted from the migration
-- history when the ORM was upgraded.
--
-- The statements are written defensively: a `prisma migrate dev` run has already
-- applied this change to some databases, and this migration has to be a no-op
-- there while still creating the primary key on a fresh database.

-- DropIndex
DROP INDEX IF EXISTS "_TrackToUser_AB_unique";

-- AlterTable
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = '"_TrackToUser"'::regclass
      AND contype = 'p'
  ) THEN
    ALTER TABLE "_TrackToUser"
      ADD CONSTRAINT "_TrackToUser_AB_pkey" PRIMARY KEY ("A", "B");
  END IF;
END $$;
