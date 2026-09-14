import Link from "next/link";
import type { CSSProperties } from "react";
import { IconCheck, IconLightning, IconStar } from "@/components/icons";

type Props = {
  name: string;
  itemCount: number;
  pontos: number;
};

export default function UserSummaryCard({ name, itemCount, pontos }: Props) {
  const meta = 1500;
  const progresso = Math.min(Math.round((pontos / meta) * 100), 100);

  return (
    <div className="mb-[18px] rounded-2xl border border-reuse-border bg-reuse-surface-raised p-3">
      <div className="mb-3 flex items-center">
        <div className="relative mr-2.5">
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-reuse-status-accepted-bg text-reuse-green">
            <IconLightning size={16} />
          </div>
          <div className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-reuse-accent-tint text-reuse-accent">
            <IconCheck size={10} />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-reuse-neutral-700">
            Boas-vindas, {name}
          </p>
          <p className="mt-0.5 text-xs text-reuse-neutral-500">Nível 1</p>
        </div>

        <div className="flex shrink-0 items-center gap-1 rounded-full border border-reuse-green bg-reuse-status-accepted-bg px-2.5 py-1 text-reuse-green">
          <IconStar size={11} />
          <span className="text-xs font-bold">
            {pontos.toLocaleString("pt-BR")} XP
          </span>
        </div>
      </div>

      <div className="mb-3.5">
        <div className="mb-1.5 flex justify-between text-xs text-reuse-neutral-700">
          <span>
            {pontos} / {meta.toLocaleString("pt-BR")} para o Nível 2
          </span>
          <span>{progresso}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-reuse-neutral-200">
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
        <div className="flex-1 rounded-[10px] border border-reuse-neutral-300 bg-reuse-surface-muted py-3.5 text-center">
          <p className="mb-1 text-lg font-bold text-reuse-text">0</p>
          <p className="text-xs text-reuse-neutral-700">Trocas</p>
        </div>

        <Link
          href="/profile"
          className="focus-ring flex-1 rounded-[10px] border border-reuse-neutral-300 bg-reuse-surface-muted py-3.5 text-center transition-colors hover:bg-reuse-surface-sunken"
        >
          <p className="mb-1 text-lg font-bold text-reuse-text">{itemCount}</p>
          <p className="text-xs text-reuse-neutral-700">Itens</p>
        </Link>

        <div className="flex-1 rounded-[10px] border border-reuse-neutral-300 bg-reuse-surface-muted py-3.5 text-center">
          <p className="mb-1 text-lg font-bold text-reuse-text">0</p>
          <p className="text-xs text-reuse-neutral-700">Avaliação</p>
        </div>
      </div>
    </div>
  );
}
