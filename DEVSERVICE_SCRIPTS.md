# 🎯 DevService Scripts

Individual service scripts with the `devservice:` prefix for better organization and batch execution.

## Available Scripts

### Individual Services

```bash
npm run devservice:serviceA     # Start serviceA only
npm run devservice:serviceB     # Start serviceB only
npm run devservice:serviceD     # Start serviceD only
npm run devservice:service-e    # Start service-e only
```

### All Services at Once

```bash
npm run devservices:all         # Start ALL services with concurrently
```

## Benefits

### 1. Clear Naming Convention

- `dev:*` - Core development scripts (shell, config, all)
- `devservice:*` - Individual service scripts
- `devservices:all` - All services together

### 2. Batch Execution

The `devservices:all` script uses concurrently to run all services:
- Each service has its own color
- Each service is labeled
- All services start simultaneously
- Ctrl+C stops all services

### 3. Automatic Management

These scripts are automatically managed by the service manager:
- `service:create` - Adds new devservice script
- `service:enable` - Re-adds devservice script
- `service:disable` - Removes devservice script
- `service:remove` - Removes devservice script
- `service:refresh` - Syncs all devservice scripts

## Usage Examples

### Start One Service

```bash
npm run devservice:serviceA
```

### Start All Services

```bash
npm run devservices:all
```

Output:
```
[serviceA] webpack 5.103.0 compiled successfully
[serviceB] webpack 5.103.0 compiled successfully
[serviceD] webpack 5.103.0 compiled successfully
[service-e] webpack 5.103.0 compiled successfully
```

### Start Everything (Config + Shell + All Services)

```bash
# Option 1: Using dev:all (uses dynamic discovery)
npm run dev:all

# Option 2: Manual combination
concurrently "npm run dev:config" "npm run dev:shell" "npm run devservices:all"
```

## Comparison with Other Scripts

| Script | What It Does | When to Use |
|--------|--------------|-------------|
| `dev:services` | Dynamic discovery from import-map | Recommended - auto-discovers enabled services |
| `devservices:all` | Runs all devservice:* scripts | Alternative - uses explicit script list |
| `devservice:serviceA` | Runs only serviceA | When working on specific service |

## How It Works

### Automatic Generation

When you run `npm run service:refresh`, the service manager:

1. Reads `config-server/import-map.json`
2. For each service in `applications` array:
   - Creates `devservice:{serviceName}` script
3. Creates `devservices:all` script that runs all of them

### Example Generation

**Import Map:**
```json
{
  "applications": [
    { "name": "@rrv7/serviceA", "route": "serviceA" },
    { "name": "@rrv7/serviceB", "route": "serviceB" }
  ]
}
```

**Generated Scripts:**
```json
{
  "scripts": {
    "devservice:serviceA": "cd services/serviceA && npm start",
    "devservice:serviceB": "cd services/serviceB && npm start",
    "devservices:all": "concurrently --names \"serviceA,serviceB\" --prefix-colors \"green,magenta\" \"npm run devservice:serviceA\" \"npm run devservice:serviceB\""
  }
}
```

## Color Coding

Services are assigned colors in rotation:
1. Green
2. Magenta
3. Cyan
4. Yellow
5. Red
6. Blue

## Migration from Old Scripts

Old scripts like `dev:serviceA` are automatically cleaned up when you run `service:refresh`. The new naming convention is:

- ❌ Old: `dev:serviceA`, `dev:serviceB`
- ✅ New: `devservice:serviceA`, `devservice:serviceB`

## Best Practices

1. **Use `dev:services` for normal development** - It uses dynamic discovery
2. **Use `devservices:all` if you prefer explicit lists** - All services defined in scripts
3. **Use individual `devservice:*` for focused work** - One service at a time
4. **Run `service:refresh` after manual edits** - Keep scripts in sync

## Troubleshooting

### Service Not in List

```bash
# Check what's in import map
npm run service:list

# Refresh scripts
npm run service:refresh
```

### Script Not Found

```bash
# Verify script exists
npm run | grep devservice

# Regenerate scripts
npm run service:refresh
```

### Port Conflicts

Each service has its own port defined in webpack.config.js:
- serviceA: 8081
- serviceB: 8082
- serviceD: 8083
- service-e: 8084

## Related Documentation

- [SERVICE_MANAGER.md](SERVICE_MANAGER.md) - Service manager commands
- [DYNAMIC_SERVICES.md](DYNAMIC_SERVICES.md) - Dynamic service discovery
- [NPM_SCRIPTS.md](NPM_SCRIPTS.md) - All available scripts
- [REFRESH_COMMAND.md](REFRESH_COMMAND.md) - Refresh command details