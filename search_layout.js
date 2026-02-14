const fs = require('fs');
const content = fs.readFileSync('node_modules/@wix/cli/build/chunk-GJPBL3NK.js', 'utf8');
const lines = content.split('\n');

// Search for GitHub layout, GridAppLayout, and page structure
console.log('=== GitHub / GridApp Layout ===\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('GridAppLayout') || line.includes('GITHUB') || line.includes('github')) {
    const start = Math.max(0, i - 2);
    const end = Math.min(lines.length - 1, i + 5);
    for (let j = start; j <= end; j++) {
      console.log(`L${j+1}: ${lines[j].substring(0, 300)}`);
    }
    console.log('---');
  }
}

console.log('\n=== Page paths / structure for site type ===\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('getPageFilesPaths') || line.includes('getPagesPathsForType') || line.includes('pagesDir')) {
    const start = Math.max(0, i - 2);
    const end = Math.min(lines.length - 1, i + 10);
    for (let j = start; j <= end; j++) {
      console.log(`L${j+1}: ${lines[j].substring(0, 300)}`);
    }
    console.log('---');
  }
}

console.log('\n=== State pages getAll ===\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('getAll') && (lines[Math.max(0,i-5)]+lines[i]+lines[Math.min(lines.length-1,i+5)]).includes('page')) {
    const start = Math.max(0, i - 3);
    const end = Math.min(lines.length - 1, i + 5);
    for (let j = start; j <= end; j++) {
      console.log(`L${j+1}: ${lines[j].substring(0, 300)}`);
    }
    console.log('---');
  }
}
