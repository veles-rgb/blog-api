-- DropIndex
DROP INDEX "Posts_slug_idx";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isAuthor" BOOLEAN NOT NULL DEFAULT false;
