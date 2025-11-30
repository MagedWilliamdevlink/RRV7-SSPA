# 📦 NPM Scripts Guide

Complete guide to all available npm scripts in the RRV7 + Single-SPA monorepo.

## 🚀 Development Scripts

### Start Everything

**From Root Directory:**
```bash
# Start config server, shell, and all services
npm run dev:all
```

**From RRV7 Directory:**
```bash
cd RRV7
npm run dev:all
```

This starts:
- Config Server (port 9000)
- RRV7 Shell (port 5173)
- All enabled services from import-map.json (ports 8081+)

### Start Shell Only

```bash
# Start only the RRV7 shell application
npm run dev:shell
```

Starts the React Router v7 shell on http://localhost:5173

### Start All Services

```bash
# Start all microfrontend services
npm run dev:services
```

Starts all services in the `services/` folder concurrently.

### Start Individual Services

```bash
# Start specific services
npm run dev:serviceA    # Port 8081
npm run dev:serviceB    # Port 8082
npm run dev:serviceD    # Port 8083
npm run dev:serviceE    # Port 8084
```

### Start Config Server

```bash
# Start the configuration server
npm run dev:config
# or
npm run config-server
```

Starts the config server on http://localhost:9000

## 🏗️ Build Scripts

### Build Everything

```bash
# Build shell and all services
npm run build
```

### Build Shell Only

```bash
# Build only the RRV7 shell
npm run build:rrv7
```

### Build All Services

```bash
# Build all microfrontend services
npm run build:services
```

## 🛠️ Service Management Scripts

### Create New Service

```bash
# Create a new microfrontend service
npm run service:create my-new-service
# or
npm run service create my-new-service
```

### List All Services

```bash
# Show all registered services
npm run service:list
```

### Service Manager Help

```bash
# Show service manager help
npm run service:help
```

### General Service Command

```bash
# Run any service manager command
npm run service <command> [options]
```

## 📦 Installation Scripts

### Install All Dependencies

```bash
# Install dependencies for root, shell, and config server
npm run install:all
```

## 🎯 Common Workflows

### 1. First Time Setup

```bash
# Install all dependencies
npm run install:all

# Install service dependencies
cd services/serviceA && npm install
cd ../serviceB && npm install
cd ../serviceD && npm install
cd ../service-e && npm install
cd ../..
```

### 2. Daily Development

```bash
# Start everything at once
npm run dev:all
```

Then open http://localhost:5173

### 3. Working on Shell Only

```bash
# Terminal 1: Config server
npm run dev:config

# Terminal 2: Shell
npm run dev:shell
```

### 4. Working on Services Only

```bash
# Terminal 1: Config server
npm run dev:config

# Terminal 2: All services
npm run dev:services
```

### 5. Working on Specific Service

```bash
# Terminal 1: Config server
npm run dev:config

# Terminal 2: Shell
npm run dev:shell

# Terminal 3: Specific service
npm run dev:serviceA
```

### 6. Create and Test New Service

```bash
# Create service
npm run service:create user-dashboard

# Install dependencies
cd services/user-dashboard
npm install

# Start it (in new terminal)
npm start

# Restart config server to reload import map
npm run dev:config
```

## 📊 Script Overview Table

### Root Directory Scripts

| Script | Description | Ports |
|--------|-------------|-------|
| `dev:all` | Start everything | 9000, 5173, 8081+ |
| `dev:shell` | Start shell only | 5173 |
| `dev:services` | Start all enabled services | 8081+ |
| `dev:config` | Start config server | 9000 |
| `dev:serviceA` | Start serviceA | 8081 |
| `dev:serviceB` | Start serviceB | 8082 |
| `dev:serviceD` | Start serviceD | 8083 |
| `dev:serviceE` | Start service-e | 8084 |
| `build` | Build everything | - |
| `build:rrv7` | Build shell | - |
| `build:services` | Build all services | - |
| `service:create` | Create new service | - |
| `service:list` | List all services | - |
| `service:help` | Service manager help | - |
| `install:all` | Install dependencies | - |

### RRV7 Directory Scripts

| Script | Description | Ports |
|--------|-------------|-------|
| `dev:all` | Start config + shell + services | 9000, 5173, 8081+ |
| `dev` | Start shell only | 5173 |
| `services` | Start all enabled services | 8081+ |
| `config` | Start config server | 9000 |
| `build` | Build shell | - |
| `start` | Start production server | 3000 |
| `typecheck` | Run TypeScript checks | - |

## 🔧 Customization

### Adding a New Service to Scripts

After creating a service with the service manager, add it to `package.json`:

```json
{
  "scripts": {
    "dev:myservice": "cd services/myservice && npm start",
    "dev:services": "concurrently ... \"npm run dev:myservice\"",
    "dev:all": "concurrently ... \"npm run dev:myservice\""
  }
}
```

### Removing a Service from Scripts

After removing a service, update `package.json` to remove its scripts.

## 💡 Tips

1. **Use `dev:all` for full-stack development** - Everything runs in one terminal
2. **Use individual scripts for focused work** - Faster startup, less noise
3. **Always restart config server** after creating/modifying services
4. **Check service status** with `npm run service:list`
5. **Use concurrently colors** to identify which service is logging

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find and kill process on port
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Service Not Loading

1. Check if config server is running: http://localhost:9000/import-map.json
2. Check if service is in import map: `npm run service:list`
3. Check if service is running on its port
4. Restart config server: `npm run dev:config`

### Build Errors

```bash
# Clean and rebuild
cd RRV7
rm -rf build node_modules
npm install
npm run build
```