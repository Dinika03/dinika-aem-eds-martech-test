/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-partners.
 * Base block: cards
 * Source: https://remarketabletemplateaepdinika.netlify.app/
 * Generated: 2026-07-23
 *
 * Library structure (cards): 2 columns.
 *   Row 1: block name.
 *   Each subsequent row = one logo card: cell 1 logo image, cell 2 empty text cell.
 *
 * Source: partner logos live in .partner-container divs (grouped into
 * .home-column* wrappers), each holding a single .partner-image logo.
 */
export default function parse(element, { document }) {
  // Each logo card is a .partner-container holding a logo image
  const logoContainers = Array.from(element.querySelectorAll('.partner-container'));

  // Empty-block guard
  if (logoContainers.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  logoContainers.forEach((container) => {
    const logo = container.querySelector('img');
    if (!logo) return;
    // 2-column card row: [ logo cell, empty text cell ]
    cells.push([logo, '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-partners', cells });
  element.replaceWith(block);
}
