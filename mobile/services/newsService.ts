// services/newsService.ts
import axios from "axios";
import { getCache, setCache, getCacheStale } from "./cacheService";

export type Article = {
    title: string;
    description: string;
    content: string;
    url: string;
    image: string;
    publishedAt: string;
    source: { name: string; url: string };
};

// ⚠️ Cole sua API key do GNews aqui
const GNEWS_API_KEY = "2e72352aac24da7c2807e52ba69646fc";
const GNEWS_BASE = "https://gnews.io/api/v4";

const CACHE_KEY = "@cache_news";
const CACHE_TTL = 60 * 60 * 1000; // 1 hora

const gnewsApi = axios.create({
    baseURL: GNEWS_BASE,
    timeout: 10000,
});

/**
 * Busca notícias sobre sustentabilidade da GNews.
 * Cache de 1h pra economizar chamadas (limite de 100/dia no free tier).
 */
export async function getNews(query = "sustentabilidade"): Promise<Article[]> {
    const cached = await getCache<Article[]>(CACHE_KEY);
    if (cached) {
        console.log("[news] cache válido");
        return cached;
    }

    try {
        console.log("[news] buscando da GNews");
        const response = await gnewsApi.get("/search", {
            params: {
                q: query,
                lang: "pt",
                country: "br",
                max: 10,
                token: GNEWS_API_KEY,
            },
        });
        const articles: Article[] = response.data.articles || [];
        await setCache(CACHE_KEY, articles, CACHE_TTL);
        return articles;
    } catch (error) {
        console.log("[news] erro, tentando cache antigo");
        const stale = await getCacheStale<Article[]>(CACHE_KEY);
        if (stale) return stale;
        throw error;
    }
}