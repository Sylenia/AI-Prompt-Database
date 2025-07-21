const fs = require('fs');
const path = require('path');

// Replace with your actual directory path
const dir = '.';

function filenameToTitle(filename) {
  const base = filename.replace(/\.md$/, '');
  return (
    base
      .replace(/[_\-\.]+/g, ' ')         // underscores, dashes, dots to space
      .replace(/[^a-zA-Z0-9 ]+/g, '')    // remove other special chars
      .replace(/\s+/g, ' ')              // collapse multiple spaces
      .trim()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  );
}

fs.readdirSync(dir)
  .filter(f => f.endsWith('.md'))
  .forEach(file => {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const title = filenameToTitle(file);

    // Check if file already starts with correct header
    const firstLine = content.split('\n')[0].trim();
    if (firstLine === `# ${title}`) {
      return; // Skip, already has correct header
    }

    // Insert the header at the top
    const newContent = `# ${title}\n\n${content}`;
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Header added to ${file}`);
  });