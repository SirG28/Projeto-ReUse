import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import HeaderHome from "@/components/HeaderHome";
import UserSummaryCard from "@/components/UserSummaryCard";
import SectionHeader from "@/components/SectionHeader";
import ShortcutCard from "@/components/ShortcutCard";
import ItemCard from "@/components/ItemCard";
import ToastFromQuery from "./ToastFromQuery";

export default async function HomePage() {
  const user = await requireSession();

  const [itemCount, itens] = await Promise.all([
    prisma.item.count({ where: { userId: user.id } }),
    prisma.item.findMany({
      where: { userId: { not: user.id } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Mesma regra de XP do mobile: +50 XP por item publicado (services/itemsService.ts + app/PublicItem.tsx)
  const pontos = itemCount * 50;

  return (
    <div className="animate-page-in">
      <Suspense fallback={null}>
        <ToastFromQuery />
      </Suspense>

      <HeaderHome pontos={pontos} />

      <div className="px-4 pt-3">
        <UserSummaryCard name={user.name} itemCount={itemCount} pontos={pontos} />

        <SectionHeader title="Atalhos" />
        <div className="mb-[18px] flex gap-2.5 overflow-x-auto pb-1">
          <ShortcutCard
            title="Publicar Item"
            xp="+ 50 XP"
            icon="+"
            href="/items/new"
          />
          <ShortcutCard title="Realizar Troca" xp="+ 100 XP" icon="⇄" />
          <ShortcutCard title="Ranking" xp="🏆" icon="🏆" />
        </div>

        <SectionHeader title="Itens para trocar" actionText="Ver todos" />

        {itens.length === 0 ? (
          <div className="items-center px-6 py-6 text-center">
            <p className="text-sm text-reuse-text-secondary">
              Nenhum item disponível ainda.
            </p>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {itens.map((item, i) => (
              <div
                key={item.id}
                className="animate-item-in"
                style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
              >
                <ItemCard
                  imagem={item.imagem}
                  titulo={item.titulo}
                  descricao={item.descricao}
                  troca={item.troca}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
