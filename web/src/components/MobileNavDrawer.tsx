"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { IconChevronRight, IconClose, IconMapPin } from "@/components/icons";
import { NAV_ITEMS } from "@/lib/navItems";

type Props = {
  open: boolean;
  onClose: () => void;
  userName: string;
  userCidade: string | null;
  userEstado: string | null;
  isActive: (href: string) => boolean;
  logoutAction: (formData: FormData) => void | Promise<void>;
};

export default function MobileNavDrawer({
  open,
  onClose,
  userName,
  userCidade,
  userEstado,
  isActive,
  logoutAction,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    triggerFocusRef.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    focusable?.[0]?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      triggerFocusRef.current?.focus();
    };
  }, [open, onClose]);

  const inicial = userName.charAt(0).toUpperCase() || "U";
  const localizacao = userCidade ? `${userCidade}${userEstado ? ` - ${userEstado}` : ""}` : null;

  return (
    <div
      className={`fixed inset-0 z-40 md:hidden ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-[250ms] ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`absolute inset-y-0 right-0 flex w-[80%] max-w-xs flex-col bg-white shadow-xl transition-transform duration-[250ms] ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="border-b border-reuse-header-border bg-reuse-green-dark px-4 py-3.5">
          <div className="flex items-center justify-between">
            {/* Vai direto pro Perfil em vez de só mostrar os dados — assim
                não sobra also um item "Perfil" redundante na lista logo
                abaixo apontando pro mesmo lugar. */}
            <Link
              href="/profile"
              onClick={onClose}
              className="focus-ring -m-1 mr-2 flex min-w-0 flex-1 items-center gap-2.5 rounded-lg p-1 transition-colors hover:bg-white/10"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
                <span className="text-sm font-bold text-white">{inicial}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{userName}</p>
                {localizacao && (
                  <p className="flex items-center gap-1 truncate text-xs text-white/80">
                    <IconMapPin size={11} />
                    {localizacao}
                  </p>
                )}
              </div>
              <IconChevronRight size={14} className="shrink-0 text-white/60" />
            </Link>
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={onClose}
              className="focus-ring flex h-8 w-8 items-center justify-center text-white"
            >
              <IconClose size={20} />
            </button>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
          {NAV_ITEMS.filter((item) => item.href !== "/profile").map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`focus-ring rounded-lg px-2.5 py-2.5 text-[15px] font-semibold transition-colors ${
                isActive(item.href)
                  ? "bg-reuse-green-accent text-white"
                  : "text-reuse-text hover:bg-reuse-surface-sunken"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/tips"
            onClick={onClose}
            className="focus-ring rounded-lg px-2.5 py-2.5 text-[15px] font-semibold text-reuse-text hover:bg-reuse-surface-sunken"
          >
            Dicas sustentáveis
          </Link>
          <span className="cursor-default rounded-lg px-2.5 py-2.5 text-[15px] font-semibold text-reuse-neutral-disabled">
            Ranking
          </span>
        </nav>

        <form action={logoutAction} className="border-t border-reuse-header-border p-3">
          <button
            type="submit"
            className="focus-ring w-full rounded-lg px-2.5 py-2.5 text-left text-[15px] font-semibold text-reuse-danger hover:bg-reuse-status-rejected-bg"
          >
            Sair da conta
          </button>
        </form>
      </div>
    </div>
  );
}
