# 🔄 Dynamic Service Discovery

The project now includes **automatic service discovery** - no need to manually update scripts when adding or removing services!

## How It Works

The `RRV7/scripts/start-all-services.js` script:
1. **Reads `config-server/import-map.json`** to get enabled services
2. Verifies each service exists in the `services/` directory
3. Starts only **enabled** services with `npm start`
4. Displays colored output for each service
5. Handles graceful shutdown
6. Falls back to directory scan if import map is unavailable

### Smart Service Discovery

- ✅ **Import Map First**: Only starts services listed in import-map.json
- ✅ **Filesystem Verification**: Checks if service folders actually exist
- ✅ **Fallback Mode**: Scans directory if import map is missing
- ✅ **Warning System**: Alerts if services are in import map but missing files

## Usage

### From Root Directory

```bash
# Start all services automatically
npm run dev:services
```

### From RRV7 Directory

```bash
cd RRV7
npm run services
```

### Start Everything

```bash
# Config server + Shell + All services (auto-discovered)
npm run dev:all
```

## Benefits

✅ **No manual updates** - Add/remove services without touching package.json
✅ **Automatic discovery** - Finds all services in the services/ folder
✅ **Colored output** - Each service has its own color for easy identification
✅ **Graceful shutdown** - Ctrl+C stops all services cleanly
✅ **Scalable** - Works with any number of services

## Integration with Service Manager

The dynamic service script integrates seamlessly with the service manager:

### Adding a New Service

```bash
# 1. Create service (automatically adds to import-map.json)
npm run service:create my-new-service

# 2. Install dependencies
cd services/my-new-service
npm install

# 3. Start all services (including the new one!)
cd ../..
npm run dev:services
```

The new service is **automatically discovered** from import-map.json and started!

### Disabling a Service

```bash
# Disable service (removes from import-map.json)
node service_manager.js disable my-service

# Restart services - disabled service won't start
npm run dev:services
```

### Enabling a Service

```bash
# Enable service (adds back to import-map.json)
node service_manager.js enable my-service

# Restart services - service will now start
npm run dev:services
```

### Removing a Service

```bash
# Remove service completely
node service_manager.js remove my-service

# Service is removed from import map and filesystem
npm run dev:services
```

## Output Example

### Normal Operation
```
🔍 Reading enabled services from import-map.json...

✅ Found 4 enabled service(s): serviceA, serviceB, serviceD, service-e
🚀 Starting all services...

[serviceA] Starting on /path/to/services/serviceA
[serviceB] Starting on /path/to/services/serviceB
[serviceD] Starting on /path/to/services/serviceD
[service-e] Starting on /path/to/services/service-e

[serviceA] webpack 5.103.0 compiled successfully
[serviceB] webpack 5.103.0 compiled successfully
[serviceD] webpack 5.103.0 compiled successfully
[service-e] webpack 5.103.0 compiled successfully
```

### With Missing Service
```
🔍 Reading enabled services from import-map.json...

⚠️  Warning: 1 service(s) in import map but not found in filesystem: my-missing-service

✅ Found 3 enabled service(s): serviceA, serviceB, serviceD
🚀 Starting all services...
```

### Fallback Mode
```
🔍 Reading enabled services from import-map.json...

⚠️  Import map not found at: /path/to/config-server/import-map.json
Falling back to directory scan...

✅ Found 4 enabled service(s): serviceA, serviceB, serviceD, service-e
🚀 Starting all services...
```

## Individual Service Scripts (Still Available)

If you need to start specific services:

```bash
npm run dev:serviceA    # Start only serviceA
npm run dev:serviceB    # Start only serviceB
npm run dev:serviceD    # Start only serviceD
npm run dev:serviceE    # Start only service-e
```

## Technical Details

### Service Detection

**Primary Method (Import Map):**
A service is started if:
- It's listed in `config-server/import-map.json` under `applications`
- The service folder exists in `services/` directory
- It contains a `package.json` file

**Fallback Method (Directory Scan):**
If import map is unavailable, a directory is considered a service if:
- It's located in `services/` folder
- It contains a `package.json` file
- It's a directory (not a file)

This means **disabled services** (removed from import map) won't start automatically!

### Color Coding

Services are assigned colors in rotation:
- Green
- Magenta
- Cyan
- Yellow
- Red

### Process Management

- All services run as child processes
- Output is prefixed with service name
- SIGINT (Ctrl+C) and SIGTERM are handled
- All child processes are killed on exit

## Troubleshooting

### Service Not Starting

Check if the service has a valid `package.json`:
```bash
ls -la services/my-service/package.json
```

### Port Conflicts

Each service should have a unique port in its webpack config:
```javascript
// services/my-service/webpack.config.js
devServer: {
  port: 8085,  // Unique port
}
```

### No Services Found

Ensure services are in the correct location:
```
services/
├── serviceA/
│   └── package.json
├── serviceB/
│   └── package.json
└── ...
```

## Migration from Old Scripts

The old individual service scripts are still available as `dev:services:old` if needed, but the new dynamic approach is recommended for:
- Easier maintenance
- Automatic service discovery
- Cleaner package.json
- Better scalability