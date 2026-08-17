"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateItemAction, deleteItemAction } from "@/app/actions/items";
import ScreenHeader from "@/components/ScreenHeader";
import Modal from "@/components/Modal";
import { useToast } from "@/components/ToastProvider";
import { inputClass, inputHeightClass, labelClass, textAreaClass } from "@/lib/formStyles";

type Item = {
  id: string;
  titulo: string;
  descricao: string;
  troca: string;
  imagem: string | null;
};

export default function MyItemsList({ itens }: { itens: Item[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [itemEditando, setItemEditando] = useState<Item | null>(null);
  const [itemExcluindo, setItemExcluindo] = useState<Item | null>(null);
  const [state, formAction, pending] = useActionState(updateItemAction, undefined);

  // Mantém os dados do último item aberto durante a animação de saída do
  // Modal (que continua montado por alguns ms depois de open=false). Ajuste
  // de estado direto no corpo do componente (não em efeito) — padrão
  // recomendado pelo React pra "derivar estado a partir de uma prop/valor
  // que muda", sem re-render extra.
  const [lastEditando, setLastEditando] = useState<Item | null>(null);
  const [lastExcluindo, setLastExcluindo] = useState<Item | null>(null);
  if (itemEditando && itemEditando !== lastEditando) {
    setLastEditando(itemEditando);
  }
  if (itemExcluindo && itemExcluindo !== lastExcluindo) {
    setLastExcluindo(itemExcluindo);
  }

  const editando = itemEditando ?? lastEditando;
  const excluindo = itemExcluindo ?? lastExcluindo;

  useEffect(() => {
    if (state?.success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- fecha o modal e notifica em reação ao resultado da server action (useActionState), não a um evento que dá pra tratar diretamente
      setItemEditando(null);
      showToast("Item atualizado!");
    }
  }, [state, showToast]);

  return (
    <>
      <ScreenHeader
        title="Meus Itens"
        backHref="/profile"
        onBack={() => router.back()}
      />

      {itens.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <p className="text-[15px] text-reuse-text-secondary">
            Nenhum item publicado ainda.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-4">
          {itens.map((item, i) => (
            <div
              key={item.id}
              className="animate-item-in rounded-xl border border-reuse-border bg-white p-3.5"
              style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
            >
              {item.imagem && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imagem}
                  alt={item.titulo}
                  className="mb-2.5 h-40 w-full rounded-lg object-cover"
                />
              )}
              <p className="mb-1 text-base font-bold text-reuse-text">
                {item.titulo}
              </p>
              <p className="mb-1.5 text-sm text-reuse-text-secondary">
                {item.descricao}
              </p>
              <p className="mb-3 text-[13px] font-semibold text-reuse-green-accent">
                Troca por: {item.troca}
              </p>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setItemEditando(item)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-reuse-green py-2 text-[13px] font-semibold text-reuse-green"
                >
                  <svg width={14} height={14} viewBox="0 0 16 16" fill="currentColor">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zm.854.854L11.207 2l1.5 1.5.793-.793zM10.5 2.207 3 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293L12.5 5.207zm-9 9.5v-.007L4.207 12 3.5 11.293 1.5 11.5z" />
                  </svg>
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => setItemExcluindo(item)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-reuse-danger py-2 text-[13px] font-semibold text-reuse-danger"
                >
                  <svg width={14} height={14} viewBox="0 0 16 16" fill="currentColor">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L13.882 4zM2.5 3h11V2h-11z" />
                  </svg>
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!itemEditando} onClose={() => setItemEditando(null)}>
        {editando && (
          <>
            <p className="mb-4 text-lg font-bold text-reuse-text">Editar item</p>

            <form key={editando.id} action={formAction}>
              <input type="hidden" name="id" value={editando.id} />

              <label className={labelClass} htmlFor="edit-titulo">
                Título
              </label>
              <input
                id="edit-titulo"
                name="titulo"
                defaultValue={editando.titulo}
                placeholder="Título do item"
                className={`${inputClass} ${inputHeightClass} mb-3.5`}
              />

              <label className={labelClass} htmlFor="edit-descricao">
                Descrição
              </label>
              <textarea
                id="edit-descricao"
                name="descricao"
                defaultValue={editando.descricao}
                placeholder="Descrição do item"
                className={`${textAreaClass} mb-3.5`}
              />

              <label className={labelClass} htmlFor="edit-troca">
                Troca por
              </label>
              <input
                id="edit-troca"
                name="troca"
                defaultValue={editando.troca}
                placeholder="O que você aceita na troca"
                className={`${inputClass} ${inputHeightClass} mb-3.5`}
              />

              {state?.error && (
                <p className="mb-3 rounded-lg border border-reuse-danger/30 bg-red-50 px-3 py-2 text-sm text-reuse-danger">
                  {state.error}
                </p>
              )}

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setItemEditando(null)}
                  className="flex-1 rounded-lg border border-[#CCCCCC] py-3 text-[13px] font-semibold text-[#666666]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="flex-1 rounded-lg bg-reuse-green-accent py-3 text-[13px] font-bold text-white disabled:opacity-60"
                >
                  {pending ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </>
        )}
      </Modal>

      <Modal open={!!itemExcluindo} onClose={() => setItemExcluindo(null)}>
        {excluindo && (
          <>
            <p className="mb-3.5 text-xl font-bold leading-tight text-reuse-text">
              Excluir item
            </p>
            <p className="mb-7 text-[15px] leading-relaxed text-reuse-text">
              Tem certeza que deseja excluir &ldquo;{excluindo.titulo}&rdquo;? Essa ação
              não pode ser desfeita.
            </p>

            <form
              action={deleteItemAction}
              onSubmit={() => {
                setItemExcluindo(null);
                showToast("Item excluído.");
              }}
            >
              <input type="hidden" name="id" value={excluindo.id} />
              <button
                type="submit"
                className="mb-2.5 w-full rounded-lg bg-reuse-danger py-3.5 text-[13px] font-bold text-white"
              >
                Sim, excluir item
              </button>
            </form>
            <button
              type="button"
              onClick={() => setItemExcluindo(null)}
              className="w-full rounded-lg border border-reuse-green-accent py-3.5 text-[13px] font-bold text-reuse-green-accent"
            >
              Cancelar
            </button>
          </>
        )}
      </Modal>
    </>
  );
}
