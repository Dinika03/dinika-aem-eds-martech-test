/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-services.
 * Base block: cards
 * Source: https://remarketabletemplateaepdinika.netlify.app/
 * Generated: 2026-07-23
 *
 * Library structure (cards): 2 columns.
 *   Row 1: block name.
 *   Each subsequent row = one card: cell 1 image/icon, cell 2 title + description.
 *
 * Source: cards live inside <card-wrapper*> custom elements grouped in
 * .home-row1 / .home-row2. Each card is a `.card` div with an icon image,
 * an h3 heading, and a paragraph.
 */
export default function parse(element, { document }) {
  // Each card is a div carrying the `card` class (card-card, card-card1, ...)
  const cards = Array.from(element.querySelectorAll('.card'));

  // Empty-block guard
  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cards.forEach((card) => {
    const icon = card.querySelector('img');
    const heading = card.querySelector('h1, h2, h3, h4, [class*="heading"]');
    const text = card.querySelector('p, [class*="text"]');

    const textCell = [];
    if (heading) textCell.push(heading);
    if (text) textCell.push(text);

    // 2-column card row: [ image cell, text cell ]
    cells.push([icon || '', textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-services', cells });
  element.replaceWith(block);
}
