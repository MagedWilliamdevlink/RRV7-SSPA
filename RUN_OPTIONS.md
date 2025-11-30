# 🎯 How to Run the Project

Multiple ways to start the RRV7 + Single-SPA microfrontend project.

## 🚀 Quick Start (Recommended)

### From Root Directory

```bash
# Start everything at once
npm run dev:all
```

### From RRV7 Directory

```bash
cd RRV7
npm run dev:all
```

Both commands start:
- ✅ Config Server (port 9000)
- ✅ RRV7 Shell (port 5173)
- ✅ All enabled services (ports 8081+)

Then open: **http://localhost:5173**

---

## 📂 From Root Directory

### All-in-One

```bash
npm run dev:all
```

### Individual Components

```bash
# Terminal 1: Config server
npm run dev:config

# Terminal 2: Shell
npm run dev:shell

# Terminal 3: All services
npm run dev:services
```

### Specific Services

```bash
# Start individual services
npm run dev:serviceA    # Port 8081
npm run dev:serviceB    # Port 8082
npm run dev:serviceD    # Port 8083
npm run dev:serviceE    # Port 8084
```

---

## 📁 From RRV7 Directory

```bash
cd RRV7
```

### All-in-One

```bash
npm run dev:all
```

### Individual Components

```bash
# Terminal 1: Config server
npm run config

# Terminal 2: Shell
npm run dev

# Terminal 3: All services
npm run services
```

---

## 🎛️ Comparison

| Location | Command | What It Starts |
|----------|---------|----------------|
| **Root** | `npm run dev:all` | Config + Shell + All Services |
| **RRV7** | `npm run dev:all` | Config + Shell + All Services |
| **Root** | `npm run dev:shell` | Shell only |
| **RRV7** | `npm run dev` | Shell only |
| **Root** | `npm run dev:services` | All enabled services |
| **RRV7** | `npm run services` | All enabled services |
| **Root** | `npm run dev:config` | Config server only |
| **RRV7** | `npm run config` | Config server only |

---

## 🔧 Development Workflows

### Full Stack Development

```bash
# From anywhere
npm run dev:all
```

### Shell Development Only

```bash
# Terminal 1: Config server
npm run dev:config

# Terminal 2: Shell with hot reload
cd RRV7
npm run dev
```

### Service Development Only

```bash
# Terminal 1: Config server
npm run dev:config

# Terminal 2: Specific service
cd services/my-service
npm start
```

### Multi-Service Development

```bash
# Terminal 1: Config server
npm run dev:config

# Terminal 2: All services
npm run dev:services
```

---

## 🎨 Colored Output

When using `dev:all` or `dev:services`, each component has colored output:

- 🔵 **Config** - Blue
- 🔷 **Shell** - Cyan
- 🟢 **Services** - Green (with individual service colors)

Example:
```
[Config] 🚀 Config server running on http://localhost:9000
[Shell] ➜  Local:   http://localhost:5173/
[serviceA] webpack 5.103.0 compiled successfully
[serviceB] webpack 5.103.0 compiled successfully
```

---

## 🛑 Stopping Services

### All-in-One Mode

Press `Ctrl+C` once - stops everything gracefully

### Individual Terminals

Press `Ctrl+C` in each terminal

---

## 💡 Tips

1. **Use `dev:all` for quick testing** - Everything starts with one command
2. **Use individual terminals for debugging** - Easier to see specific logs
3. **From RRV7 directory** - Shorter commands, same functionality
4. **Check running services** - `npm run service:list`

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Services Not Starting

```bash
# Check enabled services
npm run service:list

# Verify import map
cat config-server/import-map.json
```

### Config Server Not Found

```bash
# Make sure you're in the right directory
pwd  # Should show .../RR7-SSPA

# Or use absolute paths
cd /path/to/RR7-SSPA
npm run dev:all
```

---

## 📚 Related Documentation

- [README.md](README.md) - Project overview
- [NPM_SCRIPTS.md](NPM_SCRIPTS.md) - Complete script reference
- [DYNAMIC_SERVICES.md](DYNAMIC_SERVICES.md) - Service discovery details
- [SERVICE_MANAGER.md](SERVICE_MANAGER.md) - Service management