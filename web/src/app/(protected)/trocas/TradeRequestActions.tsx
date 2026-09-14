"use client";

import { useState } from "react";
import { acceptTradeRequestAction, declineTradeRequestAction } from "@/app/actions/trades";
import Button from "@/components/Button";

export default function TradeRequestActions({
  tradeRequestId,
}: {
  tradeRequestId: string;
}) {
  const [enviando, setEnviando] = useState<"aceitar" | "recusar" | null>(null);

  return (
    <div className="flex gap-2.5">
      <form
        action={declineTradeRequestAction}
        onSubmit={() => setEnviando("recusar")}
        className="flex-1"
      >
        <input type="hidden" name="tradeRequestId" value={tradeRequestId} />
        <Button type="submit" variant="danger" size="sm" fullWidth disabled={enviando !== null}>
          {enviando === "recusar" ? "Recusando..." : "Recusar"}
        </Button>
      </form>
      <form
        action={acceptTradeRequestAction}
        onSubmit={() => setEnviando("aceitar")}
        className="flex-1"
      >
        <input type="hidden" name="tradeRequestId" value={tradeRequestId} />
        <Button type="submit" variant="primary" size="sm" fullWidth disabled={enviando !== null}>
          {enviando === "aceitar" ? "Aceitando..." : "Aceitar"}
        </Button>
      </form>
    </div>
  );
}
