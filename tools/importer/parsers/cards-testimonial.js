/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-testimonial.
 * Base block: cards
 * Source: https://remarketabletemplateaepdinika.netlify.app/
 * Generated: 2026-07-23
 *
 * Library structure (cards): 2 columns.
 *   Row 1: block name.
 *   Each subsequent row = one card: cell 1 photo, cell 2 quote + name + company.
 *
 * Source: each testimonial is a `.quote` div (first also `active-quote`) with a
 * person image, a quote paragraph, and a .home-author* div (name + company).
 * The .home-controls prev/next arrows are UI chrome and are excluded.
 */
export default function parse(element, { document }) {
  // Each testimonial card is a .quote div (excludes .home-controls chrome)
  const cards = Array.from(element.querySelectorAll('.quote'));

  // Empty-block guard
  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cards.forEach((card) => {
    const photo = card.querySelector('img');
    const quote = card.querySelector('p, [class*="quote"]');
    const author = card.querySelector('[class*="author"]');

    const textCell = [];
    if (quote) textCell.push(quote);
    if (author) textCell.push(author);

    // 2-column card row: [ photo cell, quote + author cell ]
    cells.push([photo || '', textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-testimonial', cells });
  element.replaceWith(block);
}
