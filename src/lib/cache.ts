// Simple in-memory TTL cache. Upstream APIs rate-limit and anime
// metadata changes rarely, so aggressive caching is safe.


interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export function cacheGet<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value as T;
}

export function cacheSet<T>(key: string, value: T, ttlMs: number): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export const TTL = {
  search: 5 * 60 * 1000, // 5 min
  anime: 24 * 60 * 60 * 1000, // 24 h — finished anime rarely change
  airing: 60 * 60 * 1000, // 1 h — currently-airing data updates weekly
  top: 60 * 60 * 1000, // 1 h
  genre: 60 * 60 * 1000, // 1 h
};
