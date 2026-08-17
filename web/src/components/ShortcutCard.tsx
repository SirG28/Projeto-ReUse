import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  xp: string;
  icon: string;
  href?: string;
};

function CardContent({ icon, title, xp }: { icon: ReactNode; title: string; xp: string }) {
  return (
    <>
      <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#F1F1EE]">
        <span className="text-base font-bold text-reuse-green">{icon}</span>
      </div>
      <p className="mb-1 text-[13px] font-bold text-reuse-text">{title}</p>
      <p className="text-xs text-[#3F3F3F]">{xp}</p>
    </>
  );
}

export default function ShortcutCard({ title, xp, icon, href }: Props) {
  const className =
    "flex w-[118px] min-h-[106px] shrink-0 flex-col justify-between rounded-xl border border-[#D9D4CB] bg-[#FBFBFA] p-3 text-left transition duration-150 active:scale-[0.97] hover:border-reuse-green";

  if (href) {
    return (
      <Link href={href} className={className}>
        <CardContent icon={icon} title={title} xp={xp} />
      </Link>
    );
  }

  return (
    <div className={className}>
      <CardContent icon={icon} title={title} xp={xp} />
    </div>
  );
}
