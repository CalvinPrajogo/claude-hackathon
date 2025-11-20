-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Party',
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "JoinRequest" ADD COLUMN     "bringing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "groupSize" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "Pregame" ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "requirements" TEXT;

-- CreateIndex
CREATE INDEX "Event_category_idx" ON "Event"("category");
