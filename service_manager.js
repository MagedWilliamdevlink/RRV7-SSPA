#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for better CLI output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Helper functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ Error: ${message}`, 'red');
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Validate service name
function validateServiceName(name) {
  if (!name) {
    throw new Error('Service name is required');
  }
  
  if (typeof name !== 'string') {
    throw new Error('Service name must be a string');
  }
  
  // Check for spaces
  if (name.includes(' ')) {
    throw new Error('Service name cannot contain spaces');
  }
  
  // Sanitize: only allow alphanumeric and hyphens/underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    throw new Error('Service name can only contain letters, numbers, hyphens, and underscores');
  }
  
  // Check minimum length
  if (name.length < 2) {
    throw new Error('Service name must be at least 2 characters long');
  }
  
  // Check maximum length
  if (name.length > 50) {
    throw new Error('Service name must be less than 50 characters');
  }
  
  return true;
}

// Sanitize service name to lowercase
function sanitizeServiceName(name) {
  return name;
}

// Get import map path
function getImportMapPath() {
  return path.join(__dirname, 'config-server', 'import-map.json');
}

// Read import map
function readImportMap() {
  const importMapPath = getImportMapPath();
  if (!fs.existsSync(importMapPath)) {
    throw new Error(`Import map not found at ${importMapPath}`);
  }
  
  try {
    const content = fs.readFileSync(importMapPath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    throw new Error(`Failed to parse import map: ${err.message}`);
  }
}

// Write import map
function writeImportMap(importMap) {
  const importMapPath = getImportMapPath();
  try {
    fs.writeFileSync(importMapPath, JSON.stringify(importMap, null, 2), 'utf8');
  } catch (err) {
    throw new Error(`Failed to write import map: ${err.message}`);
  }
}

// Replace text in file
function replaceInFile(filePath, searchValue, replaceValue) {
  if (!fs.existsSync(filePath)) {
    warning(`File not found: ${filePath}`);
    return;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(new RegExp(searchValue, 'g'), replaceValue);
    fs.writeFileSync(filePath, content, 'utf8');
  } catch (err) {
    throw new Error(`Failed to update file ${filePath}: ${err.message}`);
  }
}

// Copy directory recursively
function copyDirectory(src, dest) {
  if (!fs.existsSync(src)) {
    throw new Error(`Source directory not found: ${src}`);
  }
  
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Remove directory recursively
function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

// Get next available port
function getNextPort() {
  const importMap = readImportMap();
  const usedPorts = new Set();
  
  // Extract ports from existing services
  Object.values(importMap.imports).forEach(url => {
    const match = url.match(/localhost:(\d+)/);
    if (match) {
      usedPorts.add(parseInt(match[1]));
    }
  });
  
  // Start from 8081 and find next available
  let port = 8081;
  while (usedPorts.has(port)) {
    port++;
  }
  
  return port;
}

// Update root package.json with service scripts
function updateRootPackageJson() {
  const packageJsonPath = path.join(__dirname, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    warning('Root package.json not found, skipping script update');
    return;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const importMap = readImportMap();
    
    if (!importMap.applications || importMap.applications.length === 0) {
      return;
    }
    
    // Clean up old dev: scripts (for migration)
    Object.keys(packageJson.scripts).forEach(key => {
      if (key.startsWith('dev:service') && key !== 'dev:services' && key !== 'dev:shell' && key !== 'dev:config' && key !== 'dev:all') {
        delete packageJson.scripts[key];
      }
    });
    
    // Get list of current services in import map
    const currentServices = new Set(importMap.applications.map(app => `devservice:${app.route}`));
    
    // Remove all devservice: scripts that are not in the import map
    Object.keys(packageJson.scripts).forEach(key => {
      if (key.startsWith('devservice:') && key !== 'devservices:all' && !currentServices.has(key)) {
        console.log(`  Removing obsolete script: ${key}`);
        delete packageJson.scripts[key];
      }
    });
    
    // Update individual service scripts with devservice: prefix
    importMap.applications.forEach(app => {
      const serviceName = app.route;
      const scriptName = `devservice:${serviceName}`;
      packageJson.scripts[scriptName] = `cd services/${serviceName} && npm start`;
    });
    
    // Add a script to run all devservices at once
    const devserviceNames = importMap.applications.map(app => `devservice:${app.route}`);
    const serviceLabels = importMap.applications.map(app => app.route).join(',');
    const colors = ['green', 'magenta', 'cyan', 'yellow', 'red', 'blue'];
    const serviceColors = importMap.applications.map((_, i) => colors[i % colors.length]).join(',');
    
    packageJson.scripts['devservices:all'] = `concurrently --names "${serviceLabels}" --prefix-colors "${serviceColors}" ${devserviceNames.map(name => `"npm run ${name}"`).join(' ')}`;
    
    // Update build:services script
    const buildCommands = importMap.applications
      .map((app, index) => {
        const prefix = index === 0 ? 'cd services/' : 'cd ../';
        return `${prefix}${app.route} && npm run build`;
      })
      .join(' && ');
    
    if (buildCommands) {
      packageJson.scripts['build:services'] = buildCommands;
    }
    
    // Write back to file
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
    info('Updated root package.json scripts');
    
  } catch (err) {
    warning(`Failed to update package.json: ${err.message}`);
  }
}

// Create new service
function createService(serviceName) {
  try {
    validateServiceName(serviceName);
    
    // Convert to lowercase
    const originalName = serviceName;
    serviceName = sanitizeServiceName(serviceName);
    
    if (originalName !== serviceName) {
      info(`Service name converted to lowercase: ${originalName} → ${serviceName}`);
    }
    
    info(`Creating new service: ${serviceName}`);
    
    // Ensure services directory exists
    const servicesDir = path.join(__dirname, 'services');
    if (!fs.existsSync(servicesDir)) {
      fs.mkdirSync(servicesDir, { recursive: true });
      info('Created services directory');
    }
    
    // Check if service already exists
    const servicePath = path.join(servicesDir, serviceName);
    if (fs.existsSync(servicePath)) {
      throw new Error(`Service directory already exists: ${serviceName}`);
    }
    
    // Check if service is already in import map
    const importMap = readImportMap();
    const serviceKey = `@rrv7/${serviceName}`;
    if (importMap.imports[serviceKey]) {
      throw new Error(`Service already exists in import map: ${serviceName}`);
    }
    
    // Copy blueprint
    const blueprintPath = path.join(__dirname, 'serviceBlueprint');
    if (!fs.existsSync(blueprintPath)) {
      throw new Error('serviceBlueprint directory not found');
    }
    
    info('Copying service blueprint...');
    copyDirectory(blueprintPath, servicePath);
    
    // Get next available port
    const port = getNextPort();
    info(`Assigned port: ${port}`);
    
    // Replace serviceA with new service name in all files
    const filesToUpdate = [
      path.join(servicePath, 'package.json'),
      path.join(servicePath, 'webpack.config.js'),
      path.join(servicePath, 'src', 'rrv7-serviceA.js'),
      path.join(servicePath, 'src', 'root.component.js'),
      path.join(servicePath, 'src', 'root.component.test.js')
    ];
    
    info('Updating service files...');
    filesToUpdate.forEach(filePath => {
      replaceInFile(filePath, 'serviceA', serviceName);
      replaceInFile(filePath, 'Service A', serviceName.charAt(0).toUpperCase() + serviceName.slice(1));
    });
    
    // Rename the main entry file
    const oldEntryPath = path.join(servicePath, 'src', 'rrv7-serviceA.js');
    const newEntryPath = path.join(servicePath, 'src', `rrv7-${serviceName}.js`);
    if (fs.existsSync(oldEntryPath)) {
      fs.renameSync(oldEntryPath, newEntryPath);
    }
    
    // Update webpack config port
    const webpackConfigPath = path.join(servicePath, 'webpack.config.js');
    replaceInFile(webpackConfigPath, '8081', port.toString());
    
    // Update import map
    info('Updating import map...');
    importMap.imports[serviceKey] = `http://localhost:${port}/rrv7-${serviceName}.js`;
    
    if (!importMap.applications) {
      importMap.applications = [];
    }
    
    importMap.applications.push({
      name: serviceKey,
      route: serviceName
    });
    
    writeImportMap(importMap);
    
    // Update root package.json scripts
    info('Updating root package.json...');
    updateRootPackageJson();
    
    // Install dependencies
    info('Installing dependencies...');
    try {
      execSync('npm install', { cwd: servicePath, stdio: 'inherit' });
    } catch (err) {
      warning('Failed to install dependencies automatically. Run "npm install" in the service directory.');
    }
    
    success(`Service "${serviceName}" created successfully!`);
    info(`Service directory: services/${serviceName}`);
    info(`Service port: ${port}`);
    info(`To start the service: cd services/${serviceName} && npm start`);
    
  } catch (err) {
    error(err.message);
    process.exit(1);
  }
}

// Disable service (remove from import map but keep files)
function disableService(serviceName) {
  try {
    validateServiceName(serviceName);
    serviceName = sanitizeServiceName(serviceName);
    
    info(`Disabling service: ${serviceName}`);
    
    const importMap = readImportMap();
    const serviceKey = `@rrv7/${serviceName}`;
    
    // Check if service exists in import map
    if (!importMap.imports[serviceKey]) {
      throw new Error(`Service not found in import map: ${serviceName}`);
    }
    
    // Remove from imports
    delete importMap.imports[serviceKey];
    
    // Remove from applications
    if (importMap.applications) {
      importMap.applications = importMap.applications.filter(app => app.name !== serviceKey);
    }
    
    writeImportMap(importMap);
    
    // Update root package.json scripts
    info('Updating root package.json...');
    updateRootPackageJson();
    
    success(`Service "${serviceName}" disabled successfully!`);
    info('Service files are preserved. Use "enable" command to re-enable or "remove" to delete files.');
    
  } catch (err) {
    error(err.message);
    process.exit(1);
  }
}

// Enable service (add back to import map)
function enableService(serviceName) {
  try {
    validateServiceName(serviceName);
    serviceName = sanitizeServiceName(serviceName);
    
    info(`Enabling service: ${serviceName}`);
    
    const servicePath = path.join(__dirname, 'services', serviceName);
    if (!fs.existsSync(servicePath)) {
      throw new Error(`Service directory not found: services/${serviceName}`);
    }
    
    const importMap = readImportMap();
    const serviceKey = `@rrv7/${serviceName}`;
    
    // Check if service is already enabled
    if (importMap.imports[serviceKey]) {
      throw new Error(`Service is already enabled: ${serviceName}`);
    }
    
    // Get next available port
    const port = getNextPort();
    
    // Add to imports
    importMap.imports[serviceKey] = `http://localhost:${port}/rrv7-${serviceName}.js`;
    
    // Add to applications
    if (!importMap.applications) {
      importMap.applications = [];
    }
    
    importMap.applications.push({
      name: serviceKey,
      route: serviceName
    });
    
    writeImportMap(importMap);
    
    // Update root package.json scripts
    info('Updating root package.json...');
    updateRootPackageJson();
    
    success(`Service "${serviceName}" enabled successfully!`);
    info(`Service port: ${port}`);
    
  } catch (err) {
    error(err.message);
    process.exit(1);
  }
}

// Remove service (disable and delete files)
function removeService(serviceName) {
  try {
    validateServiceName(serviceName);
    serviceName = sanitizeServiceName(serviceName);
    
    warning(`This will permanently delete the service "${serviceName}" and all its files!`);
    
    // Disable first
    const importMap = readImportMap();
    const serviceKey = `@rrv7/${serviceName}`;
    
    if (importMap.imports[serviceKey]) {
      info('Removing from import map...');
      delete importMap.imports[serviceKey];
      
      if (importMap.applications) {
        importMap.applications = importMap.applications.filter(app => app.name !== serviceKey);
      }
      
      writeImportMap(importMap);
    }
    
    // Remove directory
    const servicePath = path.join(__dirname, 'services', serviceName);
    if (fs.existsSync(servicePath)) {
      info('Deleting service files...');
      removeDirectory(servicePath);
    }
    
    // Update root package.json scripts
    info('Updating root package.json...');
    updateRootPackageJson();
    
    success(`Service "${serviceName}" removed successfully!`);
    
  } catch (err) {
    error(err.message);
    process.exit(1);
  }
}

// List all services
function listServices() {
  try {
    const importMap = readImportMap();
    
    log('\n📋 Microfrontend Services:', 'bright');
    log('═'.repeat(50), 'cyan');
    
    if (!importMap.applications || importMap.applications.length === 0) {
      info('No services found.');
      return;
    }
    
    importMap.applications.forEach((app, index) => {
      const serviceName = app.route;
      const serviceUrl = importMap.imports[app.name];
      const servicePath = path.join(__dirname, 'services', serviceName);
      const exists = fs.existsSync(servicePath);
      
      log(`\n${index + 1}. ${serviceName}`, 'bright');
      log(`   Name: ${app.name}`, 'cyan');
      log(`   Route: /services/${app.route}`, 'cyan');
      log(`   URL: ${serviceUrl}`, 'cyan');
      log(`   Files: ${exists ? '✅ Present' : '❌ Missing'}`, exists ? 'green' : 'red');
    });
    
    log('\n');
    
  } catch (err) {
    error(err.message);
    process.exit(1);
  }
}

// Refresh package.json scripts from import map
function refreshScripts() {
  try {
    info('Refreshing package.json scripts from import-map.json...');
    
    const importMap = readImportMap();
    
    if (!importMap.applications || importMap.applications.length === 0) {
      warning('No applications found in import map');
      return;
    }
    
    info(`Found ${importMap.applications.length} service(s) in import map`);
    
    // Update root package.json
    updateRootPackageJson();
    
    success('Package.json scripts refreshed successfully!');
    info('All service scripts are now in sync with import-map.json');
    
  } catch (err) {
    error(err.message);
    process.exit(1);
  }
}

// Show help
function showHelp() {
  log('\n🚀 Microfrontend Service Manager', 'bright');
  log('═'.repeat(50), 'cyan');
  log('\nManage microfrontend services for the RRV7 shell application.\n', 'blue');
  
  log('USAGE:', 'bright');
  log('  node service_manager.js <command> [options]\n');
  
  log('COMMANDS:', 'bright');
  log('  create <name>    Create a new microfrontend service');
  log('  disable <name>   Disable a service (remove from import map)');
  log('  enable <name>    Enable a disabled service');
  log('  remove <name>    Remove a service completely (files + import map)');
  log('  list             List all services');
  log('  refresh          Sync package.json scripts with import-map.json');
  log('  help             Show this help message\n');
  
  log('OPTIONS:', 'bright');
  log('  --name=<name>    Service name (alternative to positional argument)\n');
  
  log('EXAMPLES:', 'bright');
  log('  node service_manager.js create my-service');
  log('  node service_manager.js create --name=user-auth');
  log('  node service_manager.js disable my-service');
  log('  node service_manager.js remove my-service');
  log('  node service_manager.js list');
  log('  node service_manager.js refresh\n');
  
  log('SERVICE NAME RULES:', 'bright');
  log('  • Uppercase letters will be converted to lowercase');
  log('  • No spaces allowed');
  log('  • Only letters, numbers, hyphens, and underscores');
  log('  • 2-50 characters long\n');
  
  log('NOTES:', 'bright');
  log('  • Services are automatically assigned available ports starting from 8081');
  log('  • The config server must be running for changes to take effect');
  log('  • Restart the config server after making changes\n');
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    showHelp();
    return;
  }
  
  const command = args[0];
  let serviceName = args[1];
  
  // Check for --name flag
  const nameFlag = args.find(arg => arg.startsWith('--name='));
  if (nameFlag) {
    serviceName = nameFlag.split('=')[1];
  }
  
  switch (command) {
    case 'create':
      if (!serviceName) {
        error('Service name is required for create command');
        log('Usage: node service_manager.js create <name>');
        process.exit(1);
      }
      createService(serviceName);
      break;
      
    case 'disable':
      if (!serviceName) {
        error('Service name is required for disable command');
        log('Usage: node service_manager.js disable <name>');
        process.exit(1);
      }
      disableService(serviceName);
      break;
      
    case 'enable':
      if (!serviceName) {
        error('Service name is required for enable command');
        log('Usage: node service_manager.js enable <name>');
        process.exit(1);
      }
      enableService(serviceName);
      break;
      
    case 'remove':
      if (!serviceName) {
        error('Service name is required for remove command');
        log('Usage: node service_manager.js remove <name>');
        process.exit(1);
      }
      removeService(serviceName);
      break;
      
    case 'list':
      listServices();
      break;
      
    case 'refresh':
      refreshScripts();
      break;
      
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
      
    default:
      error(`Unknown command: ${command}`);
      log('Run "node service_manager.js help" for usage information.');
      process.exit(1);
  }
}

// Main execution
if (require.main === module) {
  parseArgs();
}

module.exports = {
  createService,
  disableService,
  enableService,
  removeService,
  listServices,
  refreshScripts,
  validateServiceName
};