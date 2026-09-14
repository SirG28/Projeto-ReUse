import type { ReactNode } from "react";
import Logo from "@/components/Logo";

// Telas de Entrar/Criar conta: no mobile é só o formulário (o app já tem sua
// própria versão); na web ganham um tratamento de duas colunas — o
// formulário sozinho, esticado numa tela de desktop, ficava com uma cara de
// app mobile "jogado" no navegador.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="hidden flex-col justify-between bg-reuse-green-dark px-10 py-12 text-white md:sticky md:top-0 md:flex md:h-screen md:w-[42%] lg:w-[38%]">
        <Logo size={32} variant="mono" />

        <div>
          <p className="mb-3 text-3xl font-bold leading-tight">
            Dando uma segunda vida aos seus objetos.
          </p>
          <p className="max-w-sm text-sm text-white/80">
            Troque o que você não usa mais por algo que faz sentido pra você —
            sem gastar nada e sem desperdiçar.
          </p>
        </div>

        <p className="text-xs text-white/60">© ReUse!</p>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-10 md:px-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
