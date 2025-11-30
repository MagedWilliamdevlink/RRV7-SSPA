import { useState } from "react";
import { useLocation, useLoaderData, Link } from "react-router";

const translations = {
  en: {
    welcome: "Welcome to React Router v7 + Single-SPA",
    counter: "Counter",
    increment: "Increment",
    description: "This is the super shell hosting microfrontend apps",
    services: "Available Services",
    noServices: "No services available",
    serviceDescription: "Click on any service below to navigate to it:",
  },
  pl: {
    welcome: "Witamy w React Router v7 + Single-SPA",
    counter: "Licznik",
    increment: "Zwiększ",
    description: "To jest super powłoka hostująca aplikacje mikrofrontendowe",
    services: "Dostępne Usługi",
    noServices: "Brak dostępnych usług",
    serviceDescription: "Kliknij na dowolną usługę poniżej, aby do niej przejść:",
  },
};

interface ImportMapConfig {
  imports: Record<string, string>;
  applications?: Array<{
    name: string;
    route: string;
  }>;
}

export async function loader(): Promise<{ services: ImportMapConfig['applications'] }> {
  try {
    // Fetch from config server
    const response = await fetch('http://localhost:9000/import-map.json');
    if (!response.ok) {
      console.warn('Failed to fetch import map from config server');
      return { services: [] };
    }
    
    const importMap: ImportMapConfig = await response.json();
    return { 
      services: importMap.applications || [] 
    };
  } catch (error) {
    console.warn('Error fetching services:', error);
    return { services: [] };
  }
}

export function meta() {
  return [
    { title: "React Router v7 + Single-SPA" },
    { name: "description", content: "Super shell with microfrontends" },
  ];
}

export default function Home() {
  const location = useLocation();
  const { services } = useLoaderData<typeof loader>();
  const lang = location.pathname.startsWith("/pl") ? "pl" : "en";
  const t = translations[lang];
  const [count, setCount] = useState(0);

  // Ensure services is always an array
  const servicesList = services || [];

  // Format service name for display
  const formatServiceName = (route: string) => {
    return route
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t.welcome}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{t.description}</p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 space-y-6">
        {/* Counter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            {t.counter}
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCount(count + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {t.increment}
            </button>
            <span className="text-xl font-mono text-gray-900 dark:text-white">
              {count}
            </span>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            {t.services}
          </h2>
          
          {servicesList.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">{t.noServices}</p>
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t.serviceDescription}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {servicesList.map((service) => (
                  <Link
                    key={service.name}
                    to={`${lang === 'pl' ? '/pl' : ''}/services/${service.route}`}
                    className="block p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {formatServiceName(service.route)}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {service.name}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          /services/{service.route}
                        </p>
                      </div>
                      <svg 
                        className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
