"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import IconButton from "@/components/IconButton";
import Logo from "@/components/Logo";
import MobileNavDrawer from "@/components/MobileNavDrawer";
import { IconBurger, IconClose, IconMapPin, IconPerson } from "@/components/icons";
import { NAV_ITEMS } from "@/lib/navItems";

type Props = {
  userName: string;
  userCidade: string | null;
  userEstado: string | null;
  logoutAction: (formData: FormData) => void | Promise<void>;
};

export default function SiteHeader({ userName, userCidade, userEstado, logoutAction }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function navLinkClass(href: string) {
    return `focus-ring rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
      isActive(href)
        ? "bg-reuse-green-accent text-white"
        : "text-reuse-text-secondary hover:bg-reuse-surface-sunken"
    }`;
  }

  function profileIconClass(href: string) {
    return `focus-ring flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-150 ${
      isActive(href)
        ? "bg-reuse-green-accent text-white"
        : "text-reuse-text-secondary hover:bg-reuse-surface-sunken"
    }`;
  }

  const localizacao = userCidade ? `${userCidade}${userEstado ? ` - ${userEstado}` : ""}` : null;

  return (
    <>
      <header className="sticky top-0 z-30">
        {/* Faixa utilitária: só desktop — no mobile, localização/Dicas/Ranking
            vivem no drawer, pra não empilhar mais uma barra na tela pequena. */}
        <div className="hidden bg-reuse-green-dark md:block">
          <div className="mx-auto flex h-9 w-full max-w-5xl items-center justify-between px-4 text-xs font-medium text-white/90">
            <span className="flex items-center gap-1.5">
              <IconMapPin size={12} />
              {localizacao ? `Trocas perto de ${localizacao}` : "Trocas sustentáveis no Brasil todo"}
            </span>
            <div className="flex items-center gap-4">
              <Link href="/tips" className="focus-ring rounded hover:text-white hover:underline">
                Dicas sustentáveis
              </Link>
              <span className="cursor-default text-white/50">Ranking</span>
            </div>
          </div>
        </div>

        <div className="border-b border-reuse-header-border bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
            <Link href="/home" className="shrink-0">
              <Logo size={36} />
            </Link>

            {/* Logo à esquerda, o resto à direita: nav em texto + Perfil como
                ícone (evita repetir "Perfil" por extenso quando já existe um
                header dedicado a essa área com o mesmo destino). */}
            <div className="hidden items-center gap-3 md:flex">
              {NAV_ITEMS.filter((item) => item.href !== "/profile").map((item) => (
                <Link key={item.href} href={item.href} className={navLinkClass(item.href)}>
                  {item.label}
                </Link>
              ))}
              <Link
                href="/profile"
                aria-label="Perfil"
                className={`ml-1 ${profileIconClass("/profile")}`}
              >
                <IconPerson size={18} />
              </Link>
            </div>

            <div className="md:hidden">
              <IconButton
                icon={open ? <IconClose size={20} /> : <IconBurger size={20} />}
                label={open ? "Fechar menu" : "Abrir menu"}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Fora do <header>: backdrop-filter (backdrop-blur) no header cria um
          containing block para descendentes `fixed`, o que prenderia o
          drawer dentro da altura de 64px do header em vez do viewport. */}
      <MobileNavDrawer
        open={open}
        onClose={() => setOpen(false)}
        userName={userName}
        userCidade={userCidade}
        userEstado={userEstado}
        isActive={isActive}
        logoutAction={logoutAction}
      />
    </>
  );
}
