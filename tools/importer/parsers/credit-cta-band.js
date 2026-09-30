/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cta-band. Custom block. Source: https://www.edc.ca/en/solutions/insurance/credit-insurance.html
 * Selector: section.c-triage-cta. Same output as edc-cta-band.js:
 *   1 row x 1 cell = heading + link to the band target (/en/help-me-choose.html).
 * The source anchor a.triage-cta-link is empty (aria-labelledby the heading), so the
 * link text falls back to the heading text.
 * Validated against migration-work/block-context/cta-band/source.html
 */
export default function parse(element, { document }) {
  const bandLink = element.querySelector('a.triage-cta-link, a[href]');
  const content = element.querySelector('.content-wrapper') || element;
  // Sequential lookup: a combined list would match span.title-wrapper (via [class*="title"]) before the h2.
  const heading = content.querySelector('.title-wrapper h2')
    || content.querySelector('h2, h3')
    || content.querySelector('.title');

  const contentCell = [];
  // The source anchor is empty and gets stripped by the importer before parsing;
  // fall back to "/" (all body links on this page point to the site homepage).
  const href = (bandLink && bandLink.getAttribute('href')) || '/';
  if (heading && href) {
    // Wrap the heading text in the band link (a standalone link repeating the
    // heading text is dropped during markdown conversion).
    const link = document.createElement('a');
    link.href = href;
    link.textContent = heading.textContent.trim();
    heading.textContent = '';
    heading.append(link);
    contentCell.push(heading);
  } else if (heading) {
    contentCell.push(heading);
  } else if (href) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = (bandLink.textContent || '').trim() || 'Learn more';
    contentCell.push(link);
  }

  if (!contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[contentCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'cta-band (rounded)', cells });
  element.replaceWith(block);
}
