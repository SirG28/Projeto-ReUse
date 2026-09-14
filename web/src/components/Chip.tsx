import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  active: boolean;
  children: ReactNode;
  href?: string;
  onClick?: () => void;
};

function chipClass(active: boolean) {
  return `focus-ring shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors duration-150 ${
    active
      ? "border-reuse-green-dark bg-reuse-green-dark text-white"
      : "border-reuse-border text-reuse-text-secondary hover:bg-reuse-surface-sunken"
  }`;
}

export default function Chip({ active, children, href, onClick }: Props) {
  if (href) {
    return (
      <Link href={href} className={chipClass(active)}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={chipClass(active)}>
      {children}
    </button>
  );
}
