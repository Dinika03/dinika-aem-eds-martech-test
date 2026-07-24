/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-contact (our-offer-page variant).
 * Base block: cards
 * Source: https://remarketabletemplateaepdinika.netlify.app/our-offer-page
 * Selector: contact10-wrapper
 * Generated: 2026-07-24
 *
 * Library structure (cards): 2 columns.
 *   Row 1: block name.
 *   Each subsequent row = one card: cell 1 image, cell 2 text content + CTA.
 *
 * Source variation (teleporthq contact10): two location cards
 * (.contact10-container2 = Headquarters, .contact10-container4 = Regional
 * Office). Each has an <img>, an <h3> title, a <p> address, and a
 * "Get directions" <a> link. The photo goes in the first cell; title, address
 * and the CTA link go in the second cell. The section intro
 * (.contact10-content2: "Contact Us" heading + lead text) is not a location
 * card and is excluded.
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('[class*="contact10-container2"], [class*="contact10-container4"]'));

  // Empty-block guard
  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cards.forEach((card) => {
    const image = card.querySelector('img');
    const title = card.querySelector('h1, h2, h3, [class*="heading"]');
    const address = card.querySelector('p, [class*="body-large"]');
    const cta = card.querySelector('a');

    const textCell = [];
    if (title) textCell.push(title);
    if (address) textCell.push(address);
    if (cta) textCell.push(cta);

    // 2-column card row: [ image cell, text cell ]
    cells.push([image || '', textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-contact', cells });
  element.replaceWith(block);
}
