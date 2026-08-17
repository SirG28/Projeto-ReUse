import Link from "next/link";
import type { CSSProperties } from "react";

type Props = {
  name: string;
  itemCount: number;
  pontos: number;
};

export default function UserSummaryCard({ name, itemCount, pontos }: Props) {
  const meta = 1500;
  const progresso = Math.min(Math.round((pontos / meta) * 100), 100);

  return (
    <div className="mb-[18px] rounded-2xl border border-[#ECE9E2] bg-[#FBFBFA] p-3">
      <div className="mb-3 flex items-center">
        <div className="relative mr-2.5">
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#F0F3E8]">
            <span className="text-lg text-reuse-green">◔</span>
          </div>
          <div className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#E9DDFB]">
            <span className="text-[10px] font-bold text-[#7A53C6]">✓</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-[#3B3B3B]">
            Boas-vindas, {name}
          </p>
          <p className="mt-0.5 text-xs text-[#6E6E6E]">Nível 1</p>
        </div>
      </div>

      <div className="mb-3.5">
        <div className="mb-1.5 flex justify-between text-xs text-[#3B3B3B]">
          <span>
            {pontos} / {meta.toLocaleString("pt-BR")} para o Nível 2
          </span>
          <span>{progresso}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#E6E6E6]">
          <div
            className="h-full rounded-full bg-reuse-green animate-progress-fill"
            style={
              {
                width: `${progresso}%`,
                "--progress-target": `${progresso}%`,
              } as CSSProperties
            }
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 rounded-[10px] border border-[#DDD7CC] bg-[#F2F0EC] py-3.5 text-center">
          <p className="mb-1 text-lg font-bold text-reuse-text">0</p>
          <p className="text-xs text-[#3F3F3F]">Trocas</p>
        </div>

        <Link
          href="/items/mine"
          className="flex-1 rounded-[10px] border border-[#DDD7CC] bg-[#F2F0EC] py-3.5 text-center"
        >
          <p className="mb-1 text-lg font-bold text-reuse-text">{itemCount}</p>
          <p className="text-xs text-[#3F3F3F]">Itens</p>
        </Link>

        <div className="flex-1 rounded-[10px] border border-[#DDD7CC] bg-[#F2F0EC] py-3.5 text-center">
          <p className="mb-1 text-lg font-bold text-reuse-text">0</p>
          <p className="text-xs text-[#3F3F3F]">Avaliação</p>
        </div>
      </div>
    </div>
  );
}
