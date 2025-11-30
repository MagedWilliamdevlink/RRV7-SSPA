### Define routes in React Router Framework Mode

Source: https://github.com/remix-run/react-router/blob/main/docs/start/modes.md

This code snippet illustrates how to define routes in React Router's Framework Mode using the `@react-router/dev/routes` API. Framework Mode provides a comprehensive routing experience with features like type-safe `href`, intelligent code splitting, and various rendering strategies, typically used with a Vite plugin wrapper.

```ts
import { index, route } from "@react-router/dev/routes";

export default [
  index("./home.tsx"),
  route("products/:pid", "./product.tsx"),
];
```

--------------------------------

### Install React Router Vite Plugin

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/router-provider.md

This command installs the `@react-router/dev` package as a development dependency. This package provides the Vite plugin for React Router, which adds framework features like route loaders, actions, and automatic data revalidation to your application.

```shellscript
npm install -D @react-router/dev
```

--------------------------------

### Define Routes for Server Rendering - React Router

Source: https://github.com/remix-run/react-router/blob/main/docs/start/data/custom.md

Defines route objects for server-side rendering. These route objects are the same used on the client and support features like loaders and components.

```tsx
export default [
  {
    path: "/",
    Component: Root,
    children: [
      {
        path: "shows/:showId",
        Component: Show,
        loader: ({ params }) => {
          return db.loadShow(params.id);
        },
      },
    ],
  },
];
```

--------------------------------

### Server-Side Rendering with React Router

Source: https://github.com/remix-run/react-router/blob/main/docs/start/data/custom.md

Performs server-side rendering for React Router applications. It involves creating a static router, querying route data, rendering the application to HTML, and constructing a full HTTP response.

```ts
import { renderToString } from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router";

import routes from "./some-routes.js";

let { query, dataRoutes } = createStaticHandler(routes);

export async function handler(request: Request) {
  // 1. run actions/loaders to get the routing context with `query`
  let context = await query(request);

  // If `query` returns a Response, send it raw (a route probably a redirected)
  if (context instanceof Response) {
    return context;
  }

  // 2. Create a static router for SSR
  let router = createStaticRouter(dataRoutes, context);

  // 3. Render everything with StaticRouterProvider
  let html = renderToString(
    <StaticRouterProvider
      router={router}
      context={context}
    />,
  );

  // Setup headers from action and loaders from deepest match
  let leaf = context.matches[context.matches.length - 1];
  let actionHeaders = context.actionHeaders[leaf.route.id];
  let loaderHeaders = context.loaderHeaders[leaf.route.id];
  let headers = new Headers(actionHeaders);
  if (loaderHeaders) {
    for (let [key, value] of loaderHeaders.entries()) {
      headers.append(key, value);
    }
  }

  headers.set("Content-Type", "text/html; charset=utf-8");

  // 4. send a response
  return new Response(`<!DOCTYPE html>${html}`, {
    status: context.statusCode,
    headers,
  });
}
```

--------------------------------

### Update Vite Configuration with React Router Plugin

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/component-routes.md

This code snippet shows how to modify your `vite.config.ts` file to replace the default `@vitejs/plugin-react` with the `reactRouter` plugin from `@react-router/dev/vite`. This change enables the framework features provided by React Router's Vite plugin.

```typescript
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";


export default defineConfig({
  plugins: [
    reactRouter()
  ],
});
```

--------------------------------

### Lazy Load Routes - React Router

Source: https://github.com/remix-run/react-router/blob/main/docs/start/data/custom.md

Enables lazy loading of route definitions, including loaders, actions, and components. This improves initial load performance by only fetching route-specific code when it's needed.

```tsx
createBrowserRouter([
  {
    path: "/show/:showId",
    lazy: {
      loader: async () =>
        (await import("./show.loader.js")).loader,
      action: async () =>
        (await import("./show.action.js")).action,
      Component: async () =>
        (await import("./show.component.js")).Component,
    },
  },
]);
```

--------------------------------

### Implement loader and component in React Router Framework Mode

Source: https://github.com/remix-run/react-router/blob/main/docs/start/modes.md

This example demonstrates how to implement a `loader` function and a React component within Framework Mode, utilizing the Route Module API. The loader fetches data based on route parameters, and the component renders that data, showcasing type-safe access to `params` and `loaderData` for a robust routing solution.

```tsx
import { Route } from "./+types/product.tsx";

export async function loader({ params }: Route.LoaderArgs) {
  let product = await getProduct(params.pid);
  return { product };
}

export default function Product({
  loaderData,
}: Route.ComponentProps) {
  return <div>{loaderData.product.name}</div>;
}
```

--------------------------------

### Create React Router RSC Framework Mode Project

Source: https://github.com/remix-run/react-router/blob/main/docs/how-to/react-server-components.md

This command initializes a new React Router project configured for experimental React Server Components (RSC) in Framework Mode. It uses the `create-react-router` CLI tool to fetch a template that includes the necessary setup for RSC, Server Side Rendering (SSR), Client Components, and Server Functions.

```shellscript
npx create-react-router@latest --template remix-run/react-router-templates/unstable_rsc-framework-mode
```

--------------------------------

### Configure Vite for React Router RSC Framework Mode

