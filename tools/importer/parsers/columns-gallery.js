/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-gallery.
 * Base block: columns
 * Source: https://remarketabletemplateaepdinika.netlify.app/
 * Generated: 2026-07-23
 *
 * Library structure (columns): first row = block name; subsequent rows have N
 * cells (one per column). Every content row must have the same number of cells.
 *
 * Source: image-only gallery grid. Images live in .home-gallery-desktop
 * (.home-image53..56). Decorative empty .home-yellow1 divs have no <img> and
 * are excluded. All gallery images become one row with one image per cell so
 * they render as a side-by-side responsive grid.
 */
export default function parse(element, { document }) {
  // Gallery images only (decorative empty divs have no <img> and are skipped)
  const images = Array.from(element.querySelectorAll('img'));

  // Empty-block guard
  if (images.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Single content row: one image per cell (N columns), consistent column count
  const row = images.map((img) => img);
  cells.push(row);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-gallery', cells });
  element.replaceWith(block);
}
