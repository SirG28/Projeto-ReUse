"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfileAction } from "@/app/actions/auth";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useToast } from "@/components/ToastProvider";
import { useCepLookup } from "@/lib/useCepLookup";
import { inputClass, inputHeightClass, labelClass } from "@/lib/formStyles";

type User = {
  name: string;
  cep: string | null;
  cidade: string | null;
  estado: string | null;
};

export default function EditProfileModal({ user }: { user: User }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [aberto, setAberto] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    undefined
  );

  const [cep, setCep] = useState(user.cep ?? "");
  const {
    cidade,
    setCidade,
    estado,
    setEstado,
    buscando,
    erro: cepError,
  } = useCepLookup(cep, { cidade: user.cidade, estado: user.estado });

  useEffect(() => {
    if (state?.success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- fecha o modal e atualiza os dados exibidos em reação ao resultado da server action (useActionState), não a um evento que dá pra tratar diretamente
      setAberto(false);
      showToast("Perfil atualizado!");
      router.refresh();
    }
  }, [state, showToast, router]);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        fullWidth={false}
        className="flex-1"
        onClick={() => setAberto(true)}
      >
        Editar perfil
      </Button>

      <Modal open={aberto} onClose={() => setAberto(false)}>
        <p className="mb-4 text-lg font-bold text-reuse-text">Editar perfil</p>

        <form action={formAction}>
          <label className={labelClass} htmlFor="edit-name">
            Nome
          </label>
          <input
            id="edit-name"
            name="name"
            defaultValue={user.name}
            placeholder="Seu nome"
            className={`${inputClass} ${inputHeightClass} mb-3.5`}
          />

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className={labelClass} htmlFor="edit-cep">
                CEP
              </label>
              <input
                id="edit-cep"
                name="cep"
                inputMode="numeric"
                maxLength={9}
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder="00000-000"
                className={`${inputClass} ${inputHeightClass} mb-3.5`}
              />
            </div>
            {buscando && (
              <span className="mt-3.5 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-reuse-green border-t-transparent" />
            )}
          </div>
          {cepError && (
            <p className="-mt-2 mb-3.5 text-xs text-reuse-danger">
              {cepError}
            </p>
          )}

          <label className={labelClass} htmlFor="edit-cidade">
            Cidade
          </label>
          <input
            id="edit-cidade"
            name="cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Sua cidade"
            className={`${inputClass} ${inputHeightClass} mb-3.5`}
          />

          <label className={labelClass} htmlFor="edit-estado">
            Estado
          </label>
          <input
            id="edit-estado"
            name="estado"
            maxLength={2}
            value={estado}
            onChange={(e) => setEstado(e.target.value.toUpperCase())}
            placeholder="UF"
            className={`${inputClass} ${inputHeightClass} mb-3.5`}
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
              {pending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
