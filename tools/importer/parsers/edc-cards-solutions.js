/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-solutions. Base: cards. Source: https://www.edc.ca/ (div.homepageproductcard).
 * 4 cards, each: icon image + heading + description, whole card linked.
 * Structure: 2 columns per row = [icon image | heading + description (with card link href)].
 *   Row 1: block name (auto)
 * Generated: 2026-07-24
 */
// Cards whose destination has been migrated to this EDS site. The source card
// anchors are empty and stripped before parsing, so match on the card heading.
const MIGRATED_CARD_LINKS = [
  { heading: /^trade credit insurance$/i, href: '/dinika-edc-credit-insurance-test' },
];

export default function parse(element, { document }) {
  // Select one container per card. Prefer list items; fall back to .card
  // only when there are no list items (avoids double-matching li + inner .card).
  const items = Array.from(element.querySelectorAll('ol.two-columns > li, ol > li, ul > li'));
  const cards = items.length ? items : Array.from(element.querySelectorAll('.card'));
  // Normalize to card containers
  const cardEls = cards.map((c) => c.querySelector(':scope > .card') || (c.classList && c.classList.contains('card') ? c : c.querySelector('.card')) || c);

  const cells = [];

  cardEls.forEach((cardEl) => {
    if (!cardEl) return;
    const content = cardEl.querySelector('.content-wrapper') || cardEl;
    const icon = content.querySelector('.title-wrapper span img, .title-wrapper img, img.icon-image, img');
    const heading = content.querySelector('.title-wrapper h3, h3, .title, [class*="title"]');
    const description = content.querySelector('p.description, p, .description, [class*="description"]');
    const cardLink = cardEl.querySelector('a.card-link, a[href]');

    const bodyCell = [];
    const headingText = heading ? (heading.textContent || '').trim() : '';
    const migrated = MIGRATED_CARD_LINKS.find((m) => m.heading.test(headingText));
    if (heading && migrated) {
      const link = document.createElement('a');
      link.href = migrated.href;
      link.textContent = headingText;
      heading.textContent = '';
      heading.append(link);
      bodyCell.push(heading);
    } else if (heading) {
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-solutions', cells });
  element.replaceWith(block);
}
