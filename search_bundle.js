const fs = require('fs');
const path = require('path');

const buildDir = 'node_modules/@wix/cli/build';
const files = fs.readdirSync(buildDir).filter(f => f.endsWith('.js') && !f.endsWith('.map'));

console.log('Searching for "Missing master page" in bundled CLI code...\n');

for (const file of files) {
  const content = fs.readFileSync(path.join(buildDir, file), 'utf8');
  
  if (content.includes('Missing master page') || content.includes('masterPage') || content.includes('master_page')) {
    console.log(`=== FOUND in ${file} ===`);
    
    // Find the relevant lines
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('Missing master page') || lines[i].includes('masterPage') || lines[i].includes('master_page')) {
        // Print context around the match
        const start = Math.max(0, i - 2);
        const end = Math.min(lines.length - 1, i + 2);
        for (let j = start; j <= end; j++) {
          const line = lines[j].substring(0, 300); // truncate long lines
          console.log(`  L${j+1}: ${line}`);
        }
        console.log('  ---');
      }
    }
    console.log('');
  }
}

console.log('\n=== Also searching for "site document" pattern ===');
for (const file of files) {
  const content = fs.readFileSync(path.join(buildDir, file), 'utf8');
  if (content.includes('getSiteDocument') || content.includes('site-document') || content.includes('siteDocument')) {
    // Just note the file name
    const count = (content.match(/getSiteDocument|site-document|siteDocument/g) || []).length;
    console.log(`${file}: ${count} matches`);
  }
}
