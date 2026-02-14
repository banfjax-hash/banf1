const fs = require('fs');
const content = fs.readFileSync('node_modules/@wix/cli/build/chunk-GJPBL3NK.js', 'utf8');
const lines = content.split('\n');

// Search for DevEnvironment, pulling, syncing
console.log('=== DevEnvironment.tsx logic ===\n');

// Look at the dev-ZDHKXB6F.js or DevCommand files for pull/sync logic
const devFile = fs.readFileSync('node_modules/@wix/cli/build/dev-ZDHKXB6F.js', 'utf8');
const devLines = devFile.split('\n');

// Search for pull, sync, download references
for (let i = 0; i < devLines.length; i++) {
  if (devLines[i].includes('pull') || devLines[i].includes('sync') || 
      devLines[i].includes('download') || devLines[i].includes('fetchSite') ||
      devLines[i].includes('getSite') || devLines[i].includes('loadSite')) {
    const start = Math.max(0, i - 2);
    const end = Math.min(devLines.length - 1, i + 3);
    for (let j = start; j <= end; j++) {
      console.log(`L${j+1}: ${devLines[j].substring(0, 300)}`);
    }
    console.log('---');
  }
}

// Also check DevCommand files
const devCmdFiles = ['DevCommand-IHLJIGCS.js', 'DevCommand-MTZ46PZQ.js', 'DevCommand-POGXYBHH.js'];
for (const dcf of devCmdFiles) {
  const dcContent = fs.readFileSync(`node_modules/@wix/cli/build/${dcf}`, 'utf8');
  if (dcContent.includes('pull') || dcContent.includes('cloudToLocal') || dcContent.includes('fetchPages')) {
    console.log(`\n=== ${dcf} has pull/cloud references ===`);
    const dcLines = dcContent.split('\n');
    for (let i = 0; i < dcLines.length; i++) {
      if (dcLines[i].includes('pull') || dcLines[i].includes('cloudToLocal') || 
          dcLines[i].includes('fetchPages') || dcLines[i].includes('applyExternalUpdates')) {
        const start = Math.max(0, i - 1);
        const end = Math.min(dcLines.length - 1, i + 3);
        for (let j = start; j <= end; j++) {
          console.log(`  L${j+1}: ${dcLines[j].substring(0, 300)}`);
        }
        console.log('  ---');
      }
    }
  }
}

// Look at chunk-GJPBL3NK for DevEnvironment which is at L46
console.log('\n=== DevEnvironment component context ===');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('DevEnvironment') || lines[i].includes('applyExternalUpdates') || lines[i].includes('cloudUpdate')) {
    const start = Math.max(0, i - 2);
    const end = Math.min(lines.length - 1, i + 5);
    for (let j = start; j <= end; j++) {
      console.log(`L${j+1}: ${lines[j].substring(0, 300)}`);
    }
    console.log('---');
  }
}
