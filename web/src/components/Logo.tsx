import Image from "next/image";

type Props = {
  size?: number;
  className?: string;
  // "light" troca o "Re" cinza-escuro por branco — pra usar sobre fundos
  // escuros (rodapé), onde a variante padrão perderia contraste. "mono" vai
  // além: até o "Use!" (verde-claro no "light") vira branco, pra manter
  // contraste em qualquer tom de verde — usada no painel de marca das telas
  // de Entrar/Criar conta, onde o "light" ainda ficava apagado.
  variant?: "default" | "light" | "mono";
};

// A logo (ícone + logotipo) vive em /public/brand — cores da marca já
// embutidas no arquivo, não precisa de props de cor além da variante.
const ASPECT_RATIO = 300 / 100;
const SRC = {
  default: "/brand/reuse-logo-horizontal.svg",
  light: "/brand/reuse-logo-horizontal-light.svg",
  mono: "/brand/reuse-logo-horizontal-mono.svg",
};

export default function Logo({ size = 32, className = "", variant = "default" }: Props) {
  return (
    <Image
      src={SRC[variant]}
      alt="ReUse!"
      width={Math.round(size * ASPECT_RATIO)}
      height={size}
      priority
      className={className}
    />
  );
}
