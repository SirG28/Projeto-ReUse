import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import MyItemsList from "./MyItemsList";

export default async function MyItemsPage() {
  const user = await requireSession();

  const itens = await prisma.item.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="animate-page-in">
      <MyItemsList
        itens={itens.map((item) => ({
          id: item.id,
          titulo: item.titulo,
          descricao: item.descricao,
          troca: item.troca,
          imagem: item.imagem,
        }))}
      />
    </div>
  );
}
