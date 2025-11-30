import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { initializeSingleSpa, triggerReroute } from "../single-spa-init";

export function meta() {
  return [
    { title: "Services - React Router v7" },
    { name: "description", content: "Microfrontend services" },
  ];
}

export default function Services() {
  const { service } = useParams();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize Single-SPA and trigger reroute after ready
    initializeSingleSpa()
      .then(() => {
        // Small delay to ensure Single-SPA is fully ready
        return new Promise(resolve => setTimeout(resolve, 50));
      })
      .then(() => {
        setIsReady(true);
        // Trigger Single-SPA to re-evaluate active apps
        triggerReroute();
      })
      .catch((error) => {
        console.error("Failed to initialize Single-SPA:", error);
      });
  }, [service]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Services
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Microfrontend Applications
          </p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4">
        {!isReady && (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-600 dark:text-gray-300">Loading service...</div>
          </div>
        )}
        {/* Single-SPA will mount microfrontend here automatically */}
        {service && <div id={`single-spa-application:@rrv7/${service}`} />}
      </main>
    </div>
  );
}
