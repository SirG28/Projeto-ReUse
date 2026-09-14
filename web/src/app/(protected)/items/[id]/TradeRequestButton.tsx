"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { createTradeRequestAction } from "@/app/actions/trades";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useToast } from "@/components/ToastProvider";
import { textAreaClass } from "@/lib/formStyles";

type MeuItem = {
  id: string;
  titulo: string;
  imagem: string | null;
};

export default function TradeRequestButton({
  itemDesejadoId,
  meusItensDisponiveis,
  solicitacaoPendente,
}: {
  itemDesejadoId: string;
  meusItensDisponiveis: MeuItem[];
  solicitacaoPendente: boolean;
}) {
  const { showToast } = useToast();
  const [aberto, setAberto] = useState(false);
  const [itemOfertadoId, setItemOfertadoId] = useState(
    meusItensDisponiveis[0]?.id ?? ""
  );
  const [state, formAction, pending] = useActionState(
    createTradeRequestAction,
    undefined
  );

  useEffect(() => {
    if (state?.success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- fecha o modal e notifica em reação ao resultado da server action (useActionState), não a um evento que dá pra tratar diretamente
      setAberto(false);
      showToast("Solicitação de troca enviada!");
    }
  }, [state, showToast]);

  if (solicitacaoPendente) {
    return (
      <button
        type="button"
        disabled
        className="w-full rounded-xl bg-reuse-border py-3 text-lg font-bold text-reuse-text-secondary"
      >
        Solicitação enviada
      </button>
    );
  }

  if (meusItensDisponiveis.length === 0) {
    return (
      <div className="rounded-xl border border-reuse-border bg-white p-3.5 text-center">
        <p className="mb-2 text-sm text-reuse-text-secondary">
          Publique um item seu antes de solicitar uma troca.
        </p>
        <Link
          href="/items/new"
          className="text-sm font-semibold text-reuse-green-accent"
        >
          Publicar item →
        </Link>
      </div>
    );
  }

  return (
    <>
      <Button type="button" onClick={() => setAberto(true)}>
        Solicitar troca
      </Button>

      <Modal open={aberto} onClose={() => setAberto(false)}>
        <p className="mb-4 text-lg font-bold text-reuse-text">
          Solicitar troca
        </p>

        <form action={formAction}>
          <input type="hidden" name="itemDesejadoId" value={itemDesejadoId} />
          <input type="hidden" name="itemOfertadoId" value={itemOfertadoId} />

          <p className="mb-2 text-sm font-semibold text-reuse-text">
            Qual item seu você quer oferecer?
          </p>
          <div className="mb-3.5 flex flex-col gap-2">
            {meusItensDisponiveis.map((item) => (
              <label
                key={item.id}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg border p-2 ${
                  itemOfertadoId === item.id
                    ? "border-reuse-green-dark bg-reuse-avatar-bg/40"
                    : "border-reuse-border"
                }`}
              >
                <input
                  type="radio"
                  name="itemOfertadoRadio"
                  value={item.id}
                  checked={itemOfertadoId === item.id}
                  onChange={() => setItemOfertadoId(item.id)}
                  className="shrink-0"
                />
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-reuse-surface-sunken">
                  {item.imagem ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imagem}
                      alt={item.titulo}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-reuse-neutral-200" />
                  )}
                </div>
                <span className="truncate text-sm text-reuse-text">
                  {item.titulo}
                </span>
              </label>
            ))}
          </div>

          <label className="mb-1.5 block text-sm text-reuse-text" htmlFor="mensagem">
            Mensagem (opcional)
          </label>
          <textarea
            id="mensagem"
            name="mensagem"
            placeholder="Ex.: posso levar até amanhã à tarde"
            className={`${textAreaClass} mb-3.5`}
          />

          {state?.error && (
            <p className="mb-3 rounded-lg border border-reuse-danger/30 bg-red-50 px-3 py-2 text-sm text-reuse-danger">
              {state.error}
            </p>
          )}

          <div className="flex gap-2.5">
            <Button type="button" variant="ghost" size="sm" className="flex-1" onClick={() => setAberto(false)}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" className="flex-1" disabled={pending}>
              {pending ? "Enviando..." : "Enviar solicitação"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
