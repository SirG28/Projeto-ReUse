"use client";

import { useActionState, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createItemAction } from "@/app/actions/items";
import ScreenHeader from "@/components/ScreenHeader";
import PrimaryButton from "@/components/PrimaryButton";
import Modal from "@/components/Modal";
import { inputClass, inputHeightClass, labelClass, textAreaClass } from "@/lib/formStyles";

function comprimirImagem(
  file: File,
  maxDimensao = 1200,
  qualidade = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDimensao) {
          height = Math.round((height * maxDimensao) / width);
          width = maxDimensao;
        } else if (height > maxDimensao) {
          width = Math.round((width * maxDimensao) / height);
          height = maxDimensao;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas indisponível"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", qualidade));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

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
            className="text-xl text-reuse-green"
            aria-label="Fechar"
          >
            ×
          </button>
        }
      />

      <form action={formAction} className="px-4 pt-[18px]">
        <div className="relative mb-6 flex h-[190px] w-full items-center justify-center overflow-hidden bg-[#ECECEC]">
          {imagem ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imagem}
              alt="Pré-visualização do item"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-[#E9E9E9]" />
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute rounded-lg border border-reuse-green bg-reuse-bg px-4 py-2 text-[13px] font-semibold text-reuse-green"
          >
            ＋ Adicionar foto
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

        <label className={labelClass} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoCapitalize="none"
          placeholder="lorem@gmail.com"
          className={`${inputClass} ${inputHeightClass} mb-3.5`}
        />

        {state?.error && (
          <p className="mb-3 rounded-lg border border-reuse-danger/30 bg-red-50 px-3 py-2 text-sm text-reuse-danger">
            {state.error}
          </p>
        )}

        <div className="mt-3.5">
          <PrimaryButton disabled={pending}>
            {pending ? "Publicando..." : "+   Publicar item"}
          </PrimaryButton>
        </div>
      </form>

      <Modal open={showExitModal} onClose={() => setShowExitModal(false)}>
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={() => setShowExitModal(false)}
            className="text-2xl text-reuse-text"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <p className="mb-3.5 text-xl font-bold leading-tight text-reuse-text">
          Você deseja continuar a publicação desse item?
        </p>
        <p className="mb-7 text-[15px] leading-relaxed text-reuse-text">
          Ao sair dessa tela, você cancelará a publicação desse item
        </p>

        <button
          type="button"
          onClick={() => setShowExitModal(false)}
          className="mb-2.5 w-full rounded-lg bg-reuse-green-accent py-3.5 text-[13px] font-bold text-white"
        >
          Sim, voltar para publicação
        </button>
        <button
          type="button"
          onClick={() => router.push("/home")}
          className="w-full rounded-lg border border-reuse-green-accent py-3.5 text-[13px] font-bold text-reuse-green-accent"
        >
          Não, sair e cancelar item
        </button>
      </Modal>
    </>
  );
}