Source: https://github.com/remix-run/react-router/blob/main/docs/how-to/react-server-components.md

This configuration demonstrates how to set up Vite for React Router's experimental React Server Components (RSC) in Framework Mode. It imports and uses the `unstable_reactRouterRSC` plugin from `@react-router/dev/vite` along with the `@vitejs/plugin-rsc`, ensuring the React Router plugin is placed before the RSC plugin in the Vite configuration.

```typescript
import { defineConfig } from "vite";
import { unstable_reactRouterRSC as reactRouterRSC } from "@react-router/dev/vite";
import rsc from "@vitejs/plugin-rsc";

export default defineConfig({
  plugins: [reactRouterRSC(), rsc()],
});
```

--------------------------------

### Add Development Script to package.json

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/component-routes.md

Updates the `package.json` file by adding a `dev` script. This script uses `react-router dev` to start the development server, allowing the application to be booted and tested.

```json
"scripts": {
  "dev": "react-router dev"
}
```

--------------------------------

### Define Existing App Route Structure (Context)

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/component-routes.md

Illustrates an example of how an existing route might be defined within a traditional `App.tsx` component using `react-router-dom`'s `<Routes>` and `<Route>`. This code snippet serves as context for migrating individual routes.

```tsx
// ...
import About from "./containers/About";

export default function App() {
  return (
    <Routes>
      <Route path="/about" element={<About />} />
    </Routes>
  );
}
```

--------------------------------

### Traditional Vite HTML Entry Point Structure

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/router-provider.md

Standard index.html structure in a typical Vite application before migration to React Router plugin. This HTML file includes meta tags, viewport configuration, and a script reference to the main TypeScript entry point with a root div for React mounting.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>My App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

--------------------------------

### Server Middleware for Pre-Handler Logic Only (TypeScript)

Source: https://github.com/remix-run/react-router/blob/main/decisions/0014-context-middleware.md

Presents a simplified server-side middleware that only performs logic before handlers. By omitting the explicit `next()` call, the framework automatically executes handlers and propagates the response upwards after the middleware's logic completes, streamlining simple pre-processing tasks.

```typescript
const myMiddleware: Route.unstable_MiddlewareFunction = async ({
  request,
  context,
}) => {
  context.user = await getUser(request);
  // Look ma, no next!
};
```

--------------------------------

### Traditional App Component with RouterProvider Before Migration

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/router-provider.md

Example of a typical App.tsx structure before React Router Vite plugin migration, showing global CSS imports, context providers, and layout components wrapping the RouterProvider. These elements need to be relocated to root.tsx during migration.

```tsx
import "./index.css";

export default function App() {
  return (
    <OtherProviders>
      <AppLayout>
        <RouterProvider router={router} />
      </AppLayout>
    </OtherProviders>
  );
}
```

--------------------------------

### Traditional Vite Client Entry Point with BrowserRouter

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/router-provider.md

Standard main.tsx structure in a Vite application before React Router plugin migration, showing manual route creation with createBrowserRouter, ReactDOM.createRoot usage, and RouterProvider component rendering. This approach requires explicit route definitions and manual router configuration.

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";

const router = createBrowserRouter([
  // ... route definitions
]);

ReactDOM.createRoot(
  document.getElementById("root")!,
).render(
  <React.StrictMode>
    <RouterProvider router={router} />;
  </React.StrictMode>,
);
```

--------------------------------

### Create Static Handler for SSR - React Router

Source: https://github.com/remix-run/react-router/blob/main/docs/start/data/custom.md

Transforms route definitions into a request handler using `createStaticHandler`. This function processes incoming requests to load data for the matched routes, returning query and dataRoutes.

```ts
import { createStaticHandler } from "react-router";
import routes from "./some-routes";

let { query, dataRoutes } = createStaticHandler(routes);
```

--------------------------------

### Create Placeholder Catchall Route Component

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/component-routes.md

Provides a basic React component for the `catchall.tsx` file. Initially, this component renders a simple "Hello, world!" message to verify the application's basic routing setup before integrating the full application.

```tsx
export default function Component() {
  return <div>Hello, world!</div>;
}
```

--------------------------------

### Create Route Files for React Router

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/component-routes.md

Initializes the necessary route configuration file (`routes.ts`) and a catchall route component file (`catchall.tsx`) for the React Router Vite plugin setup. These files are essential for defining and handling application routes.

```shellscript
touch src/routes.ts src/catchall.tsx
```

--------------------------------

### Render Router with React Router

Source: https://github.com/remix-run/react-router/blob/main/docs/start/data/custom.md

Renders the defined router in the browser using the `<RouterProvider>` component. This component takes the router instance as a prop and is typically used within the root of your React application's DOM.

```tsx
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />,
);
```

--------------------------------

### Create Browser Router - React Router

Source: https://github.com/remix-run/react-router/blob/main/docs/start/data/custom.md

Defines the browser runtime API for route module APIs (loaders, actions, etc.). It accepts an array of route objects supporting loaders, actions, and error boundaries. This is typically created by the React Router Vite plugin but can be manually defined.

```tsx
import { createBrowserRouter } from "react-router";

