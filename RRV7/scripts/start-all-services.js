#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get enabled services from import-map.json
function getEnabledServices() {
  const importMapPath = path.join(__dirname, '..', '..', 'config-server', 'import-map.json');
  
  if (!fs.existsSync(importMapPath)) {
    console.log('⚠️  Import map not found at:', importMapPath);
    console.log('Falling back to directory scan...\n');
    return getAllServicesFromDirectory();
  }
  
  try {
    const importMapContent = fs.readFileSync(importMapPath, 'utf8');
    const importMap = JSON.parse(importMapContent);
    
    if (!importMap.applications || importMap.applications.length === 0) {
      console.log('⚠️  No applications found in import map');
      console.log('Falling back to directory scan...\n');
      return getAllServicesFromDirectory();
    }
    
    // Extract service names from routes
    const services = importMap.applications.map(app => app.route);
    
    // Verify services exist in filesystem
    const servicesDir = path.join(__dirname, '..', '..', 'services');
    const existingServices = services.filter(service => {
      const servicePath = path.join(servicesDir, service);
      const packageJsonPath = path.join(servicePath, 'package.json');
      return fs.existsSync(servicePath) && fs.existsSync(packageJsonPath);
    });
    
    if (existingServices.length < services.length) {
      const missing = services.filter(s => !existingServices.includes(s));
      console.log(`⚠️  Warning: ${missing.length} service(s) in import map but not found in filesystem: ${missing.join(', ')}\n`);
    }
    
    return existingServices;
  } catch (error) {
    console.error('❌ Error reading import map:', error.message);
    console.log('Falling back to directory scan...\n');
    return getAllServicesFromDirectory();
  }
}

// Fallback: Get all service directories
function getAllServicesFromDirectory() {
  const servicesDir = path.join(__dirname, '..', '..', 'services');
  
  if (!fs.existsSync(servicesDir)) {
    console.log('❌ No services directory found');
    return [];
  }
  
  const entries = fs.readdirSync(servicesDir, { withFileTypes: true });
  const services = entries
    .filter(entry => entry.isDirectory())
    .filter(entry => {
      // Check if it has a package.json
      const packageJsonPath = path.join(servicesDir, entry.name, 'package.json');
      return fs.existsSync(packageJsonPath);
    })
    .map(entry => entry.name);
  
  return services;
}

// Start all services
function startAllServices() {
  console.log('🔍 Reading enabled services from import-map.json...\n');
  const services = getEnabledServices();
  
  if (services.length === 0) {
    console.log('❌ No services found to start');
    process.exit(0);
  }
  
  console.log(`✅ Found ${services.length} enabled service(s): ${services.join(', ')}`);
  console.log('🚀 Starting all services...\n');
  
  const processes = [];
  
  services.forEach((service, index) => {
    const servicePath = path.join(__dirname, '..', '..', 'services', service);
    const color = ['\x1b[32m', '\x1b[35m', '\x1b[36m', '\x1b[33m', '\x1b[31m'][index % 5];
    const reset = '\x1b[0m';
    
    console.log(`${color}[${service}]${reset} Starting on ${servicePath}`);
    
    const proc = spawn('npm', ['start'], {
      cwd: servicePath,
      stdio: 'pipe',
      shell: true
    });
    
    proc.stdout.on('data', (data) => {
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          console.log(`${color}[${service}]${reset} ${line}`);
        }
      });
    });
    
    proc.stderr.on('data', (data) => {
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          console.error(`${color}[${service}]${reset} ${line}`);
        }
      });
    });
    
    proc.on('close', (code) => {
      console.log(`${color}[${service}]${reset} Process exited with code ${code}`);
    });
    
    processes.push(proc);
  });
  
  // Handle cleanup on exit
  process.on('SIGINT', () => {
    console.log('\nShutting down all services...');
    processes.forEach(proc => proc.kill());
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\nShutting down all services...');
    processes.forEach(proc => proc.kill());
    process.exit(0);
  });
}

startAllServices();
