/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cta-band. Custom block. Source: https://www.edc.ca/ (section.c-triage-cta).
 * A single linked band: heading + CTA link (whole band linked to /en/solutions-finder.html).
 * Structure: 1 column, single row = heading + link.
 *   Row 1: block name (auto)
 *   Row 2: single cell = heading + CTA link
 * Generated: 2026-07-24
 */
export default function parse(element, { document }) {
  const bandLink = element.querySelector('a.triage-cta-link, a[href]');
  const content = element.querySelector('.content-wrapper') || element;
  const heading = content.querySelector('.title-wrapper h2, h2, h3, .title, [class*="title"]');

  const contentCell = [];
  if (heading) contentCell.push(heading);

  if (bandLink && bandLink.getAttribute('href')) {
    const link = document.createElement('a');
    link.href = bandLink.getAttribute('href');
    const label = (bandLink.textContent || '').trim() || (heading && heading.textContent.trim()) || 'Learn more';
    link.textContent = label;
    contentCell.push(link);
  }

  if (!contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[contentCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'cta-band', cells });
  element.replaceWith(block);
}