let router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        path: "shows/:showId",
        Component: Show,
        loader: ({ request, params }) =>
          fetch(`/api/show/${params.showId}.json`, {
            signal: request.signal,
          }),
      },
    ],
  },
]);
```

--------------------------------

### Implement Server and Client Middleware in React Router Route (Framework Mode)

Source: https://github.com/remix-run/react-router/blob/main/docs/how-to/middleware.md

This code illustrates defining and exporting both server-side and client-side middleware functions within a React Router route. The `authMiddleware` handles server-side authentication and redirection, while `timingMiddleware` logs client-side navigation duration, showcasing how middleware can interact with `request`, `context`, and the `next` function.

```tsx
import { redirect } from "react-router";
import { userContext } from "~/context";

// Server-side Authentication Middleware
async function authMiddleware({ request, context }) {
  const user = await getUserFromSession(request);
  if (!user) {
    throw redirect("/login");
  }
  context.set(userContext, user);
}

export const middleware: Route.MiddlewareFunction[] = [
  authMiddleware,
];

// Client-side timing middleware
async function timingMiddleware({ context }, next) {
  const start = performance.now();
  await next();
  const duration = performance.now() - start;
  console.log(`Navigation took ${duration}ms`);
}

export const clientMiddleware: Route.ClientMiddlewareFunction[] =
  [timingMiddleware];

export async function loader({
  context,
}: Route.LoaderArgs) {
  const user = context.get(userContext);
  const profile = await getProfile(user);
  return { profile };
}

export default function Dashboard({
  loaderData,
}: Route.ComponentProps) {
  return (
    <div>
      <h1>Welcome {loaderData.profile.fullName}!</h1>
      <Profile profile={loaderData.profile} />
    </div>
  );
}
```

--------------------------------

### Configure Nested Routes with Error Boundaries in React Router (Framework Mode)

Source: https://github.com/remix-run/react-router/blob/main/docs/how-to/error-boundary.md

This snippet demonstrates how to define nested routes in React Router's Framework Mode, explicitly marking which routes have associated error boundaries. This configuration dictates which boundary will catch errors based on their origin within the route hierarchy, ensuring granular error handling.

```tsx
// ✅ has error boundary
route("/app", "app.tsx", [
  // ❌ no error boundary
  route("invoices", "invoices.tsx", [
    // ✅ has error boundary
    route("invoices/:id", "invoice-page.tsx", [
      // ❌ no error boundary
      route("payments", "payments.tsx"),
    ]),
  ]),
]);
```

--------------------------------

### Implement Client Middleware for Browser-Side Navigation in TypeScript

Source: https://github.com/remix-run/react-router/blob/main/docs/how-to/middleware.md

Client middleware runs in the browser for client-side navigations and fetcher calls in both framework and data modes. Unlike server middleware, it doesn't have HTTP Request/Response objects and typically doesn't need to return a value. This example shows logging functionality and different export patterns for framework and data modes.

```typescript
async function clientMiddleware({ request }, next) {
  console.log(request.method, request.url);
  await next();
  console.log(response.status, request.method, request.url);
}

// Framework mode
export const clientMiddleware: Route.ClientMiddlewareFunction[] =
  [clientMiddleware];

// Or, Data mode
const route = {
  path: "/",
  middleware: [clientMiddleware],
  loader: rootLoader,
  Component: Root,
};
```

--------------------------------

### Migrate Global Providers and Styles to Root Component

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/router-provider.md

Demonstrates moving global imports, context providers, and layout components from App.tsx into the Root component in root.tsx. The diff format shows additions needed to integrate existing application infrastructure around the Outlet component for proper route rendering.

```tsx
+import "./index.css";

// ... other imports and Layout

export default function Root() {
  return (
+   <OtherProviders>
+     <AppLayout>
        <Outlet />
+     </AppLayout>
+   </OtherProviders>
  );
}
```

--------------------------------

### Implement Server Middleware for HTTP Request/Response Handling in TypeScript

Source: https://github.com/remix-run/react-router/blob/main/docs/how-to/middleware.md

Server middleware runs on the server in Framework mode for HTML Document requests and .data requests. It receives an HTTP Request object and returns an HTTP Response through the next function. This example demonstrates logging request and response details using the middleware chain.

```typescript
async function serverMiddleware({ request }, next) {
  console.log(request.method, request.url);
  let response = await next();
  console.log(response.status, request.method, request.url);
  return response;
}

// Framework mode only
export const middleware: Route.MiddlewareFunction[] = [
  serverMiddleware,
];
```

--------------------------------

### Migrate React Router Definitions to routes.ts (Diff)

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/router-provider.md

This diff shows how to refactor existing 'createBrowserRouter' definitions into an exported default array within 'src/routes.ts'. It introduces 'RouteConfig' for type safety and uses 'satisfies' to ensure compliance with the new schema.

```diff
+import type { RouteConfig } from "@react-router/dev/routes";

