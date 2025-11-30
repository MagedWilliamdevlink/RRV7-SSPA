# Architecture Overview

## Dynamic Microfrontend System

This project implements a **fully dynamic microfrontend architecture** where services can be added or removed without rebuilding the shell application.

## Key Components

### 1. Configuration File (`RRV7/public/microfrontends.json`)

The central configuration file that defines:
- **Shared dependencies** (React, ReactDOM)
- **Microfrontend registry** (name, URL, route)

```json
{
  "imports": {
    "react": "CDN_URL",
    "react-dom": "CDN_URL"
  },
  "microfrontends": [
    {
      "name": "@rrv7/serviceA",
      "url": "http://localhost:8081/rrv7-serviceA.js",
      "route": "/services/serviceA"
    }
  ]
}
```

### 2. Dynamic Import Map Loading (`RRV7/app/root.tsx`)

On page load:
1. Fetches `microfrontends.json`
2. Builds SystemJS import map dynamically
3. Injects it into the page
4. Stores config in `window.__MICROFRONTENDS_CONFIG__`
5. Dispatches `importmap-loaded` event

### 3. Single-SPA Initialization (`RRV7/app/single-spa-init.ts`)

Waits for:
- SystemJS to load
- Configuration to be available

Then:
- Reads all microfrontends from config
- Registers each one with Single-SPA
- Sets up history interception for React Router integration

### 4. Wildcard Route (`RRV7/app/routes/services.tsx`)

- Route pattern: `/services/:service`
- Accepts any service ID
- Single-SPA handles mounting/unmounting based on URL

### 5. History Integration

Intercepts `history.pushState` and `history.replaceState` to:
- Notify Single-SPA of React Router navigation
- Ensure microfrontends mount/unmount correctly

## Flow Diagram

```
Browser Load
    ↓
Load SystemJS
    ↓
Fetch microfrontends.json
    ↓
Build Import Map
    ↓
Dispatch 'importmap-loaded'
    ↓
Initialize Single-SPA
    ↓
Register All Microfrontends
    ↓
Start Single-SPA
    ↓
Ready for Navigation
```

## Benefits

✅ **Zero Rebuild** - Add services by editing JSON
✅ **Runtime Configuration** - No compile-time dependencies
✅ **Scalable** - Support unlimited microfrontends
✅ **Flexible** - Change URLs, routes, or services on the fly
✅ **Independent Deployment** - Each service deploys separately
✅ **Shared Dependencies** - React loaded once via CDN

## Adding a New Service

1. Create the microfrontend
2. Start it on a port
3. Add entry to `microfrontends.json`
4. Refresh browser

That's it! No rebuild, no redeploy of the shell.

## Technology Stack

- **React Router v7** - Shell routing with SSR
- **Single-SPA** - Microfrontend orchestration
- **SystemJS** - Dynamic module loading
- **React 18** - Shared framework (via CDN)
- **Webpack** - Microfrontend bundling
