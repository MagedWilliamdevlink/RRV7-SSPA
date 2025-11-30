// Shared import map loader - uses global cache set by root.tsx

export interface ImportMapConfig {
  imports: Record<string, string>;
  applications?: Array<{
    name: string;
    route: string;
  }>;
}

declare global {
  interface Window {
    __IMPORT_MAP_CACHE__: ImportMapConfig | null;
    __IMPORT_MAP_PROMISE__: Promise<ImportMapConfig> | null;
    loadImportMap: () => Promise<ImportMapConfig>;
  }
}

const CONFIG_SERVER_URL = 'http://localhost:9000';

export function loadImportMap(): Promise<ImportMapConfig> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('loadImportMap can only be called in browser'));
  }
  
  // Use the global loadImportMap function set by root.tsx
  if (window.loadImportMap) {
    return window.loadImportMap();
  }
  
  // Fallback if global function not available yet
  console.warn('[Import Map] Global loadImportMap not available, falling back to direct fetch');
  return fetch(`${CONFIG_SERVER_URL}/import-map.json`).then(response => response.json());
}

export function getImportMapSync(): ImportMapConfig | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.__IMPORT_MAP_CACHE__;
}
