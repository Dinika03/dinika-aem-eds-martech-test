/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-testimonial (our-offer-page variant).
 * Base block: cards
 * Source: https://remarketabletemplateaepdinika.netlify.app/our-offer-page
 * Selector: testimonial17-wrapper
 * Generated: 2026-07-24
 *
 * Library structure (cards): 2 columns.
 *   Row 1: block name.
 *   Each subsequent row = one card: cell 1 image, cell 2 text content.
 *
 * Source variation (teleporthq testimonial17): four testimonial cards
 * (.testimonial17-card1..4), each with a photo <img>, a <strong> name, a
 * <span> role, and a quote <span class="testimonial17-textNN">. The photo goes
 * in the first cell; name, role and quote go in the second cell. The
 * section-level intro (.testimonial17-container10) is a heading/summary, not a
 * card, and is excluded.
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('[class*="testimonial17-card"]'));

  // Empty-block guard
  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cards.forEach((card) => {
    const photo = card.querySelector('img');
    const name = card.querySelector('strong');
    // Role is the small span inside the name/role container.
    const role = card.querySelector('[class*="container1"] span[class*="body-small"], [class*="container1"] > span');
    // Quote is the top-level testimonial text span in the card.
    const quote = card.querySelector('span[class*="testimonial17-text"]');

    const textCell = [];
    if (name) textCell.push(name);
    if (role && role !== name) textCell.push(role);
    if (quote) textCell.push(quote);

    // 2-column card row: [ image cell, text cell ]
    cells.push([photo || '', textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-testimonial', cells });
  element.replaceWith(block);
}
