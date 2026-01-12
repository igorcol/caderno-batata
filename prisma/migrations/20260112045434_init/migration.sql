-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reactionPotato" INTEGER NOT NULL DEFAULT 0,
    "reactionFire" INTEGER NOT NULL DEFAULT 0,
    "reactionSkull" INTEGER NOT NULL DEFAULT 0,
    "reactionPen" INTEGER NOT NULL DEFAULT 0,
    "approved" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);
