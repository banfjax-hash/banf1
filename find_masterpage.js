const fs = require('fs');
const path = require('path');

// Find anyide-cli-file-structure package
function findPackage(dir, target, depth = 0) {
  if (depth > 6) return [];
  let results = [];
  try {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      if (entry === '.git' || entry === '.wix') continue;
      const full = path.join(dir, entry);
      if (entry === target) {
        results.push(full);
      } else if (depth < 6) {
        try {
          if (fs.statSync(full).isDirectory()) {
            results = results.concat(findPackage(full, target, depth + 1));
          }
        } catch(e) {}
      }
    }
  } catch(e) {}
  return results;
}

console.log('=== Searching for anyide-cli-file-structure ===');
const found = findPackage('node_modules', 'anyide-cli-file-structure');
console.log('Found:', found.length ? found.join('\n') : 'NOT FOUND');

// Also search for cli-site
console.log('\n=== Searching for cli-site ===');
const found2 = findPackage('node_modules', 'cli-site');
console.log('Found:', found2.length ? found2.join('\n') : 'NOT FOUND');

// Read the document.js from stack trace path structure
// The error says: node_modules\node_modules\@wix\anyide-cli-file-structure
// That double node_modules is suspicious
console.log('\n=== Checking double node_modules ===');
const doubleNM = path.join('node_modules', 'node_modules');
console.log('Exists:', fs.existsSync(doubleNM));

// Check @wix/cli internal structure
console.log('\n=== @wix/cli internal packages ===');
const cliNM = path.join('node_modules', '@wix', 'cli', 'node_modules');
if (fs.existsSync(cliNM)) {
  const dirs = fs.readdirSync(cliNM);
  const wixPkgs = dirs.filter(d => d === '@wix');
  if (wixPkgs.length > 0) {
    const inner = fs.readdirSync(path.join(cliNM, '@wix'));
    console.log('@wix/cli nested @wix packages:', inner.join(', '));
    
    // Check for anyide
    if (inner.includes('anyide-cli-file-structure')) {
      const docPath = path.join(cliNM, '@wix', 'anyide-cli-file-structure', 'dist', 'document', 'document.js');
      if (fs.existsSync(docPath)) {
        console.log('\n=== document.js CONTENT ===');
        console.log(fs.readFileSync(docPath, 'utf8'));
      }
    }
    
    // Check for cli-site
    if (inner.includes('cli-site')) {
      const sitePath = path.join(cliNM, '@wix', 'cli-site');
      console.log('\n=== cli-site files ===');
      const siteFiles = fs.readdirSync(sitePath);
      console.log(siteFiles.join(', '));
      
      // Check site-fs-manager
      const fsMgr = path.join(sitePath, 'src', 'site-fs-manager.ts');
      if (fs.existsSync(fsMgr)) {
        console.log('\n=== site-fs-manager.ts (first 80 lines) ===');
        const lines = fs.readFileSync(fsMgr, 'utf8').split('\n').slice(0, 80);
        console.log(lines.join('\n'));
      }
    }
  } else {
    console.log('Dirs in cli/node_modules:', dirs.slice(0, 20).join(', '));
  }
} else {
  console.log('No nested node_modules in @wix/cli');
  // Check if cli is bundled
  const cliDir = path.join('node_modules', '@wix', 'cli');
  if (fs.existsSync(cliDir)) {
    const cliFiles = fs.readdirSync(cliDir);
    console.log('@wix/cli contents:', cliFiles.join(', '));
  }
}

// Check src/pages structure expected by wix
console.log('\n=== src/pages files ===');
const pagesDir = path.join('src', 'pages');
if (fs.existsSync(pagesDir)) {
  console.log(fs.readdirSync(pagesDir).join('\n'));
}
