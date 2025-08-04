-- CreateTable
CREATE TABLE "TeamMessage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "TeamMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TeamMessage" ADD CONSTRAINT "TeamMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMessage" ADD CONSTRAINT "TeamMessage_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
