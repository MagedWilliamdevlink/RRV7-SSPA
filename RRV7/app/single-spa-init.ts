// Initialize Single-SPA once when the app loads
import { loadImportMap } from './import-map-loader';

let initPromise: Promise<void> | null = null;

function waitForImportMap(): Promise<void> {
  return new Promise((resolve) => {
    if (window.__IMPORT_MAP_CACHE__) {
      resolve();
    } else {
      window.addEventListener('importmap-ready', () => resolve(), { once: true });
    }
  });
}

export function initializeSingleSpa() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  // Return existing promise if already initializing/initialized
  if (initPromise) {
    console.log("[Single-SPA] Already initialized, returning existing promise");
    return initPromise;
  }

  // Wait for SystemJS to be available
  if (!(window as any).System) {
    console.warn("[Single-SPA] SystemJS not loaded yet");
    return Promise.reject(new Error("SystemJS not loaded"));
  }

  console.log("[Single-SPA] Starting initialization...");

  initPromise = waitForImportMap()
    .then(() => loadImportMap())
    .then((importMapConfig) => {
      console.log("[Single-SPA] Using cached import map:", importMapConfig);
      
      return import("single-spa").then(({ registerApplication, start }) => {
        console.log("[Single-SPA] Registering applications...");

        // Get applications from import map
        const applications = importMapConfig.applications || [];
        
        // If no applications defined, infer from imports (backward compatibility)
        if (applications.length === 0) {
          Object.keys(importMapConfig.imports).forEach(key => {
            if (key.startsWith('@rrv7/') && key !== '@rrv7/shared') {
              const serviceName = key.replace('@rrv7/', '');
              applications.push({ name: key, route: serviceName });
            }
          });
        }

        // Dynamically register all applications
        applications.forEach(({ name, route }) => {
          console.log(`[Single-SPA] Registering ${name} for route /services/${route}`);
          
          registerApplication({
            name,
            app: () => {
              console.log(`[Single-SPA] Loading ${name}...`);
              return (window as any).System.import(name);
            },
            activeWhen: (location) => {
              const isActive = location.pathname.includes(`/services/${route}`);
              const domElementExists = !!document.getElementById(`single-spa-application:${name}`);
              console.log(`[Single-SPA] ${name} activeWhen: ${location.pathname} -> ${isActive} (DOM: ${domElementExists})`);
              return isActive && domElementExists;
            },
          });
        });

        // Start Single-SPA
        console.log("[Single-SPA] Starting Single-SPA...");
        start({ urlRerouteOnly: true });

        // Integrate with React Router navigation
        // Override pushState and replaceState to notify Single-SPA
        const originalPushState = window.history.pushState;
        const originalReplaceState = window.history.replaceState;

        window.history.pushState = function (...args) {
          console.log("[Single-SPA] pushState intercepted:", args[2]);
          originalPushState.apply(window.history, args);
          window.dispatchEvent(new PopStateEvent('popstate'));
        };

        window.history.replaceState = function (...args) {
          console.log("[Single-SPA] replaceState intercepted:", args[2]);
          originalReplaceState.apply(window.history, args);
          window.dispatchEvent(new PopStateEvent('popstate'));
        };

        console.log("[Single-SPA] Initialization complete!");
      });
    })
    .catch(error => {
      console.error("[Single-SPA] Failed to initialize:", error);
      throw error;
    });

  return initPromise;
}

export function triggerReroute() {
  if (typeof window !== "undefined") {
    console.log("[Single-SPA] Triggering manual reroute for:", window.location.pathname);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}
