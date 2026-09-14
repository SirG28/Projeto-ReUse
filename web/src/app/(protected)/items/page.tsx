import type { Categoria, Prisma } from "@prisma/client";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import Chip from "@/components/Chip";
import HorizontalScroller from "@/components/HorizontalScroller";
import ItemCard from "@/components/ItemCard";
import ItemsSearchBar from "./ItemsSearchBar";
import ScreenHeader from "@/components/ScreenHeader";
import { CATEGORIAS, categoriaLabel } from "@/lib/categorias";

export const metadata = {
  title: "Todos os itens",
};

export default async function AllItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; q?: string }>;
}) {
  const user = await requireSession();
  const { categoria, q } = await searchParams;

  // Só aceita valores reais do enum — qualquer outra coisa na query string
  // (ou nenhuma) cai no "Todos", sem filtro.
  const categoriaAtiva = CATEGORIAS.find((c) => c.value === categoria)?.value;
  const busca = q?.trim() || "";

  // Preserva o termo de busca ao trocar de categoria (e vice-versa).
  function hrefCategoria(valor?: Categoria) {
    const params = new URLSearchParams();
    if (valor) params.set("categoria", valor);
    if (busca) params.set("q", busca);
    const query = params.toString();
    return query ? `/items?${query}` : "/items";
  }

  const filtroBusca: Prisma.ItemWhereInput = busca
    ? {
        OR: [
          { titulo: { contains: busca, mode: "insensitive" } },
          { descricao: { contains: busca, mode: "insensitive" } },
        ],
      }
    : {};

  const itens = await prisma.item.findMany({
    where: {
      userId: { not: user.id },
      status: "DISPONIVEL",
      ...(categoriaAtiva ? { categoria: categoriaAtiva as Categoria } : {}),
      ...filtroBusca,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      titulo: true,
      descricao: true,
      troca: true,
      imagem: true,
      categoria: true,
    },
  });

  return (
    <div className="animate-page-in">
      <ScreenHeader title="Todos os itens" backHref="/home" />

      <ItemsSearchBar defaultValue={busca} />

      <div className="px-4">
        <HorizontalScroller className="no-scrollbar flex gap-2 overflow-x-auto pb-1 pt-3">
          <Chip active={!categoriaAtiva} href={hrefCategoria()}>
            Todos
          </Chip>
          {CATEGORIAS.map((c) => (
            <Chip
              key={c.value}
              active={categoriaAtiva === c.value}
              href={hrefCategoria(c.value)}
            >
              {c.label}
            </Chip>
          ))}
        </HorizontalScroller>
      </div>

      <div className="px-4 pt-3">
        {itens.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <p className="text-[15px] text-reuse-text-secondary">
              {busca
                ? `Nenhum item encontrado para "${busca}".`
                : categoriaAtiva
                  ? `Nenhum item em "${categoriaLabel(categoriaAtiva)}" no momento.`
                  : "Nenhum item disponível no momento."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-6 sm:grid-cols-3 lg:grid-cols-4">
            {itens.map((item) => (
              <Link key={item.id} href={`/items/${item.id}`} className="focus-ring block rounded-xl">
                <ItemCard
                  imagem={item.imagem}
                  titulo={item.titulo}
                  descricao={item.descricao}
                  troca={item.troca}
                  categoria={item.categoria}
                  variant="fluid"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
