#!/usr/bin/env node
/**
 * Converts a data-layer Excel spec into a text spec (.spec.md) the Copilot
 * agent can read. Deterministic: the .xlsx stays the source of truth.
 *
 * Usage:
 *   npm i -D xlsx        # once
 *   node scripts/spec-to-md.mjs <path-to.xlsx> [block-name]
 *
 * If block-name is omitted it is derived from the file name.
 * Output: datalayer-specs/<block-name>.spec.md
 */
import * as XLSX from 'xlsx';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { basename } from 'node:path';

const [, , xlsxPath, blockArg] = process.argv;
if (!xlsxPath) {
  console.error('Usage: node scripts/spec-to-md.mjs <path-to.xlsx> [block-name]');
  process.exit(1);
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const blockName = blockArg || slug(basename(xlsxPath).replace(/\.[^.]+$/, ''));

const workbookBuffer = readFileSync(xlsxPath);
const wb = XLSX.read(workbookBuffer, { type: 'buffer' });

// Read every sheet as arrays-of-arrays (header:1), trimmed strings.
const sheets = {};
for (const name of wb.SheetNames) {
  sheets[name] = XLSX.utils
    .sheet_to_json(wb.Sheets[name], { header: 1, blankrows: false, defval: '' })
    .map((r) => r.map((c) => String(c ?? '').trim()));
}

// Locate the Data Layer sheet (the one whose header contains "Data Layer Element").
const dlEntry = Object.entries(sheets).find(([, rows]) =>
  rows.some((r) => r.includes('Data Layer Element')),
);
if (!dlEntry) {
  console.error('Could not find a sheet containing a "Data Layer Element" column.');
  process.exit(1);
}
const [dlSheetName, rows] = dlEntry;

const headerIdx = rows.findIndex((r) => r.includes('Data Layer Element'));
const hdr = rows[headerIdx];
const idx = (name, occurrence = 0) =>
  hdr.reduce((acc, c, i) => (c === name ? [...acc, i] : acc), [])[occurrence];

const ceCol = idx('Custom Event');
const dleCol = idx('Data Layer Element');
const evCol = idx('Example Value');
const defCols = hdr.reduce((acc, c, i) => (c === 'Definition' ? [...acc, i] : acc), []);
const triggerCol = defCols[0]; // Definition between Custom Event and Data Layer Element
const ruleCol = defCols[1]; // Definition after Example Value

// Strip wrapping quotes and pull the meaningful token out of the sheet's raw text.
const clean = (s = '') => s.replace(/^["']|["']$/g, '').trim();
const eventValue = (s = '') => (s.match(/'event'\s*:\s*'([^']*)'/) || [, clean(s)])[1];
const elementPath = (s = '') => (s.match(/'([^']+)'\s*:/) || [, clean(s)])[1];

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

// Optional: tracking requirement text from a "Tracking Requirements" sheet.
const trackingSheet = Object.entries(sheets).find(([n]) => /tracking/i.test(n));
const tracking = trackingSheet
  ? trackingSheet[1].slice(1).map((r) => r.filter(Boolean).join(' — ')).filter(Boolean)
  : [];

// Component-name string: example value of an element ending in "eventComponent".
const componentEl = events
  .flatMap((e) => e.elements)
  .find((e) => /component$/i.test(e.path));
const componentName = componentEl ? componentEl.example : blockName;

// Render markdown.
let md = `# Data layer spec — ${blockName}\n\n`;
md += `- **Block / component name:** \`${blockName}\`\n`;
md += `- **Component name string:** \`${componentName}\`\n`;
md += `- **Source sheet:** ${dlSheetName}\n\n`;
if (tracking.length) {
  md += `## Tracking requirements\n\n${tracking.map((t) => `- ${t}`).join('\n')}\n\n`;
}
for (const e of events) {
  md += `## Event: \`${e.event}\`\n\n**Trigger:** ${e.trigger}\n\n`;
  md += '| Data Layer Element | Example Value | Value rule |\n';
  md += '| --- | --- | --- |\n';
  for (const el of e.elements) {
    md += `| \`${el.path}\` | \`${el.example}\` | ${el.rule} |\n`;
  }
  md += '\n';
}

mkdirSync('datalayer-specs', { recursive: true });
const out = `datalayer-specs/${blockName}.spec.md`;
writeFileSync(out, md);
console.log(`Wrote ${out}`);
console.log(`Events: ${events.map((e) => e.event).join(', ')}`);
