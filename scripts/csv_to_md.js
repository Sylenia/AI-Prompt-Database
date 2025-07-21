const fs = require('fs');
const path = require('path');

const csvFile = './vibeprompts.csv';
const outputDir = '.';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// Read and parse CSV
const rows = fs.readFileSync(csvFile, 'utf8').split('\n').filter(Boolean);
const headers = rows[0].split(',');

for (let i = 1; i < rows.length; i++) {
  // Handle quoted commas in fields
  let values = [];
  let current = '';
  let inQuotes = false;
  for (const char of rows[i]) {
    if (char === '"') inQuotes = !inQuotes;
    else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);

  // Map columns to object
  const row = {};
  headers.forEach((h, idx) => row[h.trim()] = (values[idx] || '').trim());

  // Use 'act' as the title
  const safeTitle = row.act ? row.act : 'untitled';
  const baseName = safeTitle
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+/g, '_');
  const filename = `${baseName}_${i}.md`;

  const mdContent = `# ${safeTitle}\n\n${row.prompt || ''}\n`;

  fs.writeFileSync(path.join(outputDir, filename), mdContent, 'utf8');
  console.log(`Created: ${filename}`);
}