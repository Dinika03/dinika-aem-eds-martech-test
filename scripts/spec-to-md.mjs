#!/usr/bin/env node
/**
 * Converts a data-layer Excel spec into a text spec (.spec.md) the Copilot
 * agent can read. Deterministic: the .xlsx stays the source of truth.
 *
 * Handles workbooks with MULTIPLE data-layer sheets: every sheet whose header
 * row contains a "Data Layer Element" column is parsed, and each is rendered as
 * its own `## Sheet: <name>` section in the output.
 *
 * Usage:
 *   npm i -D xlsx        # once
 *   node scripts/spec-to-md.mjs <path-to.xlsx> [block-name]
 *
 * If block-name is omitted it is derived from the file name.
 * Output: datalayer-specs/<block-name>.spec.md
 */
import XLSX from 'xlsx';
import { writeFileSync, mkdirSync } from 'node:fs';
import { basename } from 'node:path';

const [, , xlsxPath, blockArg] = process.argv;
if (!xlsxPath) {
  console.error('Usage: node scripts/spec-to-md.mjs <path-to.xlsx> [block-name]');
  process.exit(1);
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const blockName = blockArg || slug(basename(xlsxPath).replace(/\.[^.]+$/, ''));

const wb = XLSX.readFile(xlsxPath);

// Read every sheet as arrays-of-arrays (header:1), trimmed strings.
const sheets = {};
for (const name of wb.SheetNames) {
  sheets[name] = XLSX.utils
    .sheet_to_json(wb.Sheets[name], { header: 1, blankrows: false, defval: '' })
    .map((r) => r.map((c) => String(c ?? '').trim()));
}

// Strip wrapping quotes and pull the meaningful token out of the sheet's raw text.
const clean = (s = '') => s.replace(/^["']|["']$/g, '').trim();
const eventValue = (s = '') => (s.match(/'event'\s*:\s*'([^']*)'/) || [, clean(s)])[1];
const elementPath = (s = '') => (s.match(/'([^']+)'\s*:/) || [, clean(s)])[1];

/**
 * Parse a single data-layer sheet (array-of-arrays) into a list of events.
 * Returns null if the sheet has no "Data Layer Element" header.
 */
function parseSheet(rows) {
  const headerIdx = rows.findIndex((r) => r.includes('Data Layer Element'));
  if (headerIdx === -1) return null;

  const hdr = rows[headerIdx];
  const idx = (name, occurrence = 0) =>
    hdr.reduce((acc, c, i) => (c === name ? [...acc, i] : acc), [])[occurrence];

  const ceCol = idx('Custom Event');
  const dleCol = idx('Data Layer Element');
  const evCol = idx('Example Value');
  const defCols = hdr.reduce((acc, c, i) => (c === 'Definition' ? [...acc, i] : acc), []);
  const triggerCol = defCols[0]; // Definition between Custom Event and Data Layer Element
  const ruleCol = defCols[1]; // Definition after Example Value

  const events = [];
  let cur = null;
  for (const r of rows.slice(headerIdx + 1)) {
    const ce = r[ceCol] ?? '';
    if (ce.toLowerCase().startsWith('code snippet')) break;
    if (ce) {
      cur = { event: eventValue(ce), trigger: r[triggerCol] ?? '', elements: [] };
      events.push(cur);
    }
    const el = r[dleCol] ?? '';
    if (el && cur) {
      cur.elements.push({
        path: elementPath(el),
        example: clean(r[evCol] ?? ''),
        rule: r[ruleCol] ?? '',
      });
    }
  }
  return events;
}

// Parse EVERY sheet that looks like a data-layer sheet.
const dlSheets = [];
for (const [name, rows] of Object.entries(sheets)) {
  const events = parseSheet(rows);
  if (events && events.length) {
    dlSheets.push({ name, events });
  }
}
if (!dlSheets.length) {
  console.error('Could not find any sheet containing a "Data Layer Element" column with events.');
  process.exit(1);
}

// Optional: tracking requirement text from a "Tracking Requirements" sheet.
const trackingSheet = Object.entries(sheets).find(([n]) => /tracking/i.test(n));
const tracking = trackingSheet
  ? trackingSheet[1].slice(1).map((r) => r.filter(Boolean).join(' — ')).filter(Boolean)
  : [];

// Component-name string: example value of any element ending in "eventComponent",
// searched across all sheets.
const componentEl = dlSheets
  .flatMap((s) => s.events)
  .flatMap((e) => e.elements)
  .find((e) => /component$/i.test(e.path));
const componentName = componentEl ? componentEl.example : blockName;

// Render markdown — one section per data-layer sheet.
let md = `# Data layer spec — ${blockName}\n\n`;
md += `- **Block / component name:** \`${blockName}\`\n`;
md += `- **Component name string:** \`${componentName}\`\n`;
md += `- **Data-layer sheets:** ${dlSheets.map((s) => s.name).join(', ')}\n\n`;
if (tracking.length) {
  md += `## Tracking requirements\n\n${tracking.map((t) => `- ${t}`).join('\n')}\n\n`;
}

for (const sheet of dlSheets) {
  md += `## Sheet: ${sheet.name}\n\n`;
  for (const e of sheet.events) {
    md += `### Event: \`${e.event}\`\n\n**Trigger:** ${e.trigger}\n\n`;
    md += '| Data Layer Element | Example Value | Value rule |\n';
    md += '| --- | --- | --- |\n';
    for (const el of e.elements) {
      md += `| \`${el.path}\` | \`${el.example}\` | ${el.rule} |\n`;
    }
    md += '\n';
  }
}

mkdirSync('datalayer-specs', { recursive: true });
const out = `datalayer-specs/${blockName}.spec.md`;
writeFileSync(out, md);
console.log(`Wrote ${out}`);
console.log(`Sheets: ${dlSheets.map((s) => `${s.name} (${s.events.length} event(s))`).join(', ')}`);
