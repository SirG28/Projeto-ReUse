// services/cacheService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

type CacheEntry<T> = {
    data: T;
    timestamp: number;
    ttl: number; // em ms. 0 = sem expiração
};

/**
 * Salva no cache com TTL (ms). ttl=0 → não expira.
 */
export async function setCache<T>(
    key: string,
    data: T,
    ttlMs: number = 0
): Promise<void> {
    const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttlMs,
    };
    await AsyncStorage.setItem(key, JSON.stringify(entry));
}

/**
 * Lê do cache. Retorna null se não existir OU se expirou.
 */
export async function getCache<T>(key: string): Promise<T | null> {
    try {
        const raw = await AsyncStorage.getItem(key);
        if (!raw) return null;

        const entry: CacheEntry<T> = JSON.parse(raw);

        if (entry.ttl > 0) {
            const expirou = Date.now() - entry.timestamp > entry.ttl;
            if (expirou) {
                await AsyncStorage.removeItem(key);
                return null;
            }
        }

        return entry.data;
    } catch {
        return null;
    }
}

/**
 * Lê do cache MESMO se expirado. Útil pra fallback offline.
 */
export async function getCacheStale<T>(key: string): Promise<T | null> {
    try {
        const raw = await AsyncStorage.getItem(key);
        if (!raw) return null;
        const entry: CacheEntry<T> = JSON.parse(raw);
        return entry.data;
    } catch {
        return null;
    }
}

export async function clearCache(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
}