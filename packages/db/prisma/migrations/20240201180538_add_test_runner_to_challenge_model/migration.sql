-- CreateEnum
CREATE TYPE "TestRunner" AS ENUM ('jest', 'vitest');

-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "testRunner" "TestRunner" NOT NULL DEFAULT 'jest';
