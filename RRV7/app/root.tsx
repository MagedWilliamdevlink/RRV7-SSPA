import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {/* SystemJS for loading microfrontends */}
        <script src="https://cdn.jsdelivr.net/npm/systemjs@6.15.1/dist/system.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/systemjs@6.15.1/dist/extras/amd.min.js"></script>
        {/* Load and inject import map dynamically */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Global cache for import map
            window.__IMPORT_MAP_CACHE__ = null;
            window.__IMPORT_MAP_PROMISE__ = null;
            
            window.loadImportMap = function() {
              if (window.__IMPORT_MAP_CACHE__) {
                console.log('[Import Map] Returning cached import map');
                return Promise.resolve(window.__IMPORT_MAP_CACHE__);
              }
              
              if (window.__IMPORT_MAP_PROMISE__) {
                console.log('[Import Map] Fetch already in progress');
                return window.__IMPORT_MAP_PROMISE__;
              }
              
              console.log('[Import Map] Fetching import-map.json from config server...');
              window.__IMPORT_MAP_PROMISE__ = fetch('http://localhost:9000/import-map.json')
                .then(response => response.json())
                .then(data => {
                  console.log('[Import Map] Loaded successfully:', data);
                  window.__IMPORT_MAP_CACHE__ = data;
                  return data;
                })
                .catch(error => {
                  console.error('[Import Map] Failed to load:', error);
                  window.__IMPORT_MAP_PROMISE__ = null;
                  throw error;
                });
              
              return window.__IMPORT_MAP_PROMISE__;
            };
            
            // Load and inject import map immediately
            (async function() {
              try {
                const importMap = await window.loadImportMap();
                const script = document.createElement('script');
                script.type = 'systemjs-importmap';
                script.textContent = JSON.stringify(importMap);
                document.head.appendChild(script);
                
                // Dispatch event to signal import map is ready
                window.dispatchEvent(new CustomEvent('importmap-ready'));
              } catch (error) {
                console.error('[Import Map] Failed to inject:', error);
              }
            })();
          `
        }} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="font-bold text-xl">RRV7 Shell</Link>
            </div>
            <div className="flex space-x-2">
              <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded">EN</Link>
              <Link to="/pl" className="hover:bg-blue-700 px-3 py-2 rounded">PL</Link>
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>React Router v7 + Single-SPA Super Shell</p>
        </div>
      </footer>
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
