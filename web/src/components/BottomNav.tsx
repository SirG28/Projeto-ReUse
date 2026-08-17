"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItemClass =
  "flex h-12 w-[58px] flex-col items-center justify-center gap-1 rounded-[10px] transition-colors duration-200";

export default function BottomNav() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  function itemClass(path: string) {
    return isActive(path)
      ? `${navItemClass} bg-reuse-green-accent`
      : navItemClass;
  }

  function labelClass(path: string) {
    return isActive(path)
      ? "text-[11px] font-bold text-white transition-colors duration-200"
      : "text-[11px] text-[#2F2F2F] transition-colors duration-200";
  }

  function iconColor(path: string) {
    return isActive(path) ? "#FFFFFF" : "#000000";
  }

  return (
    <nav className="fixed bottom-3 left-4 right-4 z-10 mx-auto flex max-w-md items-center justify-around rounded-2xl border border-[#E5E2DA] bg-white py-2.5">
      <Link href="/home" className={itemClass("/home")}>
        <svg width={16} height={16} viewBox="0 0 16 16" fill={iconColor("/home")}>
          <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
        </svg>
        <span className={labelClass("/home")}>Início</span>
      </Link>

      <Link href="/items/new" className={itemClass("/items/new")}>
        <svg
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill={iconColor("/items/new")}
        >
          <path
            fillRule="evenodd"
            d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
          />
        </svg>
        <span className={labelClass("/items/new")}>Itens</span>
      </Link>

      <div className={navItemClass}>
        <svg width={16} height={16} viewBox="0 0 16 16" fill="#000000">
          <path
            fillRule="evenodd"
            d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"
          />
        </svg>
        <span className="text-[11px] text-[#2F2F2F]">Trocas</span>
      </div>

      <div className={navItemClass}>
        <svg width={16} height={16} viewBox="0 0 16 16" fill="#000000">
          <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935M3.504 1q.01.775.056 1.469c.13 2.028.457 3.546.87 4.667C5.294 9.48 6.484 10 7 10a.5.5 0 0 1 .5.5v2.61a1 1 0 0 1-.757.97l-1.426.356a.5.5 0 0 0-.179.085L4.5 15h7l-.638-.479a.5.5 0 0 0-.18-.085l-1.425-.356a1 1 0 0 1-.757-.97V10.5A.5.5 0 0 1 9 10c.516 0 1.706-.52 2.57-2.864.413-1.12.74-2.64.87-4.667q.045-.694.056-1.469z" />
        </svg>
        <span className="text-[11px] text-[#2F2F2F]">Ranking</span>
      </div>

      <Link href="/profile" className={itemClass("/profile")}>
        <svg
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill={iconColor("/profile")}
        >
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
        </svg>
        <span className={labelClass("/profile")}>Perfil</span>
      </Link>
    </nav>
  );
}
