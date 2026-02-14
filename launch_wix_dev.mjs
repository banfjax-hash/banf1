#!/usr/bin/env node
/**
 * Wix Dev Launcher - Patches TTY/raw mode and prevents Ink unmount
 * 
 * Root Cause: Ink's unmount() gets called through 3 paths:
 *   1. render2's process.once('SIGINT'/beforeExit') → unmount()
 *   2. signal-exit emitter 'exit' event → Ink.unmount (registered in constructor)
 *   3. useExit() → AppContext.exit → App.handleExit → props.onExit (= Ink.unmount)
 *      Triggered by: DevEnvironmentProvider's onConnectionError, useAsync onError, etc.
 * 
 * Fix: Capture the Ink instance and replace unmount() with a guarded no-op.
 * This blocks ALL three paths at the root — unmount simply won't execute
 * unless we explicitly allow it (on user SIGINT).
 */

// === PATCH TTY BEFORE ANYTHING LOADS ===
if (!process.stdin.isTTY) {
  Object.defineProperty(process.stdin, 'isTTY', { value: true, writable: true });
}
if (!process.stdin.setRawMode) {
  process.stdin.setRawMode = function(mode) { return this; };
} else {
  const origSetRawMode = process.stdin.setRawMode.bind(process.stdin);
  process.stdin.setRawMode = function(mode) {
    try { return origSetRawMode(mode); } catch(e) { return this; }
  };
}
if (!process.stdout.isTTY) {
  Object.defineProperty(process.stdout, 'isTTY', { value: true, writable: true });
}
if (!process.stderr.isTTY) {
  Object.defineProperty(process.stderr, 'isTTY', { value: true, writable: true });
}
// Ensure terminal dimensions
if (!process.stdout.columns) {
  Object.defineProperty(process.stdout, 'columns', { value: 120, writable: true });
}
if (!process.stdout.rows) {
  Object.defineProperty(process.stdout, 'rows', { value: 30, writable: true });
}
if (!process.stderr.columns) {
  Object.defineProperty(process.stderr, 'columns', { value: 120, writable: true });
}
if (!process.stderr.rows) {
  Object.defineProperty(process.stderr, 'rows', { value: 30, writable: true });
}

// Set environment
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
process.env.FORCE_COLOR = '0';

// Ensure CWD is the project directory
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
process.chdir(__dirname);

// Set argv to simulate "wix dev"
process.argv = [process.execPath, 'wix', 'dev'];
process.setSourceMapsEnabled(true);

// === STATE ===
const _originalExit = process.exit;
let userRequestedShutdown = false;  // Only true on manual SIGINT
let inkInstance = null;              // Will hold the captured Ink instance
let originalUnmount = null;         // Original unmount method

// === INTERCEPT process.exit ===
process.exit = function patchedExit(code) {
  console.log(`[launcher] process.exit(${code}) intercepted — suppressed`);
};

// === INTERCEPT process.once — block render2's SIGINT/beforeExit handlers ===
const _origOnce = process.once.bind(process);
process.once = function patchedOnce(event, listener) {
  if (event === 'SIGINT' || event === 'beforeExit') {
    console.log(`[launcher] BLOCKED process.once("${event}") — preventing unmount registration`);
    return process;
  }
  return _origOnce(event, listener);
};

// === CAPTURE INK INSTANCE VIA WeakMap.prototype.set INTERCEPTION ===
// Ink stores its instance in a WeakMap keyed by process.stdout:
//   instances_default.set(stdout, instance)  (instances is a WeakMap)
// We intercept WeakMap.prototype.set to find any value with an 'unmount' method
// stored with process.stdout as key — that's our Ink instance.
const _origWeakMapSet = WeakMap.prototype.set;
WeakMap.prototype.set = function patchedWeakMapSet(key, value) {
  // Detect Ink instance being stored (keyed by process.stdout, has unmount method)
  if (key === process.stdout && value && typeof value.unmount === 'function' && typeof value.waitUntilExit === 'function') {
    console.log(`[launcher] ✅ Captured Ink instance via WeakMap.set interception`);
    inkInstance = value;
    originalUnmount = value.unmount.bind(value);
    
    // Replace unmount with guarded version
    value.unmount = function guardedUnmount(error) {
      if (userRequestedShutdown) {
        console.log(`[launcher] User-requested shutdown — allowing unmount`);
        return originalUnmount(error);
      }
      // Log but DO NOT unmount
      const source = error ? `error: ${error.message || error}` : 'no error';
      console.log(`[launcher] 🛡️ BLOCKED Ink unmount (${source}) at ${new Date().toISOString()}`);
      // Don't call originalUnmount — this prevents waitUntilExit from resolving
    };
    
    // Restore WeakMap.prototype.set now that we've captured the instance
    WeakMap.prototype.set = _origWeakMapSet;
  }
  return _origWeakMapSet.call(this, key, value);
};

// === KEEP-ALIVE ===
const keepAlive = setInterval(() => {}, 30000);
process.stdin.resume();
process.stdin.on('end', () => process.stdin.resume());
process.stdin.on('error', () => {});

// === SIGNAL HANDLERS ===
process.on('SIGINT', () => {
  console.log('[launcher] SIGINT — shutting down');
  userRequestedShutdown = true;
  clearInterval(keepAlive);
  if (originalUnmount) {
    originalUnmount();  // Clean unmount
    setTimeout(() => _originalExit(0), 1000);
  } else {
    _originalExit(0);
  }
});
process.on('SIGTERM', () => {
  console.log('[launcher] SIGTERM — shutting down');
  userRequestedShutdown = true;
  clearInterval(keepAlive);
  if (originalUnmount) {
    originalUnmount();
    setTimeout(() => _originalExit(0), 1000);
  } else {
    _originalExit(0);
  }
});

// Prevent signal-exit from auto-firing when it's the only listener
process.on('SIGHUP', () => {});

// === BLOCK signal-exit emitter's 'exit' events too (belt and suspenders) ===
const patchSignalExitEmitter = () => {
  if (process.__signal_exit_emitter__) {
    const emitter = process.__signal_exit_emitter__;
    const origEmit = emitter.emit.bind(emitter);
    emitter.emit = function(event, ...args) {
      if (event === 'exit' && !userRequestedShutdown) {
        console.log(`[launcher] 🛡️ BLOCKED signal-exit emit("exit") — suppressed`);
        return false;
      }
      return origEmit(event, ...args);
    };
    console.log(`[launcher] Patched signal-exit emitter`);
    return true;
  }
  return false;
};
const patchInterval = setInterval(() => {
  if (patchSignalExitEmitter()) clearInterval(patchInterval);
}, 50);

// === LAUNCH ===
console.log('[launcher] Starting Wix Dev...');
console.log('[launcher] CWD:', process.cwd());
console.log('[launcher] Time:', new Date().toISOString());

const cliPath = new URL('./node_modules/@wix/cli/build/index.js', import.meta.url).href;
import(cliPath).then(() => {
  // If we get here, waitUntilExit() resolved — meaning unmount happened
  // This should NOT happen with our guards, but if it does, keep alive anyway
  console.log(`[launcher] ⚠️ CLI module completed (Ink unmounted) at ${new Date().toISOString()}`);
  console.log('[launcher] keepAlive interval keeps process alive');
  console.log('[launcher] Ink instance captured:', !!inkInstance);
}).catch(err => {
  console.error('[launcher] Failed to load Wix CLI:', err.message);
  console.error(err.stack);
  clearInterval(keepAlive);
  _originalExit(1);
});
