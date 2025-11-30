import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // English routes (default)
  index("routes/home.tsx"),
  route("services/:service", "routes/services.tsx"),
  
  // Polish routes
  route("pl", "routes/home.tsx", { id: "pl-home" }),
  route("pl/services/:service", "routes/services.tsx", { id: "pl-services" }),
  
  // Handle .well-known requests (Chrome DevTools, etc.)
  route(".well-known/*", "routes/.well-known.tsx"),
] satisfies RouteConfig;
