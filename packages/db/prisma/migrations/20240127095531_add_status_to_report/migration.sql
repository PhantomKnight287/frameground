-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "status" "ReportStatus" NOT NULL DEFAULT 'pending';
