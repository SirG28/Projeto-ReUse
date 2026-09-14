import "server-only";
import { prisma } from "./prisma";

// Uma linha por (usuário, item): visitar de novo só atualiza `viewedAt`,
// em vez de acumular um histórico infinito de eventos.
export async function recordItemView(userId: string, itemId: string) {
  await prisma.itemView.upsert({
    where: { userId_itemId: { userId, itemId } },
    update: { viewedAt: new Date() },
    create: { userId, itemId },
  });
}
