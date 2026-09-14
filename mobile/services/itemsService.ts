// services/itemsService.ts
import { api } from "./api";
import { getCache, setCache, getCacheStale, clearCache } from "./cacheService";

export type Item = {
    id: string;
    titulo: string;
    descricao: string;
    troca: string;
    imagem?: string;
    whatsapp?: string;
    userId?: string;
    createdAt?: string;
};

const CACHE_KEY = "@cache_items";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

/**
 * Busca itens da API com cache.
 * 1. Tenta cache válido (< 5 min) → retorna direto
 * 2. Se expirou, busca da API e atualiza o cache
 * 3. Se a API falhar (offline), retorna cache antigo (stale)
 */
export async function getItems(): Promise<Item[]> {
    const cached = await getCache<Item[]>(CACHE_KEY);
    if (cached) {
        console.log("[items] cache válido");
        return cached;
    }

    try {
        console.log("[items] buscando da API");
        const response = await api.get<Item[]>("/items");
        const items = response.data;

        // Ordena do mais recente para o mais antigo
        items.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
        });

        await setCache(CACHE_KEY, items, CACHE_TTL);
        return items;
    } catch (error) {
        console.log("[items] erro na API, tentando cache antigo");
        const stale = await getCacheStale<Item[]>(CACHE_KEY);
        if (stale) {
            console.log("[items] retornando cache stale");
            return stale;
        }
        throw error;
    }
}

/**
 * Cria item via API. Invalida o cache pra próxima leitura puxar fresco.
 */
export async function createItem(
    item: Omit<Item, "id" | "createdAt">
): Promise<Item> {
    const response = await api.post<Item>("/items", {
        ...item,
        createdAt: new Date().toISOString(),
    });
    await clearCache(CACHE_KEY);
    return response.data;
}

/**
 * Limpa o cache manualmente (usado pelo pull-to-refresh da home).
 */
export async function refreshItemsCache(): Promise<void> {
    await clearCache(CACHE_KEY);
}