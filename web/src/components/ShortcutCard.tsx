import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  xp: string;
  icon: ReactNode;
  href?: string;
};

function CardContent({ icon, title, xp }: { icon: ReactNode; title: string; xp: string }) {
  return (
    <>
      <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-full bg-reuse-surface-sunken text-reuse-green">
        {icon}
      </div>
      <p className="mb-1 text-[13px] font-bold text-reuse-text">{title}</p>
      <p className="text-xs text-reuse-neutral-700">{xp}</p>
    </>
  );
}

export default function ShortcutCard({ title, xp, icon, href }: Props) {
  // Largura fixa só faz sentido na fileira com scroll do mobile — em telas
  // maiores, com espaço de sobra, os 4 cards preenchem a largura disponível
  // em partes iguais em vez de ficarem pequenos e alinhados à esquerda.
  const baseClassName =
    "flex w-[118px] min-h-[106px] shrink-0 flex-col justify-between rounded-xl border border-reuse-neutral-300 bg-reuse-surface-raised p-3 text-left transition duration-150 md:w-auto md:flex-1";

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClassName} active:scale-[0.97] hover:border-reuse-green hover:shadow-sm`}
      >
        <CardContent icon={icon} title={title} xp={xp} />
      </Link>
    );
  }

  // Sem href: recurso ainda não implementado. Fica visualmente inerte (sem
  // hover/active) e com "Em breve" no lugar do XP, pra não parecer clicável.
  return (
    <div className={`${baseClassName} cursor-default opacity-60`}>
      <CardContent icon={icon} title={title} xp="Em breve" />
    </div>
  );
}
