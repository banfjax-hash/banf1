#!/usr/bin/env node
/**
 * Wix Dev Starter - Spawns wix dev as a child process with PTY-like stdin
 * 
 * This creates a proper child process with piped streams so the
 * Ink terminal UI can function without a real TTY.
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
process.env.FORCE_COLOR = '0';

console.log('[starter] Launching wix dev...');
console.log('[starter] CWD:', __dirname);

// Find npx
const isWindows = process.platform === 'win32';
const npxCmd = isWindows ? 'npx.cmd' : 'npx';

// Spawn wix dev as a child process with inherited stdio
// This allows the child to use the real terminal if available
const child = spawn(npxCmd, ['wix', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',  // Pass through stdin/stdout/stderr directly
  env: {
    ...process.env,
    NODE_TLS_REJECT_UNAUTHORIZED: '0',
    FORCE_COLOR: '0'
  },
  shell: false,
  windowsHide: false
});

child.on('error', (err) => {
  console.error('[starter] Failed to start wix dev:', err.message);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  console.log(`[starter] wix dev exited with code ${code}, signal ${signal}`);
  // Don't exit ourselves — restart after a delay
  if (code !== 0) {
    console.log('[starter] Restarting in 3 seconds...');
    setTimeout(() => {
      console.log('[starter] Restart not implemented — please re-run manually');
      process.exit(code || 1);
    }, 3000);
  } else {
    process.exit(0);
  }
});

// Keep this process alive
process.on('SIGINT', () => {
  child.kill('SIGINT');
});
process.on('SIGTERM', () => {
  child.kill('SIGTERM');
});
