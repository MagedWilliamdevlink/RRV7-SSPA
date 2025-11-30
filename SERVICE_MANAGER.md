# 🚀 Microfrontend Service Manager

A comprehensive CLI tool for managing microfrontend services in the RRV7 + Single-SPA architecture.

## Features

- ✅ **Create** new microfrontend services from blueprint
- ✅ **Disable** services (remove from import map, keep files)
- ✅ **Enable** disabled services
- ✅ **Remove** services completely (files + import map)
- ✅ **List** all services with status
- ✅ **Automatic port assignment**
- ✅ **Auto-update package.json scripts** (individual service scripts)
- ✅ **Input validation and sanitization**
- ✅ **Colorful CLI output**
- ✅ **Comprehensive error handling**

## Installation

No installation required! The script uses Node.js built-in modules.

## Usage

```bash
node service_manager.js <command> [options]
```

## Commands

### Refresh Scripts

```bash
# Sync package.json scripts with import-map.json
node service_manager.js refresh
# or
npm run service:refresh
```

This command:
- Reads all enabled services from import-map.json
- Updates root package.json with individual service scripts
- Updates the build:services script
- Useful if files get out of sync

**When to use:**
- After manually editing import-map.json
- If package.json scripts are missing or outdated
- After git pull/merge conflicts
- To verify everything is in sync

### Create a New Service

```bash
# Create a new service
node service_manager.js create my-service
node service_manager.js create --name=user-auth

# What it does:
# 1. Validates service name
# 2. Copies serviceBlueprint folder
# 3. Replaces all "serviceA" references with new name
# 4. Assigns next available port (starting from 8081)
# 5. Updates import-map.json
# 6. Installs npm dependencies
```

### Disable a Service

```bash
# Remove from import map but keep files
node service_manager.js disable my-service

# What it does:
# 1. Removes service from import-map.json
# 2. Keeps all service files intact
# 3. Service won't load in shell app
```

### Enable a Service

```bash
# Re-add disabled service to import map
node service_manager.js enable my-service

# What it does:
# 1. Adds service back to import-map.json
# 2. Assigns new available port
# 3. Service will load in shell app again
```

### Remove a Service

```bash
# Permanently delete service
node service_manager.js remove my-service

# What it does:
# 1. Removes from import-map.json
# 2. Deletes entire service folder
# 3. ⚠️ This is permanent!
```

### List All Services

```bash
# Show all services with status
node service_manager.js list

# Output example:
# 📋 Microfrontend Services:
# ══════════════════════════════════════════════════
# 
# 1. serviceA
#    Name: @rrv7/serviceA
#    Route: /services/serviceA
#    URL: http://localhost:8081/rrv7-serviceA.js
#    Files: ✅ Present
# 
# 2. my-service
#    Name: @rrv7/my-service
#    Route: /services/my-service
#    URL: http://localhost:8082/rrv7-my-service.js
#    Files: ✅ Present
```

### Help

```bash
node service_manager.js help
node service_manager.js --help
node service_manager.js -h
```

## Service Name Rules

Service names must follow these rules:

- ✅ **Lowercase only**: `my-service` ✓, `My-Service` ✗
- ✅ **No spaces**: `my-service` ✓, `my service` ✗
- ✅ **Allowed characters**: letters, numbers, hyphens, underscores
- ✅ **Length**: 2-50 characters
- ✅ **Valid examples**: `user-auth`, `shopping_cart`, `service123`

## How It Works

### 1. Service Creation Process

```
serviceBlueprint/          →    services/my-service/
├── package.json           →    ├── package.json (updated)
├── webpack.config.js      →    ├── webpack.config.js (port updated)
├── src/                   →    ├── src/
│   ├── rrv7-serviceA.js   →    │   ├── rrv7-my-service.js
│   └── root.component.js  →    │   └── root.component.js (updated)
└── ...                    →    └── ...
```

### 2. Import Map Updates

```json
{
  "imports": {
    "@rrv7/my-service": "http://localhost:8082/rrv7-my-service.js"
  },
  "applications": [
    {
      "name": "@rrv7/my-service",
      "route": "my-service"
    }
  ]
}
```

### 3. Automatic Port Assignment

- Scans existing services in import-map.json
- Finds next available port starting from 8081
- Updates webpack.config.js with assigned port

## File Structure

```
project-root/
├── service_manager.js          # Main CLI tool
├── SERVICE_MANAGER.md          # This documentation
├── serviceBlueprint/           # Template for new services
├── config-server/
│   └── import-map.json        # Central configuration
├── services/                  # All microfrontend services
│   ├── serviceA/              # Example service
│   ├── serviceB/              # Example service
│   └── serviceD/              # Example service
└── RRV7/                      # Shell application
```

## Integration with Development Workflow

### 1. Create and Start New Service

```bash
# Create service
node service_manager.js create payment-gateway

# Start the service
cd services/payment-gateway
npm start

# Service now available at /services/payment-gateway
```

### 2. Restart Config Server

After creating/modifying services:

```bash
cd config-server
npm start  # Restart to reload import-map.json
```

### 3. Refresh Shell App

The shell app will automatically pick up the new service configuration.

## Error Handling

The tool provides comprehensive error messages:

```bash
❌ Error: Service name cannot contain spaces
❌ Error: Service directory already exists: my-service
❌ Error: Service not found in import map: nonexistent-service
✅ Service "my-service" created successfully!
```

## Advanced Usage

### Programmatic Usage

```javascript
const serviceManager = require('./service_manager.js');

// Create service programmatically
try {
  serviceManager.createService('my-new-service');
  console.log('Service created!');
} catch (error) {
  console.error('Failed:', error.message);
}
```

### Batch Operations

```bash
# Create multiple services
for service in auth cart checkout; do
  node service_manager.js create $service
done
```

## Troubleshooting

### Common Issues

1. **"serviceBlueprint directory not found"**
   - Ensure you're running the script from the project root
   - Check that serviceBlueprint/ folder exists

2. **"Import map not found"**
   - Ensure config-server/import-map.json exists
   - Check file permissions

3. **"Failed to install dependencies"**
   - Run `npm install` manually in the service directory
   - Check internet connection

4. **Port conflicts**
   - The tool automatically assigns available ports
   - Check if services are already running on assigned ports

### Debug Mode

Add logging to see what's happening:

```javascript
// Add to service_manager.js for debugging
console.log('Current working directory:', process.cwd());
console.log('Import map path:', getImportMapPath());
```

## Contributing

To extend the service manager:

1. Add new commands in the `parseArgs()` function
2. Create corresponding handler functions
3. Update help text and documentation
4. Test with various edge cases

## License

This tool is part of the RRV7 + Single-SPA microfrontend architecture project.