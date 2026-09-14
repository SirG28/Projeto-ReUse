-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('DISPONIVEL', 'TROCADO');

-- CreateEnum
CREATE TYPE "TradeRequestStatus" AS ENUM ('PENDENTE', 'ACEITA', 'RECUSADA', 'CANCELADA');

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "status" "ItemStatus" NOT NULL DEFAULT 'DISPONIVEL';

-- CreateTable
CREATE TABLE "TradeRequest" (
    "id" TEXT NOT NULL,
    "mensagem" TEXT,
    "status" "TradeRequestStatus" NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "itemDesejadoId" TEXT NOT NULL,
    "itemOfertadoId" TEXT NOT NULL,
    "solicitanteId" TEXT NOT NULL,

    CONSTRAINT "TradeRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TradeRequest" ADD CONSTRAINT "TradeRequest_itemDesejadoId_fkey" FOREIGN KEY ("itemDesejadoId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeRequest" ADD CONSTRAINT "TradeRequest_itemOfertadoId_fkey" FOREIGN KEY ("itemOfertadoId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeRequest" ADD CONSTRAINT "TradeRequest_solicitanteId_fkey" FOREIGN KEY ("solicitanteId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
