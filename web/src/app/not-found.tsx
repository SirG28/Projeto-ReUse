import Link from "next/link";
import Logo from "@/components/Logo";
import Button from "@/components/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-reuse-bg px-6 text-center animate-page-in">
      <Logo size={40} />
      <p className="text-5xl font-bold text-reuse-green-dark">404</p>
      <p className="text-lg font-bold text-reuse-text">Página não encontrada</p>
      <p className="max-w-xs text-sm text-reuse-text-secondary">
        O item ou a página que você procura não existe ou foi removido.
      </p>
      <Link href="/home" className="w-full max-w-xs">
        <Button fullWidth>Voltar para o início</Button>
      </Link>
    </div>
  );
}
