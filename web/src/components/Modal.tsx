"use client";

import { useEffect, useState, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

const TRANSITION_MS = 250;

export default function Modal({ open, onClose, children }: Props) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  // Liga/desliga `mounted`/`visible` com atraso proposital (rAF pra entrada,
  // setTimeout pra saída) pra dar tempo da transição CSS rodar antes de
  // desmontar — não tem como isso ser puro/síncrono no render.
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted(true);
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }

    setVisible(false);
    const timer = setTimeout(() => setMounted(false), TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-20 flex items-end justify-center px-2.5 transition-opacity duration-[250ms] ${
        visible ? "bg-black/40 opacity-100" : "bg-black/40 opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md rounded-t-3xl bg-white px-[22px] pb-6 pt-5 transition-transform duration-[250ms] ease-out ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