-const router = createBrowserRouter([
+export default [
  {
    path: "/",
    lazy: () => import("./routes/layout").then(convert),
    children: [
      {
        index: true,
        lazy: () => import("./routes/home").then(convert),
      },
      {
        path: "about",
        lazy: () => import("./routes/about").then(convert),
      },
      {
        path: "todos",
        lazy: () => import("./routes/todos").then(convert),
        children: [
          {
            path: ":id",
            lazy: () =>
              import("./routes/todo").then(convert),
          },
        ],
      },
    ],
  },
-]);
+] satisfies RouteConfig;
```

--------------------------------

### Define React Router Plugin Configuration Settings

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/router-provider.md

This TypeScript code defines the configuration for the React Router Vite plugin within `react-router.config.ts`. It specifies the `appDirectory` where your application's source code resides and explicitly disables `ssr` (server-side rendering) for the project.

```typescript
import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  ssr: false,
} satisfies Config;
```

--------------------------------

### Update Catchall Route to Render Main App

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/component-routes.md

Modifies the `src/catchall.tsx` component to import and render the main `App` component. This step integrates the existing application's structure into the new React Router setup, allowing the original app to display.

```tsx
import App from "./App";

export default function Component() {
  return <App />;
}
```

--------------------------------

### Define a Route Module in React Router

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/router-provider.md

This code snippet demonstrates how to define a route module by exporting route definition pieces like `clientLoader` and the default component as separate named exports. This structure facilitates lazy loading and adheres to the Route Module API, supporting features like automatic data revalidation.

```tsx
export async function clientLoader() {
  return {
    title: "About",
  };
}

export default function About() {
  let data = useLoaderData();
  return <div>{data.title}</div>;
}

// clientAction, ErrorBoundary, etc.
```

--------------------------------

### Configure Client Hydration Entry Point for React Router

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/router-provider.md

Migrated entry.client.tsx that replaces main.tsx, using ReactDOM.hydrateRoot for server rendering compatibility and HydratedRouter component instead of manual route configuration. This approach enables automatic route management and proper hydration of server-rendered content.

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

ReactDOM.hydrateRoot(
  document,
  <React.StrictMode>
    <HydratedRouter />
  </React.StrictMode>,
);
```

--------------------------------

### Configure Server-Side Rendering and Pre-rendering

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/component-routes.md

Sets up server-side rendering (SSR) and pre-rendering options in `react-router.config.ts`. The `ssr: true` flag enables SSR, and the `prerender` async function specifies a list of paths to pre-render during the build process, optimizing initial page load and SEO.

```ts
import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  async prerender() {
    return ["/", "/about", "/contact"];
  },
} satisfies Config;
```

--------------------------------

### Add Migrated Route Definition to routes.ts

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/component-routes.md

Extends the `routes.ts` configuration to include a new route, `/about`, which points to a separate route module (`./pages/about.tsx`). This demonstrates how to incrementally migrate routes from the main `App` component to the module-based routing system.

```tsx
import {
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  route("/about", "./pages/about.tsx"),
  route("*?", "catchall.tsx"),
] satisfies RouteConfig;
```

--------------------------------

### Create `react-router.config.ts`

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/component-routes.md

This step involves creating a `react-router.config.ts` file at the root of your project. This configuration file allows you to define project-specific settings for React Router, such as the `appDirectory` and whether Server-Side Rendering (SSR) is enabled.

```shellscript
touch react-router.config.ts
```

```typescript
import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  ssr: false,
} satisfies Config;
```

--------------------------------

### Create Type-Safe Context for Middleware (Framework/Data Mode)

Source: https://github.com/remix-run/react-router/blob/main/docs/how-to/middleware.md

This example demonstrates how to create a type-safe context object using `createContext` from `react-router`. This context is essential for providing and consuming data across the middleware chain, ensuring type safety for shared information like user data in both framework and data modes.

```ts
import { createContext } from "react-router";
import type { User } from "~/types";

export const userContext = createContext<User | null>(null);
```

--------------------------------

### Create Root Entry Point File in React Router Vite Application

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/router-provider.md

Shell command to create the root.tsx file which serves as the new entry point for React Router Vite applications, replacing the traditional index.html approach. This file enables React-based shell rendering and supports future server rendering upgrades.

```shellscript
touch src/root.tsx
```

--------------------------------

### Utilize Type-Safe Context API in React Router for Data Sharing (TypeScript)

Source: https://github.com/remix-run/react-router/blob/main/docs/how-to/middleware.md

This snippet illustrates the new type-safe Context API introduced in React Router's Framework Mode, which replaces the previous `AppLoadContext`. It demonstrates how to create a context using `createContext`, and then set and retrieve strongly-typed data using `context.set` and `context.get`, preventing naming conflicts and enhancing type safety compared to direct property assignment.

```ts
// ✅ Type-safe
import { createContext } from "react-router";
const userContext = createContext<User>();

// Later in middleware/`loader`s
context.set(userContext, user); // Must be `User` type
const user = context.get(userContext); // Returns `User` type

// ❌ Old way (no type safety)
context.user = user; // Could be anything
```

--------------------------------

### Replace lazy Loaders with file Loaders in routes.ts (Diff)

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/router-provider.md

This diff modifies the route definitions in 'src/routes.ts' to replace the 'lazy' property with the 'file' property. This change is specific to the React Router Vite plugin, which uses 'file' paths for route components instead of dynamic imports.

