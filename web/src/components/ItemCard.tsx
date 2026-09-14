import type { Categoria } from "@prisma/client";
import { categoriaLabel } from "@/lib/categorias";

type Props = {
  imagem?: string | null;
  titulo: string;
  descricao: string;
  troca: string;
  categoria?: Categoria;
  // "fixed" = card de 170px pra scroll horizontal (Home, Perfil).
  // "fluid" = preenche a largura do container, pra grids (ex.: /items).
  variant?: "fixed" | "fluid";
  // Mostrado só na grade do próprio Perfil, pra saber quais itens já saíram
  // de circulação.
  trocado?: boolean;
};

export default function ItemCard({
  imagem,
  titulo,
  descricao,
  troca,
  categoria,
  variant = "fixed",
  trocado = false,
}: Props) {
  const isFluid = variant === "fluid";

  return (
    <div
      className={`overflow-hidden rounded-xl border border-reuse-border bg-white transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${
        isFluid ? "h-full w-full" : "h-[210px] w-[170px] shrink-0"
      }`}
    >
      <div
        className={`relative w-full bg-reuse-surface-sunken ${
          isFluid ? "h-[130px]" : "h-[110px]"
        }`}
      >
        {imagem ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagem}
            alt={titulo}
            className={`h-full w-full object-cover ${trocado ? "grayscale" : ""}`}
          />
        ) : (
          <div className="h-full w-full bg-reuse-neutral-200" />
        )}

        {categoria && (
          <span className="absolute left-1.5 top-1.5 truncate rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] font-semibold text-reuse-green-dark shadow-sm">
            {categoriaLabel(categoria)}
          </span>
        )}

        {trocado && (
          <span className="absolute right-1.5 top-1.5 truncate rounded-full bg-black/70 px-1.5 py-0.5 text-[9px] font-semibold text-white">
            Trocado
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1 p-2.5">
        <p className="truncate text-[13px] font-bold text-reuse-text">
          {titulo || "Sem título"}
        </p>
        <p className="line-clamp-2 text-xs leading-4 text-reuse-text-secondary">
          {descricao || "Sem descrição"}
        </p>
        <p className="mt-0.5 truncate text-[11px] font-semibold text-reuse-green-accent">
          Troca por: {troca || "-"}
        </p>
      </div>
    </div>
  );
}
