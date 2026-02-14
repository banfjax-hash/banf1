const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('node_modules/@wix/cli/build/chunk-GJPBL3NK.js', 'utf8');
const lines = content.split('\n');

// Find getDocumentPages and surrounding context
console.log('=== getDocumentPages and getSiteDocument context ===\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('getDocumentPages') || 
      lines[i].includes('getSiteDocument') ||
      lines[i].includes('masterPage') ||
      lines[i].includes('pageJsonFileName') ||
      lines[i].includes('pages_dir') ||
      lines[i].includes('.json')) {
    // Print more context
    const start = Math.max(0, i - 3);
    const end = Math.min(lines.length - 1, i + 3);
    for (let j = start; j <= end; j++) {
      const line = lines[j].substring(0, 400);
      const marker = j === i ? '>>>' : '   ';
      console.log(`${marker} L${j+1}: ${line}`);
    }
    console.log('---');
  }
}

// Also search for file path patterns for pages
console.log('\n=== Page file patterns ===');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('.json') && (lines[i].includes('page') || lines[i].includes('Page'))) {
    const line = lines[i].substring(0, 400);
    console.log(`L${i+1}: ${line}`);
  }
}