```diff
export default [
  {
    path: "/",
-   lazy: () => import("./routes/layout").then(convert),
+   file: "./routes/layout.tsx",
    children: [
      {
        index: true,
-       lazy: () => import("./routes/home").then(convert),
+       file: "./routes/home.tsx",
      },
      {
        path: "about",
-       lazy: () => import("./routes/about").then(convert),
+       file: "./routes/about.tsx",
      },
      {
        path: "todos",
-       lazy: () => import("./routes/todos").then(convert),
+       file: "./routes/todos.tsx",
        children: [
          {
            path: ":id",
-           lazy: () => import("./routes/todo").then(convert),
+           file: "./routes/todo.tsx",
          },
        ],
      },
    ],
  },
] satisfies RouteConfig;
```

--------------------------------

### Lazy Load and Convert Route Modules in React Router

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/router-provider.md

This code demonstrates how to update your `createBrowserRouter` configuration to lazy load route modules and apply a conversion function. This approach not only conforms to the Route Module API but also enables automatic code-splitting for improved application performance by reducing initial bundle size.

```tsx
let router = createBrowserRouter([
  // ... other routes
  {
    path: "about",
    lazy: () => import("./routes/about").then(convert),
  },
  // ... other routes
]);
```

--------------------------------

### Refactor Client Entry Point to `src/entry.client.tsx`

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/component-routes.md

This snippet illustrates how to modify the client-side entry point from `src/main.tsx` to `src/entry.client.tsx`. It demonstrates the change from `ReactDOM.createRoot` to `ReactDOM.hydrateRoot` and rendering `<HydratedRouter>` instead of the application's root component, preparing the app for React Router's hydration capabilities.

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App";

ReactDOM.createRoot(
  document.getElementById("root")!,
).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
```

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import "./index.css";

ReactDOM.hydrateRoot(
  document,
  <React.StrictMode>
    <HydratedRouter />
  </React.StrictMode>,
);
```

--------------------------------

### Create New Route Module with Data Loader

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/component-routes.md

Defines a new route module file (`src/pages/about.tsx`) that uses the React Router Route Module API. It includes an `async clientLoader` function for data fetching and a `Component` function to render the UI, demonstrating how to handle data and rendering within route modules.

```tsx
export async function clientLoader() {
  // you can now fetch data here
  return {
    title: "About page",
  };
}

export default function Component({ loaderData }) {
  return <h1>{loaderData.title}</h1>;
}
```

--------------------------------

### Implement Root Layout Component with React Router Components

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/router-provider.md

React-based root entry point that replaces index.html, providing a Layout component with React Router-specific components (Meta, Links, Scripts, ScrollRestoration) and a Root component with Outlet for rendering child routes. This structure enables server rendering capabilities and maintains the HTML shell using React components.

```tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

export function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>My App</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}
```

--------------------------------

### Install React Router Node Runtime Adapter

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/router-provider.md

This command installs the `@react-router/node` package, which serves as a runtime adapter for Node.js environments. This adapter is necessary if your project uses Node.js as its runtime, enabling server-side rendering and other Node-specific functionalities provided by React Router.

```shellscript
npm install @react-router/node
```

--------------------------------

### Install React Router Vite Plugin and Node.js Adapter

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/component-routes.md

This section provides commands to install the necessary development plugin `@react-router/dev` for Vite, and the `@react-router/node` runtime adapter for Node.js environments. These packages are essential for integrating React Router's enhanced features into a Vite project.

```shellscript
npm install -D @react-router/dev
```

```shellscript
npm install @react-router/node
```

--------------------------------

### Create a Route Module Conversion Function for React Router

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/router-provider.md

This TypeScript function converts the new route module format, which uses `clientLoader`, `clientAction`, and a `default` Component, into the format expected by React Router's data router. This helper allows for incremental migration of routes to the new module structure.

```tsx
function convert(m: any) {
  let {
    clientLoader,
    clientAction,
    default: Component,
    ...rest
  } = m;
  return {
    ...rest,
    loader: clientLoader,
    action: clientAction,
    Component,
  };
}
```

--------------------------------

### Configure React Router with Catchall Route

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/component-routes.md

Defines the initial route configuration in `src/routes.ts` using `@react-router/dev/routes`. It sets up a wildcard catchall route (`*?`) that matches all URLs, including the root path, directing them to the `catchall.tsx` component.

```ts
import {
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  // * matches all URLs, the ? makes it optional so it will match / as well
  route("*?", "catchall.tsx"),
] satisfies RouteConfig;
```

--------------------------------

### Initialize Client-Side Context in React Router (TypeScript)

Source: https://github.com/remix-run/react-router/blob/main/decisions/0014-context-middleware.md

Demonstrates how to create and initialize client-side context using `unstable_createContext` and `getContext` in React Router. This context can be provided to `createBrowserRouter` in library mode or `HydratedRouter` in framework mode to supply initial values for components.

```typescript
let loggerContext = unstable_createContext<(...args: unknown[]) => void>();

function getContext() {
  return new Map([[loggerContext, (...args) => console.log(...args)]])
}

// library mode
let router = createBrowserRouter(routes, { unstable_getContext: getContext })

// framework mode
return <HydratedRouter unstable_getContext={getContext}>
```

--------------------------------

### Create React Router Configuration File

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/router-provider.md

This command creates an empty `react-router.config.ts` file in the root of your project. This file is essential for configuring the React Router Vite plugin, allowing you to specify project-specific settings like the application directory and SSR preferences.

