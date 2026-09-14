import type { Categoria } from "@prisma/client";
import Link from "next/link";
import SectionHeader from "./SectionHeader";
import ItemCard from "./ItemCard";
import HorizontalScroller from "./HorizontalScroller";

type Item = {
  id: string;
  titulo: string;
  descricao: string;
  troca: string;
  imagem: string | null;
  categoria: Categoria;
};

type Props = {
  title: string;
  itens: Item[];
  actionText?: string;
  actionHref?: string;
  // Se omitido, a seção inteira fica escondida quando não há itens (bom
  // pra seções secundárias como "Últimos vistos"). Se definido, mostra essa
  // mensagem em vez de esconder (bom pra seção principal do feed).
  emptyMessage?: string;
};

export default function ItemsRow({
  title,
  itens,
  actionText,
  actionHref,
  emptyMessage,
}: Props) {
  if (itens.length === 0 && !emptyMessage) {
    return null;
  }

  return (
    <div className="mb-[18px]">
      <SectionHeader title={title} actionText={actionText} actionHref={actionHref} />

      {itens.length === 0 ? (
        <div className="items-center px-6 py-6 text-center">
          <p className="text-sm text-reuse-text-secondary">{emptyMessage}</p>
        </div>
      ) : (
        <HorizontalScroller className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
          {itens.map((item, i) => (
            <Link
              key={item.id}
              href={`/items/${item.id}`}
              className="focus-ring animate-item-in block rounded-xl"
              style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
            >
              <ItemCard
                imagem={item.imagem}
                titulo={item.titulo}
                descricao={item.descricao}
                troca={item.troca}
                categoria={item.categoria}
              />
            </Link>
          ))}
        </HorizontalScroller>
      )}
    </div>
  );
}
