#!/usr/bin/env node

// HELiiX-OS Docker Dev Server Command for Claude
// This command starts the HELiiX-OS development server with integrated NOVA assistant using Docker

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Project root detection
function findProjectRoot() {
  let currentDir = process.cwd();
  
  while (currentDir !== '/') {
    if (fs.existsSync(path.join(currentDir, 'package.json'))) {
      const packageJson = JSON.parse(fs.readFileSync(path.join(currentDir, 'package.json'), 'utf8'));
      if (packageJson.name === 'heliix-os') {
        return currentDir;
      }
    }
    currentDir = path.dirname(currentDir);
  }
  
  throw new Error('HELiiX-OS project root not found. Please run this command from within the HELiiX project.');
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log(`\n${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${title}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
}

async function main() {
  try {
    logSection('🚀 HELiiX-OS Docker Development Server');
    
    // Find project root
    const projectRoot = findProjectRoot();
    log(`📁 Project root: ${projectRoot}`, 'dim');
    
    // Change to project directory
    process.chdir(projectRoot);
    
    // Check if Docker is running
    log('\n🐳 Checking Docker status...', 'blue');
    try {
      await new Promise((resolve, reject) => {
        const dockerCheck = spawn('docker', ['info'], { stdio: 'pipe' });
        dockerCheck.on('close', (code) => {
          if (code === 0) resolve();
          else reject(new Error('Docker is not running'));
        });
      });
      log('✅ Docker is running', 'green');
    } catch (error) {
      log('❌ Docker is not running. Please start Docker Desktop first.', 'red');
      process.exit(1);
    }
    
    // Check if .env.local exists
    if (!fs.existsSync(path.join(projectRoot, '.env.local'))) {
      log('\n⚠️  Warning: .env.local not found. NOVA may not function properly without environment variables.', 'yellow');
    }
    
    // Display startup info
    log('\n📋 Starting HELiiX-OS with:', 'blue');
    log('   • NOVA AI Assistant integrated', 'dim');
    log('   • Hot reload enabled', 'dim');
    log('   • Port: 3002', 'dim');
    log('   • Database: Supabase (remote)', 'dim');
    log('   • AI Models: Claude 3.5, GPT-4, Gemini, Perplexity', 'dim');
    
    // Pull latest images (optional)
    log('\n📥 Pulling latest base images...', 'blue');
    const pull = spawn('docker', ['compose', 'pull'], { stdio: 'inherit' });
    
    await new Promise((resolve) => {
      pull.on('close', resolve);
    });
    
    // Start the dev server
    log('\n🏗️  Building and starting HELiiX-OS development server...', 'green');
    log('   This may take a few minutes on first run...', 'dim');
    
    const dockerCompose = spawn('docker', [
      'compose',
      '--profile', 'dev',
      'up',
      'heliix-os-dev'
    ], {
      stdio: 'inherit',
      env: { ...process.env }
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      log('\n\n🛑 Shutting down HELiiX-OS...', 'yellow');
      spawn('docker', ['compose', 'down'], { stdio: 'inherit' });
      process.exit(0);
    });
    
    dockerCompose.on('error', (error) => {
      log(`\n❌ Error: ${error.message}`, 'red');
      process.exit(1);
    });
    
    dockerCompose.on('close', (code) => {
      if (code !== 0 && code !== null) {
        log(`\n❌ Docker compose exited with code ${code}`, 'red');
        log('\n💡 Troubleshooting tips:', 'yellow');
        log('   • Check if port 3002 is already in use', 'dim');
        log('   • Run "docker compose logs heliix-os-dev" for detailed logs', 'dim');
        log('   • Try "docker compose down" and restart', 'dim');
      }
    });
    
    // Show success message after a delay
    setTimeout(() => {
      logSection('✨ HELiiX-OS is starting up!');
      log('🌐 Access HELiiX-OS at:', 'green');
      log('   • Dashboard: http://localhost:3002', 'bright');
      log('   • NOVA Assistant: http://localhost:3002/ai-personal-assistant', 'bright');
      log('   • Operations: http://localhost:3002/operations', 'bright');
      log('\n📊 Monitor status:', 'blue');
      log('   • Logs: pnpm run docker:logs', 'dim');
      log('   • Shell: pnpm run docker:shell', 'dim');
      log('   • Restart: pnpm run docker:restart', 'dim');
      log('   • Health: http://localhost:3002/api/health', 'dim');
      log('\n⌨️  Press Ctrl+C to stop the server', 'yellow');
    }, 5000);
    
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the command
main();