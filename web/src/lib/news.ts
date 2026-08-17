import "server-only";

export type Article = {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: { name: string; url: string };
};

// Mesma chave usada no mobile (services/newsService.ts) — mantida só no
// servidor aqui, nunca enviada ao bundle do cliente.
const GNEWS_API_KEY = "2e72352aac24da7c2807e52ba69646fc";
const GNEWS_BASE = "https://gnews.io/api/v4";

/**
 * Busca notícias sobre sustentabilidade da GNews.
 * Cache de 1h via `next.revalidate` (equivalente ao TTL do cacheService mobile).
 */
export async function getNews(query = "sustentabilidade"): Promise<Article[]> {
  const url = new URL(`${GNEWS_BASE}/search`);
  url.searchParams.set("q", query);
  url.searchParams.set("lang", "pt");
  url.searchParams.set("country", "br");
  url.searchParams.set("max", "10");
  url.searchParams.set("token", GNEWS_API_KEY);

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.articles ?? [];
  } catch {
    return [];
  }
}
