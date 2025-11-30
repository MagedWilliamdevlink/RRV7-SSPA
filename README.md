# 🚀 React Router v7 + Single-SPA Microfrontends

A **fully dynamic microfrontend architecture** where services can be added or removed without rebuilding the shell application.


## Quick start

1. Install all dependancies
```bash
npm run install:all
```

2. Create some services using the service manager:
```bash
node service_manager.js create serviceA
```

```bash
node service_manager.js create serviceB
```

3. Run the static server in an new terminal
```bash
npm run dev:config
```

4. Run the Shell in an new terminal
```bash
npm run dev:shell
```

5. Run all the services in an new terminal
```bash
npm run dev:services
```

6. add a new service and reload the shell
```bash
node service_manager.js create serviceC
```

## 📁 Project Structure

```
RR7-SSPA/
├── RRV7/                      # React Router v7 Shell (port 5173)
├── config-server/             # Configuration server (port 9000)
├── services/                  # All microfrontend services
│   ├── service-a/             # Service A (port 8081)
│   ├── service-b/             # Service B (port 8082)
│   ├── service-d/             # Service D (port 8083)
│   └── service-e/             # Service E (port 8084)
├── serviceBlueprint/          # Template for new services
├── service_manager.js         # CLI tool for managing services
└── package.json               # Root package with npm scripts
```

## ✨ Features

- **React Router v7** with SSR (Server-Side Rendering)
- **i18n Support**: English (default) and Polish
- **Single-SPA Integration**: Dynamic microfrontend loading
- **Zero Rebuild**: Add services without rebuilding the shell
- **Service Manager CLI**: Create, list, enable, disable, and remove services
- **Centralized Config**: External configuration server
- **Auto Port Assignment**: Services get ports automatically
- **Dynamic Service Discovery**: Home page lists all available services

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Start Everything

**Option A: From Root Directory**
```bash
# Start config server, shell, and all services
npm run dev:all
```

**Option B: From RRV7 Directory**
```bash
cd RRV7
npm run dev:all
```

Then open http://localhost:5173

### 3. Or Start Components Individually

**From Root:**
```bash
# Terminal 1: Config server
npm run dev:config

# Terminal 2: Shell
npm run dev:shell

# Terminal 3: All services
npm run dev:services
```

**From RRV7:**
```bash
# Terminal 1: Config server
npm run config

# Terminal 2: Shell
npm run dev

# Terminal 3: All services
npm run services
```

## 📦 Service Management

### Create New Service

```bash
npm run service:create user-dashboard
# or
node service_manager.js create user-dashboard
```

This will:
1. Copy the service blueprint
2. Replace all references with your service name
3. Assign next available port
4. Update import-map.json
5. Install dependencies

### List All Services

```bash
npm run service:list
```

Output:
```
📋 Microfrontend Services:
══════════════════════════════════════════════════

1. serviceA
   Name: @rrv7/serviceA
   Route: /services/serviceA
   URL: http://localhost:8081/rrv7-serviceA.js
   Files: ✅ Present
```

### Other Commands

```bash
# Disable service (keep files)
node service_manager.js disable my-service

# Enable disabled service
node service_manager.js enable my-service

# Remove service completely
node service_manager.js remove my-service

# Show help
node service_manager.js help
```

## 📚 Documentation

- [RUN_OPTIONS.md](RUN_OPTIONS.md) - **All ways to run the project**
- [SERVICE_MANAGER.md](SERVICE_MANAGER.md) - Complete service manager documentation
- [NPM_SCRIPTS.md](NPM_SCRIPTS.md) - All available npm scripts
- [DYNAMIC_SERVICES.md](DYNAMIC_SERVICES.md) - Dynamic service discovery
- [QUICK_START.md](QUICK_START.md) - Quick reference guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture overview

## 🛠️ Available NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev:all` | Start everything (config + shell + all services) |
| `npm run dev:shell` | Start only the RRV7 shell |
| `npm run dev:services` | Start all microfrontend services |
| `npm run dev:config` | Start configuration server |
| `npm run service:create` | Create new service |
| `npm run service:list` | List all services |
| `npm run service:refresh` | Sync package.json scripts |
| `npm run build` | Build everything |

See [NPM_SCRIPTS.md](NPM_SCRIPTS.md) for complete list.

## 🏗️ How It Works

1. **Config Server** (port 9000) serves `import-map.json` with service definitions
2. **RRV7 Shell** (port 5173) fetches config and registers services with Single-SPA
3. **Services** (ports 8081+) are independent React apps loaded dynamically
4. **No Rebuild** needed when adding/removing services - just update JSON and refresh

## 🎯 Development Workflow

### Adding a New Service

```bash
# 1. Create service
npm run service:create payment-gateway

# 2. Start it
cd services/payment-gateway
npm start

# 3. Restart config server
npm run dev:config

# 4. Refresh browser - service appears automatically!
```

### Working on Existing Service

```bash
# Start config server and shell
npm run dev:config
npm run dev:shell

# In another terminal, start your service
cd services/my-service
npm start
```

## 🌐 URLs

- **Shell**: http://localhost:5173
- **Config Server**: http://localhost:9000
- **Import Map**: http://localhost:9000/import-map.json
- **ServiceA**: http://localhost:8081
- **ServiceB**: http://localhost:8082

## 🔧 Technology Stack

- **React Router v7** - Shell routing with SSR
- **Single-SPA** - Microfrontend orchestration
- **SystemJS** - Dynamic module loading
- **React 18** - Shared framework (via CDN)
- **Webpack** - Microfrontend bundling
- **Express** - Configuration server
- **Node.js** - Service manager CLI

## 📝 Service Name Rules

- Must be lowercase
- No spaces allowed
- Only letters, numbers, hyphens, and underscores
- 2-50 characters long
- Examples: `user-auth`, `shopping-cart`, `payment_gateway`

## 🐛 Troubleshooting

### Service Not Loading

1. Check if config server is running: http://localhost:9000/import-map.json
2. Check if service is in import map: `npm run service:list`
3. Check if service is running on its port
4. Restart config server

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

## 📄 License

MIT

## 🤝 Contributing

1. Create a new service using the service manager
2. Test it thoroughly
3. Update documentation if needed
4. Submit a pull request

---

Built with ❤️ using React Router v7 and Single-SPA