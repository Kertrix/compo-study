-- DropForeignKey
ALTER TABLE "Ressource" DROP CONSTRAINT "Ressource_authorId_fkey";

-- AlterTable
ALTER TABLE "Ressource" ALTER COLUMN "authorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Ressource" ADD CONSTRAINT "Ressource_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