```shellscript
touch react-router.config.ts
```

--------------------------------

### Augment useNavigate Return Type for RouterProvider/Framework Mode (TypeScript)

Source: https://github.com/remix-run/react-router/blob/main/docs/api/hooks/useNavigate.md

This code snippet demonstrates augmenting the `NavigateFunction` interface for 'react-router' in applications using `<RouterProvider>` or Framework mode. It explicitly sets the return type of `useNavigate` to `Promise<void>`, which is necessary for handling asynchronous navigations and resolving errors related to floating promises.

```typescript
declare module "react-router" {
  interface NavigateFunction {
    (to: To, options?: NavigateOptions): Promise<void>;
    (delta: number): Promise<void>;
  }
}
```

--------------------------------

### Modify `getLoadContext` for RouterContextProvider in React Router (Framework Mode)

Source: https://github.com/remix-run/react-router/blob/main/docs/how-to/middleware.md

This example shows the required update for `getLoadContext` when using a custom server with React Router middleware. Instead of returning a plain JavaScript object, `getLoadContext` must now return an instance of `RouterContextProvider` to properly manage and provide context objects down the middleware chain, using `context.set`.

```ts
import {
  createContext,
  RouterContextProvider,
} from "react-router";
import { createDb } from "./db";

const dbContext = createContext<Database>();

function getLoadContext(req, res) {
  const context = new RouterContextProvider();
  context.set(dbContext, createDb());
  return context;
}
```

--------------------------------

### Hydrate React Router Application in Browser with SSR Data

Source: https://github.com/remix-run/react-router/blob/main/docs/start/data/custom.md

Initializes a client-side React Router by creating a browser router with hydration data from window.__staticRouterHydrationData. The router is then rendered using hydrateRoot to attach React to server-rendered HTML, enabling seamless client-side transitions after SSR. This approach ensures the client-side application picks up where the server left off without re-rendering.

```tsx
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import routes from "./app/routes.js";
import { createBrowserRouter } from "react-router";

let router = createBrowserRouter(routes, {
  hydrationData: window.__staticRouterHydrationData,
});

hydrateRoot(
  document,
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
```

--------------------------------

### React Router: Return React Elements from Loader (Server)

Source: https://github.com/remix-run/react-router/blob/main/docs/how-to/react-server-components.md

Demonstrates how an asynchronous loader function in React Router's RSC Framework Mode can return both data and a React element. This element will be rendered exclusively on the server.

```tsx
import type { Route } from "./+types/route";

export async function loader() {
  return {
    message: "Message from the server!",
    element: <p>Element from the server!</p>,
  };
}

export default function Route({
  loaderData,
}: Route.ComponentProps) {
  return (
    <>
      <h1>{loaderData.message}</h1>
      {loaderData.element}
    </>
  );
}
```

--------------------------------

### Vite Configuration: Deny Client Imports of Server Modules

Source: https://github.com/remix-run/react-router/blob/main/docs/how-to/react-server-components.md

Provides a Vite configuration example using the `vite-env-only` plugin. This setup denies client builds from importing files adhering to `.server` naming conventions, assisting in migrating existing code to RSC Framework Mode without built-in `.server`/`.client` module support.

```tsx
import { defineConfig } from "vite";
import { denyImports } from "vite-env-only";
import { unstable_reactRouterRSC as reactRouterRSC } from "@react-router/dev/vite";
import rsc from "@vitejs/plugin-rsc";

export default defineConfig({
  plugins: [
    denyImports({
      client: { files: ["**/.server/*", "**/*.server.*"] },
    }),
    reactRouterRSC(),
    rsc(),
  ],
});
```

--------------------------------

### Migrate HTML Entry Point to `src/root.tsx`

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/component-routes.md

This snippet demonstrates the process of transforming a static `index.html` file into a dynamic `src/root.tsx` component. The `root.tsx` file serves as the new entry point, allowing React to render the application's shell and enabling features like `Links`, `Meta`, `Scripts`, and `ScrollRestoration` provided by React Router.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>My App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

```shellscript
touch src/root.tsx
```

```typescript
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

export function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>My App</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}
```

--------------------------------

### Control route revalidation with `shouldRevalidate()` in React Router

Source: https://github.com/remix-run/react-router/blob/main/docs/start/framework/route-module.md

The `shouldRevalidate` function allows developers to opt out of automatic revalidation for a route loader after navigations and form submissions in framework mode. It receives arguments about the revalidation event (`ShouldRevalidateFunctionArgs`) and returns a boolean indicating whether revalidation should occur.

```tsx
import type { ShouldRevalidateFunctionArgs } from "react-router";

export function shouldRevalidate(
  arg: ShouldRevalidateFunctionArgs,
) {
  return true;
}
```

--------------------------------

### Configure RSC Routes with Lazy Loading for Code Organization

Source: https://github.com/remix-run/react-router/blob/main/docs/how-to/react-server-components.md

Illustrates configuring React Server Component (RSC) routes using a dedicated `routes()` function in `app/routes.ts`. It utilizes `lazy()` to dynamically import route modules, enhancing startup performance and code organization by unifying the API with Framework Mode's route module exports.

