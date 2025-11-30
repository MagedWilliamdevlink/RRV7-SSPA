# 🚀 Quick Start Guide

## Service Manager Commands

### Using Node directly:
```bash
# Create a new service
node service_manager.js create my-awesome-service

# List all services
node service_manager.js list

# Disable a service
node service_manager.js disable my-awesome-service

# Enable a service
node service_manager.js enable my-awesome-service

# Remove a service completely
node service_manager.js remove my-awesome-service

# Show help
node service_manager.js help
```

### Using npm scripts (shorter):
```bash
# Create a new service
npm run service create my-awesome-service

# List all services
npm run service:list

# Show help
npm run service:help

# Start config server
npm run config-server
```

## Complete Workflow Example

### 1. Create a new service
```bash
node service_manager.js create user-profile
```

### 2. Start the new service
```bash
cd services/user-profile
npm start
```

### 3. Restart config server (in another terminal)
```bash
npm run config-server
```

### 4. Access your new service
Navigate to: `http://localhost:5173/services/user-profile`

## Service Name Examples

✅ **Good names:**
- `user-auth`
- `shopping-cart`
- `payment_gateway`
- `dashboard123`
- `api-client`

❌ **Bad names:**
- `User Auth` (spaces)
- `Shopping-Cart` (uppercase)
- `payment@gateway` (special chars)
- `a` (too short)

## Development Tips

1. **Always restart config server** after creating/modifying services
2. **Check service status** with `npm run service:list`
3. **Use meaningful names** that describe the service purpose
4. **Follow naming conventions** for consistency across your team