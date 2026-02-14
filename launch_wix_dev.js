#!/usr/bin/env node
/**
 * Wix Dev Launcher - Patches TTY/raw mode requirement for non-interactive terminals
 * Run with: node launch_wix_dev.js
 */

// Patch stdin to fake TTY support BEFORE anything else loads
if (!process.stdin.isTTY) {
  process.stdin.isTTY = true;
  process.stdin.setRawMode = function(mode) { return this; };
  process.stdout.isTTY = true;
  process.stderr.isTTY = true;
  // Fake columns/rows for Ink rendering
  if (!process.stdout.columns) process.stdout.columns = 120;
  if (!process.stdout.rows) process.stdout.rows = 30;
  if (!process.stderr.columns) process.stderr.columns = 120;
  if (!process.stderr.rows) process.stderr.rows = 30;
}

// Set environment
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
process.env.FORCE_COLOR = '0'; // Disable color codes for cleaner output

// Now load and run the Wix CLI dev command
const path = require('path');
const wixCliBin = path.join(__dirname, 'node_modules', '.bin', 'wix');

// Use child_process.fork to run wix CLI with our patched process
const { spawn } = require('child_process');

const child = spawn(process.execPath, [
  // Pass the TTY patches via --require
  '-e',
  `
  // Patch TTY before Wix CLI loads
  if (!process.stdin.isTTY) {
    process.stdin.isTTY = true;
    process.stdin.setRawMode = function(mode) { return this; };
  }
  if (!process.stdout.isTTY) {
    process.stdout.isTTY = true;
    process.stdout.columns = 120;
    process.stdout.rows = 30;
  }
  if (!process.stderr.isTTY) {
    process.stderr.isTTY = true;
    process.stderr.columns = 120;
    process.stderr.rows = 30;
  }
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  process.env.FORCE_COLOR = '0';
  
  // Load wix CLI
  const path = require('path');
  const cliPath = path.resolve('node_modules/@wix/cli/build/cli.cjs');
  process.argv = [process.execPath, 'wix', 'dev'];
  require(cliPath);
  `
], {
  cwd: __dirname,
  stdio: ['pipe', 'inherit', 'inherit'],
  env: {
    ...process.env,
    NODE_TLS_REJECT_UNAUTHORIZED: '0',
    FORCE_COLOR: '0'
  }
});

child.on('exit', (code) => {
  console.log(`\nWix dev exited with code ${code}`);
  process.exit(code || 0);
});

// Keep alive - don't let the parent exit
process.on('SIGINT', () => {
  child.kill('SIGINT');
});
