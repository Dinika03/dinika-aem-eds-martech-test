/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-tiles. Base: cards. Source: https://www.edc.ca/ (section.trade-expertise-highlights).
 * 3 image-forward tiles: background photo + overlaid heading + description + arrow link.
 * Structure: 2 columns per row = [tile image | heading + description (with tile link href)].
 *   Row 1: block name (auto)
 * Generated: 2026-07-24
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('ol.default-list > li, ul.default-list > li, ol > li, ul > li'));

  const cells = [];

  items.forEach((item) => {
    const cardEl = item.querySelector('.card') || item;
    const content = cardEl.querySelector('.content-wrapper') || cardEl;
    const image = cardEl.querySelector('img.bg-image, .card > img, img');
    const heading = content.querySelector('.title-wrapper h3, h2, h3, .title, [class*="title"]');
    const description = content.querySelector('p.description, p, .description, [class*="description"]');
    const tileLink = cardEl.querySelector(':scope > a[href], a[href]');

    const bodyCell = [];
    if (heading) {
      if (tileLink && tileLink.getAttribute('href')) {
        const link = document.createElement('a');
        link.href = tileLink.getAttribute('href');
        link.textContent = (heading.textContent || '').trim();
        bodyCell.push(link);
      } else {
        bodyCell.push(heading);
      }
    }
    if (description) bodyCell.push(description);

    // 2-column row: [tile image | body]. Pad image cell if missing.
    cells.push([image || '', bodyCell.length ? bodyCell : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tiles', cells });
  element.replaceWith(block);
}
