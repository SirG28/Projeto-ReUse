import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReUse!",
  description: "Plataforma ReUse! — reutilização de itens e consumo consciente",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full">
      <head>
        {/* Material Symbols do próprio Google — biblioteca oficial de ícones
            do Material Design, servida como fonte de ícones (cada glifo é
            desenhado a partir do nome em texto, ex.: "edit", "delete"). Troca
            todos os ícones da plataforma, que antes eram SVGs recriados à
            mão em web/src/components/icons.tsx.
            As duas linhas de lint abaixo são falso-positivo aqui: o App
            Router não tem `pages/_document.js` (esse aviso é resquício do
            Pages Router — o layout raiz é o lugar certo pro link), e
            `display=block` é a recomendação do próprio Google pra fontes de
            ícone (evita o nome do ícone, ex. "settings", aparecer como texto
            por um instante antes da fonte carregar — o oposto do que
            `swap` faria). */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body
        className="min-h-full font-sans antialiased bg-reuse-bg text-reuse-text"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
