"use client";

import { useActionState, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createItemAction } from "@/app/actions/items";
import ScreenHeader from "@/components/ScreenHeader";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { inputClass, inputHeightClass, labelClass, textAreaClass } from "@/lib/formStyles";
import { comprimirImagem } from "@/lib/comprimirImagem";
import { CATEGORIAS } from "@/lib/categorias";
import { IconClose, IconPlus } from "@/components/icons";

export default function PublishItemForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createItemAction, undefined);
  const [imagem, setImagem] = useState("");
  const [showExitModal, setShowExitModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFotoSelecionada(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Fotos de câmera de celular costumam vir com vários MB — a Vercel
    // limita o corpo de uma Server Action a 4.5MB, então redimensionamos e
    // comprimimos no navegador antes de enviar (evita erro ao publicar).
    comprimirImagem(file)
      .then(setImagem)
      .catch(() => {
        const reader = new FileReader();
        reader.onload = () => setImagem(reader.result as string);
        reader.readAsDataURL(file);
      });
  }

  return (
    <>
      <ScreenHeader
        title="Publicar item"
        backHref="/home"
        right={
          <button
            type="button"
            onClick={() => setShowExitModal(true)}
            className="text-reuse-green"
            aria-label="Fechar"
          >
            <IconClose size={20} />
          </button>
        }
      />

      <form action={formAction} className="px-4 pt-[18px] md:mx-auto md:max-w-md">
        <div className="relative mb-6 flex h-[190px] w-full items-center justify-center overflow-hidden bg-reuse-neutral-200">
          {imagem ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imagem}
              alt="Pré-visualização do item"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-reuse-surface-sunken" />
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute flex items-center gap-1.5 rounded-lg border border-reuse-green bg-reuse-bg px-4 py-2 text-[13px] font-semibold text-reuse-green"
          >
            <IconPlus size={13} />
            Adicionar foto
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFotoSelecionada}
          className="hidden"
        />
        <input type="hidden" name="imagem" value={imagem} />

        <h2 className="mb-3.5 text-lg font-bold text-reuse-text">Produto</h2>

        <label className={labelClass} htmlFor="titulo">
          Título do Produto
        </label>
        <input
          id="titulo"
          name="titulo"
          placeholder="Ex.: Quadro decorativo"
          className={`${inputClass} ${inputHeightClass} mb-3.5`}
        />

        <label className={labelClass} htmlFor="descricao">
          Descrição do Produto
        </label>
        <textarea
          id="descricao"
          name="descricao"
          placeholder="Ex.: 32cm x 24cm, moldura de madeira e pintura feita de acrílico."
          className={`${textAreaClass} mb-3.5`}
        />

        <label className={labelClass} htmlFor="categoria">
          Categoria
        </label>
        <select
          id="categoria"
          name="categoria"
          defaultValue="OUTROS"
          className={`${inputClass} ${inputHeightClass} mb-3.5`}
        >
          {CATEGORIAS.map((categoria) => (
            <option key={categoria.value} value={categoria.value}>
              {categoria.label}
            </option>
          ))}
        </select>

        <h2 className="mb-3.5 text-lg font-bold text-reuse-text">Troca</h2>

        <label className={labelClass} htmlFor="troca">
          Trocas que você aceita
        </label>
        <textarea
          id="troca"
          name="troca"
          placeholder="Ex.: Quadros semelhantes ou outras decorações de parede"
          className={`${textAreaClass} mb-3.5`}
        />

        <h2 className="mb-3.5 text-lg font-bold text-reuse-text">
          Formas de contato
        </h2>

        <label className={labelClass} htmlFor="whatsapp">
          WhatsApp (Obrigatório)
        </label>
        <input
          id="whatsapp"
          name="whatsapp"
          placeholder="(xx) x xxxx-xxxx"
          className={`${inputClass} ${inputHeightClass} mb-3.5`}
        />

        {state?.error && (
          <p className="mb-3 rounded-lg border border-reuse-danger/30 bg-red-50 px-3 py-2 text-sm text-reuse-danger">
            {state.error}
          </p>
        )}

        <div className="mt-3.5">
          <Button type="submit" disabled={pending} className="flex items-center justify-center gap-2">
            {pending ? (
              "Publicando..."
            ) : (
              <>
                <IconPlus size={16} />
                Publicar item
              </>
            )}
          </Button>
        </div>
      </form>

      <Modal open={showExitModal} onClose={() => setShowExitModal(false)}>
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={() => setShowExitModal(false)}
            className="text-reuse-text"
            aria-label="Fechar"
          >
            <IconClose size={22} />
          </button>
        </div>

        <p className="mb-3.5 text-xl font-bold leading-tight text-reuse-text">
          Você deseja continuar a publicação desse item?
        </p>
        <p className="mb-7 text-[15px] leading-relaxed text-reuse-text">
          Ao sair dessa tela, você cancelará a publicação desse item
        </p>

        <Button type="button" size="sm" fullWidth className="mb-2.5" onClick={() => setShowExitModal(false)}>
          Sim, voltar para publicação
        </Button>
        <Button type="button" variant="secondary" size="sm" fullWidth onClick={() => router.push("/home")}>
          Não, sair e cancelar item
        </Button>
      </Modal>
    </>
  );
}
