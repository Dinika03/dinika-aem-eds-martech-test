/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-media.
 * Base block: columns
 * Source: https://remarketabletemplateaepdinika.netlify.app/
 * Generated: 2026-07-23
 *
 * Library structure (columns): first row = block name; subsequent rows have N
 * cells mapping to columns (text/image per cell). Same number of columns per row.
 *
 * Source layout: two-column media block.
 *   Left column  = heading + body paragraphs + CTA button.
 *   Right column = image.
 * The tab switches (.home-switches) are interactive UI chrome, not authorable
 * column content, and are excluded.
 */
export default function parse(element, { document }) {
  // Left (text) column
  const heading = element.querySelector('.home-header2 h2, h2, [class*="text19"], [class*="header"] h2');
  const bodyParas = Array.from(element.querySelectorAll('.home-description2 p, [class*="description"] p'));
  const cta = element.querySelector('a.button, a[class*="navlink"], .home-content2 a');

  // Right (image) column
  const image = element.querySelector('.home-image14 img, [class*="image14"] img, img');

  // Empty-block guard
  if (!heading && bodyParas.length === 0 && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const leftCell = [];
  if (heading) leftCell.push(heading);
  bodyParas.forEach((p) => leftCell.push(p));
  if (cta) leftCell.push(cta);

  const rightCell = [];
  if (image) rightCell.push(image);

  const cells = [];
  // 2-column content row: [ text column, image column ]
  cells.push([leftCell, rightCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-media', cells });
  element.replaceWith(block);
}
