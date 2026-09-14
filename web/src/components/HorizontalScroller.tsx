"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { IconChevronLeft, IconChevronRight } from "@/components/icons";

const arrowClass =
  "focus-ring absolute top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-reuse-border bg-white text-reuse-text shadow-md transition hover:bg-reuse-surface-sunken md:flex";

const EDGE_TOLERANCE = 4;

// Só faz sentido em telas maiores: no touch (mobile/tablet) o próprio arrasto
// horizontal já é natural, e as setas ficariam redundantes ocupando espaço
// em cima dos cards. As setas só aparecem quando o conteúdo realmente
// transborda (senão não têm pra onde rolar) — e ficam sempre as duas
// visíveis juntas: o carrossel é "infinito", ao chegar numa ponta, clicar de
// novo naquela direção volta pra outra ponta em vez de prender o usuário lá.
export default function HorizontalScroller({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    function update() {
      if (!el) return;
      setHasOverflow(el.scrollWidth > el.clientWidth + EDGE_TOLERANCE);
    }

    update();
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, [children]);

  function scrollByPage(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const atEnd = direction === 1 && el.scrollLeft >= maxScroll - EDGE_TOLERANCE;
    const atStart = direction === -1 && el.scrollLeft <= EDGE_TOLERANCE;

    if (atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else if (atStart) {
      el.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
    }
  }

  return (
    <div className="relative">
      {hasOverflow && (
        <button
          type="button"
          onClick={() => scrollByPage(-1)}
          aria-label="Ver itens anteriores"
          className={`${arrowClass} left-0 -translate-x-1/2`}
        >
          <IconChevronLeft size={16} />
        </button>
      )}

      <div ref={scrollerRef} className={className}>
        {children}
      </div>

      {hasOverflow && (
        <button
          type="button"
          onClick={() => scrollByPage(1)}
          aria-label="Ver mais itens"
          className={`${arrowClass} right-0 translate-x-1/2`}
        >
          <IconChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
