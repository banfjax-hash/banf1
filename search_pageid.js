const fs = require('fs');
const content = fs.readFileSync('node_modules/@wix/cli/build/chunk-GJPBL3NK.js', 'utf8');
const lines = content.split('\n');

// Search for getPageId function definition
console.log('=== getPageId function ===\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('var getPageId') || lines[i].includes('function getPageId')) {
    const start = Math.max(0, i - 2);
    const end = Math.min(lines.length - 1, i + 15);
    for (let j = start; j <= end; j++) {
      console.log(`L${j+1}: ${lines[j].substring(0, 300)}`);
    }
    console.log('---');
  }
}

// Also search for readWml  
console.log('\n=== readWml function ===\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('var readWml') || lines[i].includes('function readWml')) {
    const start = Math.max(0, i - 2);
    const end = Math.min(lines.length - 1, i + 20);
    for (let j = start; j <= end; j++) {
      console.log(`L${j+1}: ${lines[j].substring(0, 300)}`);
    }
    console.log('---');
  }
}

// Search for structure.xml parsing
console.log('\n=== structure.xml parsing ===\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('structure.xml') || lines[i].includes('parseXml') || lines[i].includes('parseStructure')) {
    const start = Math.max(0, i - 2);
    const end = Math.min(lines.length - 1, i + 5);
    for (let j = start; j <= end; j++) {
      console.log(`L${j+1}: ${lines[j].substring(0, 300)}`);
    }
    console.log('---');
  }
}

// Now search the GITHUB layout definition specifically
console.log('\n=== GITHUB layout (velo-github-layout-definitions) ===\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('velo-github-layout') || lines[i].includes('github-layout')) {
    const start = Math.max(0, i - 2);
    const end = Math.min(lines.length - 1, i + 30);
    for (let j = start; j <= end; j++) {
      console.log(`L${j+1}: ${lines[j].substring(0, 300)}`);
    }
    console.log('---');
  }
}
