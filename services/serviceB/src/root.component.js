import { useState } from "react";

export default function Root(props) {
  const [count, setCount] = useState(0);

  return (
    <section className="p-6 bg-white dark:bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        ServiceB - Counter App
      </h2>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        This is a microfrontend application loaded via Single-SPA
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Increment
        </button>
        <button
          onClick={() => setCount(count - 1)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Decrement
        </button>
        <button
          onClick={() => setCount(0)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Reset
        </button>
        <span className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
          Count: {count}
        </span>
      </div>
    </section>
  );
}
