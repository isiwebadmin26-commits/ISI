import { lazy, ComponentType } from 'react';

/**
 * Enhanced React.lazy with automatic single-retry on dynamic import/chunk loading failure.
 * When a new deployment occurs, older chunk hashes may 404 or fail due to network blips.
 * This helper catches dynamic import errors, invalidates stale cache, and reloads once.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T } | Record<string, any>>,
  chunkName?: string
) {
  return lazy(async () => {
    const storageKey = `isi_retry_lazy_${chunkName || 'chunk'}`;
    const hasAlreadyRefreshed = sessionStorage.getItem(storageKey) === 'true';

    try {
      const module = await factory();
      // On success, reset the retry flag
      sessionStorage.removeItem(storageKey);

      if (module && typeof module === 'object' && 'default' in module) {
        return module as { default: T };
      }
      return { default: module as unknown as T };
    } catch (error) {
      console.error(`[lazyWithRetry] Failed to load chunk ${chunkName || 'unknown'}:`, error);

      if (!hasAlreadyRefreshed) {
        sessionStorage.setItem(storageKey, 'true');
        // Force reload to fetch fresh index.html with new asset hashes
        window.location.reload();
        // Return a pending promise to prevent rendering broken state during reload
        return new Promise<{ default: T }>(() => {});
      }

      // If we already refreshed and it still fails, reset flag and rethrow for ErrorBoundary
      sessionStorage.removeItem(storageKey);
      throw error;
    }
  });
}
