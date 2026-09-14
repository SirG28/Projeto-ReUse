import Link from "next/link";
import Logo from "@/components/Logo";

type Props = {
  logoutAction: (formData: FormData) => void | Promise<void>;
};

const linkClass =
  "focus-ring text-sm text-reuse-footer-text-secondary hover:text-white";

export default function SiteFooter({ logoutAction }: Props) {
  return (
    <footer className="mt-10 border-t-4 border-reuse-green-dark bg-reuse-footer-bg">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex flex-col items-center gap-2.5 sm:items-start">
          <Logo size={30} variant="light" />
          <p className="max-w-[220px] text-sm text-reuse-footer-text-secondary">
            Dando uma segunda vida aos seus objetos.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-white">
            Ajuda &amp; conta
          </h3>
          <nav className="flex flex-col items-center gap-2.5 sm:items-start">
            <Link href="/tips" className={linkClass}>
              Dicas sustentáveis
            </Link>
            <Link href="/settings" className={linkClass}>
              Configurações
            </Link>
            <form action={logoutAction}>
              <button type="submit" className={linkClass}>
                Sair da conta
              </button>
            </form>
          </nav>
        </div>
      </div>

      <div className="border-t border-reuse-footer-border">
        <div className="mx-auto w-full max-w-5xl px-4 py-4 text-center text-xs text-reuse-footer-text-secondary sm:text-left">
          © ReUse!
        </div>
      </div>
    </footer>
  );
}
