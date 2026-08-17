import ScreenHeader from "@/components/ScreenHeader";
import { getNews } from "@/lib/news";

export default async function TipsPage() {
  const artigos = await getNews();

  return (
    <div className="animate-page-in">
      <ScreenHeader title="Dicas Sustentáveis" backHref="/home" />

      <div className="flex flex-col gap-3 p-4">
        {artigos.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <p className="text-[15px] text-reuse-text-secondary">
              Nenhuma dica disponível.
            </p>
          </div>
        ) : (
          artigos.map((artigo, i) => (
            <a
              key={artigo.url}
              href={artigo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block animate-item-in overflow-hidden rounded-xl border border-reuse-border bg-white"
              style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
            >
              {artigo.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={artigo.image}
                  alt={artigo.title}
                  className="h-40 w-full object-cover"
                />
              )}
              <div className="p-3.5">
                <p className="mb-1 text-[11px] font-bold uppercase text-reuse-green">
                  {artigo.source?.name}
                </p>
                <p className="mb-1.5 line-clamp-2 text-[15px] font-bold text-reuse-text">
                  {artigo.title}
                </p>
                <p className="mb-2 line-clamp-3 text-[13px] text-reuse-text-secondary">
                  {artigo.description}
                </p>
                <p className="text-[13px] font-semibold text-reuse-green">
                  Ler mais →
                </p>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