```tsx
import type { unstable_RSCRouteConfig as RSCRouteConfig } from "react-router";

export function routes() {
  return [
    {
      id: "root",
      path: "",
      lazy: () => import("./root/route"),
      children: [
        {
          id: "home",
          index: true,
          lazy: () => import("./home/route"),
        },
        {
          id: "about",
          path: "about",
          lazy: () => import("./about/route"),
        },
      ],
    },
  ] satisfies RSCRouteConfig;
}
```

--------------------------------

### Implement Server-Side Request Logging Middleware in React Router (TypeScript)

Source: https://github.com/remix-run/react-router/blob/main/docs/how-to/middleware.md

This middleware demonstrates how to log incoming requests and outgoing responses on the server within React Router's Framework Mode. It is crucial to note that this middleware will only run on client-side navigations if a `.data` request is made to the server, making it useful for monitoring server-side activity tied to data fetching.

```tsx
// This middleware won't run on client-side navigations without a `.data` request
async function loggingMiddleware({ request }, next) {
  console.log(`Request: ${request.method} ${request.url}`);
  let response = await next();
  console.log(
    `Response: ${response.status} ${request.method} ${request.url}`,
  );
  return response;
}

export const middleware: Route.MiddlewareFunction[] = [
  loggingMiddleware,
]
```

--------------------------------

### Implement Root Error Boundary in React Router

Source: https://github.com/remix-run/react-router/blob/main/docs/how-to/error-boundary.md

This snippet demonstrates how to set up a root error boundary in React Router to catch and display various error types. It includes examples for both Framework Mode, where errors are passed as props, and Data Mode, which uses the `useRouteError` hook.

```tsx
import { Route } from "./+types/root";

export function ErrorBoundary({
  error,
}: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
```

```tsx
import { useRouteError } from "react-router";

let router = createBrowserRouter([
  {
    path: "/",
    ErrorBoundary: RootErrorBoundary,
    Component: Root,
  },
]);

function Root() {
  /* ... */
}

function RootErrorBoundary() {
  let error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
```

--------------------------------

### Composing Multiple Instrumentations

Source: https://github.com/remix-run/react-router/blob/main/docs/how-to/instrumentation.md

Shows how to combine several instrumentations by providing them as an array. This creates a nested execution chain where each instrumentation wraps the previous one, allowing for layered functionality.

```tsx
export const unstable_instrumentations = [
  loggingInstrumentation,
  performanceInstrumentation,
  errorReportingInstrumentation,
];
```

--------------------------------

### Instrument Client-Side Router Operations in React Router

Source: https://github.com/remix-run/react-router/blob/main/docs/how-to/instrumentation.md

This example demonstrates how to apply `unstable_instrumentations` to client-side router operations. It specifically shows how to instrument `navigate` and `fetch` calls, allowing developers to observe when these actions occur. The snippet also shows how to apply these instrumentations in both Framework Mode (using `HydratedRouter`) and Data Mode (using `createBrowserRouter`) contexts.

```tsx
export const unstable_instrumentations = [
  {
    router(router) {
      router.instrument({
        async navigate(callNavigate, { to, currentUrl }) {
          // Runs around navigation operations
          await callNavigate();
        },
        async fetch(
          callFetch,
          { href, currentUrl, fetcherKey },
        ) {
          // Runs around fetcher operations
          await callFetch();
        },
      });
    },
  },
];

// Framework Mode (entry.client.tsx)
<HydratedRouter
  unstable_instrumentations={unstable_instrumentations}
/>;

// Data Mode
const router = createBrowserRouter(routes, {
  unstable_instrumentations,
});
```

--------------------------------

### Enable v7_partialHydration Flag in React Router

Source: https://github.com/remix-run/react-router/blob/main/docs/upgrading/v6.md

This code snippet demonstrates how to enable the `v7_partialHydration` future flag in React Router's `createBrowserRouter` configuration. This flag enables partial hydration, useful for SSR frameworks and `lazy` route modules, and is only relevant when using a `<RouterProvider>`.

```tsx
createBrowserRouter(routes, {
  future: {
    v7_partialHydration: true,
  },
});
```

--------------------------------

### Composing Multiple Instrumentations

Source: https://github.com/remix-run/react-router/blob/main/decisions/0015-observability.md

Demonstrates how to combine multiple independent instrumentation functions into a single array to be passed to `createBrowserRouter`. This allows for modularity and easy integration of various monitoring tools.

```typescript
let router = createBrowserRouter(routes, {
  instrumentations: [logNavigations, addWindowPerfTraces, addSentryPerfTraces],
});
```

--------------------------------

### Establish Server-Only Database Connection (TypeScript)

Source: https://github.com/remix-run/react-router/blob/main/docs/api/framework-conventions/server-modules.md

This TypeScript code showcases establishing a database connection using Prisma Client within a `.server.ts` file. By keeping the database instance in a server-only module, sensitive credentials and direct database access are prevented from being exposed on the client.

```ts
import { PrismaClient } from "@prisma/client";

// This would expose database credentials on the client
const db = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export { db };
```

--------------------------------

### DataStrategy Example: Middleware Pattern

Source: https://github.com/remix-run/react-router/blob/main/docs/api/data-routers/createBrowserRouter.md

Advanced example showing how to implement a middleware pattern using dataStrategy. This implementation runs middleware sequentially to build a context object, then executes loaders in parallel with access to the accumulated context data.

