/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-resources. Base: cards.
 * Source: https://www.edc.ca/ (div.knowledgeandresources:nth-of-type(6) section.knowledge-and-resources)
 * 3 cards: icon image + heading + description + arrow link.
 * Structure: 2 columns per row = [icon image | heading + description (with card link href)].
 *   Row 1: block name (auto)
 * Generated: 2026-07-24
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('ol.cards-list > li, ul.cards-list > li, .cards-list > li'));

  const cells = [];

  items.forEach((item) => {
    const cardEl = item.querySelector('.card') || item;
    const content = cardEl.querySelector('.content-wrapper') || cardEl;
    const icon = content.querySelector('span img.icon-image, img.icon-image, span img, img');
    const heading = content.querySelector('h3.title, h2, h3, .title, [class*="title"]');
    const description = content.querySelector('p.description, p, .description, [class*="description"]');
    const cardLink = cardEl.querySelector('a.card-link, a[href]');

    const bodyCell = [];
    if (heading) {
      if (cardLink && cardLink.getAttribute('href')) {
        const link = document.createElement('a');
        link.href = cardLink.getAttribute('href');
        link.textContent = (heading.textContent || '').trim();
        bodyCell.push(link);
      } else {
        bodyCell.push(heading);
      }
    }
    if (description) bodyCell.push(description);

    // 2-column row: [icon image | body]. Pad image cell if missing.
    cells.push([icon || '', bodyCell.length ? bodyCell : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-resources', cells });
  element.replaceWith(block);
}
