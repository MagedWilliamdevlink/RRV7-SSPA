# 🔄 Refresh Command

The `refresh` command syncs your package.json scripts with the import-map.json configuration.

## Usage

```bash
# Using npm script
npm run service:refresh

# Using service manager directly
node service_manager.js refresh
```

## What It Does

1. **Reads** `config-server/import-map.json`
2. **Extracts** all enabled services from the `applications` array
3. **Updates** root `package.json` with:
   - Individual service scripts (e.g., `dev:serviceA`)
   - Combined `build:services` script
4. **Syncs** everything to match the import map

## When to Use

### After Manual Edits

```bash
# You manually edited import-map.json
vim config-server/import-map.json

# Sync the scripts
npm run service:refresh
```

### After Git Operations

```bash
# After pulling changes
git pull origin main

# Sync scripts with new import map
npm run service:refresh
```

### After Merge Conflicts

```bash
# Resolved conflicts in import-map.json
git merge feature-branch

# Ensure package.json is in sync
npm run service:refresh
```

### Verification

```bash
# Just want to make sure everything is in sync
npm run service:refresh
```

## Example Output

```
ℹ️  Refreshing package.json scripts from import-map.json...
ℹ️  Found 4 service(s) in import map
ℹ️  Updated root package.json scripts
✅ Package.json scripts refreshed successfully!
ℹ️  All service scripts are now in sync with import-map.json
```

## What Gets Updated

### Individual Service Scripts

Before:
```json
{
  "scripts": {
    "dev:serviceA": "cd services/serviceA && npm start",
    "dev:serviceB": "cd services/serviceB && npm start"
  }
}
```

After (if you added serviceC to import map):
```json
{
  "scripts": {
    "dev:serviceA": "cd services/serviceA && npm start",
    "dev:serviceB": "cd services/serviceB && npm start",
    "dev:serviceC": "cd services/serviceC && npm start"
  }
}
```

### Build Script

Before:
```json
{
  "scripts": {
    "build:services": "cd services/serviceA && npm run build && cd ../serviceB && npm run build"
  }
}
```

After:
```json
{
  "scripts": {
    "build:services": "cd services/serviceA && npm run build && cd ../serviceB && npm run build && cd ../serviceC && npm run build"
  }
}
```

## Automatic vs Manual Refresh

### Automatic (Built-in)

The refresh happens automatically when you use:
- `service:create` - Creates service and updates scripts
- `service:enable` - Enables service and updates scripts
- `service:disable` - Disables service and updates scripts
- `service:remove` - Removes service and updates scripts

### Manual (When Needed)

Use `service:refresh` when:
- You manually edited import-map.json
- Scripts are out of sync after git operations
- You want to verify everything is correct
- Package.json was modified outside service manager

## Integration with Service Manager

The refresh command uses the same `updateRootPackageJson()` function that's automatically called by other service manager commands. This ensures consistency across all operations.

## Troubleshooting

### No Services Found

```
⚠️  No applications found in import map
```

**Solution:** Check that `config-server/import-map.json` has an `applications` array with services.

### Import Map Not Found

```
❌ Error: Import map not found at config-server/import-map.json
```

**Solution:** Ensure you're running the command from the project root directory.

### Permission Errors

```
⚠️  Failed to update package.json: EACCES
```

**Solution:** Check file permissions on package.json.

## Best Practices

1. **Run after git pull** - Ensure scripts match the latest import map
2. **Run before deployment** - Verify everything is in sync
3. **Run after manual edits** - Keep automation benefits
4. **Include in CI/CD** - Add to your build pipeline

## Related Commands

- `npm run service:list` - See all services and their status
- `npm run service:create` - Create new service (auto-refreshes)
- `npm run service:help` - Show all available commands

## See Also

- [SERVICE_MANAGER.md](SERVICE_MANAGER.md) - Complete service manager documentation
- [DYNAMIC_SERVICES.md](DYNAMIC_SERVICES.md) - How dynamic service discovery works
- [NPM_SCRIPTS.md](NPM_SCRIPTS.md) - All available npm scripts