/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-steps (our-offer-page variant).
 * Base block: columns
 * Source: https://remarketabletemplateaepdinika.netlify.app/our-offer-page
 * Selector: steps2-wrapper
 * Generated: 2026-07-24
 *
 * Library structure (columns): first row = block name; subsequent rows split
 * content into side-by-side cells (same number of cells per row).
 *
 * Source variation (teleporthq steps2): a two-column grid
 * (.steps2-container2). Left cell = section header
 * (.steps2-section-header: h2 + p + CTA button). Right cell = four numbered
 * step cards (.steps2-container3 > .thq-card), each with an <h2> title, a
 * <span> description, and a numeric <label>. Both are placed side by side in a
 * single 2-column content row. The CTA button is converted to an anchor so its
 * label survives.
 */
export default function parse(element, { document }) {
  const header = element.querySelector('[class*="section-header"]');
  const stepsContainer = element.querySelector('[class*="steps2-container3"]');

  // Empty-block guard
  if (!header && !stepsContainer) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // LEFT CELL: header column (heading + text + CTA).
  const leftCell = [];
  if (header) {
    const heading = header.querySelector('h1, h2, h3, [class*="heading"]');
    const paras = Array.from(header.querySelectorAll('p, [class*="body-large"]'));
    if (heading) leftCell.push(heading);
    paras.forEach((p) => leftCell.push(p));

    const ctaBtn = header.querySelector('button');
    if (ctaBtn) {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = (ctaBtn.textContent || '').trim();
      if (a.textContent) leftCell.push(a);
    }
  }

  // RIGHT CELL: the four numbered step cards.
  const rightCell = [];
  if (stepsContainer) {
    const stepCards = Array.from(stepsContainer.querySelectorAll('[class*="thq-card"], [class*="steps2-container4"], [class*="steps2-container5"], [class*="steps2-container6"], [class*="steps2-container7"]'));
    // De-duplicate (thq-card and stepN selectors can both match the same node).
    const seen = new Set();
    stepCards.forEach((cardEl) => {
      if (seen.has(cardEl)) return;
      seen.add(cardEl);

      const num = cardEl.querySelector('label, [class*="heading-3"]');
      const title = cardEl.querySelector('h1, h2, h3, [class*="heading-2"]');
      const desc = cardEl.querySelector('span[class*="body"], span, p');

      if (num && num.textContent.trim()) {
        const numP = document.createElement('p');
        numP.textContent = num.textContent.trim();
        rightCell.push(numP);
      }
      if (title) rightCell.push(title);
      if (desc) rightCell.push(desc);
    });
  }

  const cells = [];
  // 2-column content row: [ header column, steps column ]
  cells.push([leftCell, rightCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-steps', cells });
  element.replaceWith(block);
}