```APIDOC
## DataStrategy Example: Middleware Implementation

### Description
Implements a middleware pattern where each route can define middleware functions via the `handle` property. Middleware runs sequentially to build a shared context, then loaders execute in parallel with access to that context.

### Use Case
- Sequential data preparation before loader execution
- Sharing data between parent and child routes
- Authentication and authorization checks
- Context accumulation across route hierarchy

### Route Configuration
```typescript
const routes = [
  {
    id: "parent",
    path: "/parent",
    loader({ request }, context) {
       // Access context.parent set by middleware
    },
    handle: {
      async middleware({ request }, context) {
        context.parent = "PARENT MIDDLEWARE";
      },
    },
    children: [
      {
        id: "child",
        path: "child",
        loader({ request }, context) {
          // Access both context.parent and context.child
        },
        handle: {
          async middleware({ request }, context) {
            context.child = "CHILD MIDDLEWARE";
          },
        },
      },
    ],
  },
];
```

### DataStrategy Implementation
```typescript
let router = createBrowserRouter(routes, {
  async dataStrategy({ matches, params, request }) {
    // Run middleware sequentially and let them add data to `context`
    let context = {};
    for (const match of matches) {
      if (match.route.handle?.middleware) {
        await match.route.handle.middleware(
          { request, params },
          context
        );
      }
    }

    // Run loaders in parallel with the `context` value
    let matchesToLoad = matches.filter((m) => m.shouldLoad);
    let results = await Promise.all(
      matchesToLoad.map((match, i) =>
        match.resolve((handler) => {
          // Whatever you pass to `handler` will be passed as the 2nd parameter
          // to your loader/action
          return handler(context);
        })
      )
    );
    return results.reduce(
      (acc, result, i) =>
        Object.assign(acc, {
          [matchesToLoad[i].route.id]: result,
        }),
      {}
    );
  },
});
```

### Implementation Details
#### Phase 1: Sequential Middleware Execution
- Creates empty context object
- Iterates through matches in order
- Executes middleware if defined in `route.handle.middleware`
- Each middleware can add properties to the shared context

#### Phase 2: Parallel Loader Execution
- Filters matches to only those requiring data loading
- Executes all loaders in parallel using `Promise.all`
- Passes accumulated context as second parameter to loaders
- Collects results and maps them by route ID

### Loader Signature with Context
```typescript
loader({ request, params }, context) {
  // context contains data from all parent middleware
  // request and params from the navigation
}
```

### Key Features
- Sequential middleware execution preserves order
- Context accumulates data through route hierarchy
- Loaders execute in parallel for performance
- Custom data passing via `match.resolve()` callback
- Type-safe context sharing between routes

### Pattern Benefits
- Separation of concerns (middleware vs data loading)
- Reusable middleware functions
- Parent-to-child context inheritance
- Maintains parallel loader performance
- Flexible context structure
```

--------------------------------

### Implement Client and Server Loaders to Bypass Server Hops (TypeScript)

Source: https://github.com/remix-run/react-router/blob/main/docs/how-to/client-data.md

This snippet illustrates how to optimize data loading in a Backend-For-Frontend (BFF) architecture. An initial server `loader` fetches data on document load, while a `clientLoader` handles subsequent navigations directly from the client, bypassing the server for efficiency. This approach requires proper authentication and assumes no CORS restrictions.

```tsx
export async function loader({
  request,
}: Route.LoaderArgs) {
  const data = await fetchApiFromServer({ request }); // (1)
  return data;
}

export async function clientLoader({
  request,
}: Route.ClientLoaderArgs) {
  const data = await fetchApiFromClient({ request }); // (2)
  return data;
}
```

--------------------------------

### Define Client Middleware for Client Loaders/Actions (TypeScript)

Source: https://github.com/remix-run/react-router/blob/main/decisions/0014-context-middleware.md

Shows how to create a client-side middleware function, `unstable_ClientMiddlewareFunction`, that runs before or after `clientLoader` and `clientAction`. This middleware is exported as an array `clientMiddleware` to be applied client-side, enabling pre/post-logic around client-side data operations.

```typescript
const myClientMiddleware: Route.unstable_ClientMiddlewareFunction = (
  { context },
  next,
) => {
  //...
};

export const clientMiddleware = [myClientSideMiddleware];
```

--------------------------------

### Illustrate Client-Side Import of Server-Only Module in Remix (React/TypeScript)

Source: https://github.com/remix-run/react-router/blob/main/decisions/0010-splitting-up-client-and-server-code-in-vite.md

This React component, written in TSX, demonstrates a scenario where a client-side route inadvertently imports and uses a function (`getFortune`) from a server-only module (`~/db.server.ts`). Although the code passes type-checking and builds successfully, it results in a runtime error on the client because the server-only module's content is stripped out, making the imported function unavailable.

```tsx
import { getFortune } from "~/db.server.ts";

export default function Route() {
  const [fortune, setFortune] = useState(null);
  return (
    <>
      {user ? (
        <h1>Your fortune of the day: {fortune}</h1>
      ) : (
        <button onClick={() => setFortune(getFortune())}>
          Open fortune cookie 🥠
        </button>
      )}
    </>
  );
}
```