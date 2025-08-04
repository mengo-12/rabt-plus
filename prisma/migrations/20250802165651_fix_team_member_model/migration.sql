/*
  Warnings:

  - Added the required column `updatedAt` to the `TeamMember` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TeamMemberStatus" AS ENUM ('invited', 'accepted', 'rejected');

-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'pending';
