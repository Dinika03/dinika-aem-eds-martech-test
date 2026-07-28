/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-edc-support. Base: cards (no images).
 * Source: https://www.edc.ca/ (div.knowledgeandresources:nth-of-type(2) section.knowledge-and-resources)
 * Text-only cards. Structure: 1 column, one row per card.
 *   Row 1: block name (auto)
 *   Each card row: single cell = heading + description + link
 * Generated: 2026-07-24
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('ol.cards-list > li, ul.cards-list > li, .cards-list > li'));

  const cells = [];

  cards.forEach((card) => {
    const cardEl = card.querySelector('.card') || card;
    const content = cardEl.querySelector('.content-wrapper') || cardEl;
    const heading = content.querySelector('h2, h3, h4, .title, [class*="title"]');
    const description = content.querySelector('p, .description, [class*="description"]');

    // The whole card is wrapped by an (often empty) anchor. Build a linked label from the href.
    const cardLink = cardEl.querySelector('a.card-link, a[href]');

    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);

    if (cardLink && cardLink.getAttribute('href')) {
      const link = document.createElement('a');
      link.href = cardLink.getAttribute('href');
      const linkText = (cardLink.textContent || '').trim() || (heading && heading.textContent.trim()) || 'Learn more';
      link.textContent = linkText;
      contentCell.push(link);
    }

    if (contentCell.length) cells.push([contentCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-edc-support', cells });
  element.replaceWith(block);
}
