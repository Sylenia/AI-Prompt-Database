const fs = require('fs');
const path = require('path');

// === CONFIGURABLE VARIABLES ===
const rootDir = '.'; // change to your root folder
const category = 'writing';
const idPrefix = 'writing';
const author = 'Csaba Farkas';
const defaultDifficulty = 'Intermediate';
const schemaType = 'TechArticle';
const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

let fileCounter = 1;

function kebabCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function extractMetadata(content) {
  const lines = content.split('\n');
  let title = '';
  let description = '';

  for (let line of lines) {
    if (!title && line.startsWith('# ')) {
      title = line.replace(/^# /, '').trim();
      continue;
    }
    if (!description && line.trim() && !line.startsWith('#')) {
      description = line.trim();
    }
    if (title && description) break;
  }

  return {
    title,
    slug: kebabCase(title),
    description,
  };
}

function hasFrontmatter(content) {
  return content.startsWith('---\n');
}

function injectYAML(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  if (hasFrontmatter(raw)) {
    console.log(`⏭️  Skipped (YAML exists): ${filePath}`);
    return;
  }

  const { title, slug, description } = extractMetadata(raw);
  const id = `${idPrefix}-${fileCounter++}`;

  const yaml = `---\n` +
    `title: "${title}"\n` +
    `description: "${description}"\n` +
    `tags: []\n` +
    `category: "${category}"\n` +
    `author: "${author}"\n` +
    `slug: "${slug}"\n` +
    `id: "${id}"\n` +
    `seo_keywords: ""\n` +
    `date: "${date}"\n` +
    `difficulty: "${defaultDifficulty}"\n` +
    `schema_type: "${schemaType}"\n` +
    `---\n\n`;

  fs.writeFileSync(filePath, yaml + raw, 'utf8');
  console.log(`✅ Injected: ${filePath}`);
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && fullPath.endsWith('.md')) {
      injectYAML(fullPath);
    }
  }
}

walk(rootDir);