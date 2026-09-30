/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-highlight. Base: columns. Source: https://www.edc.ca/en/solutions/insurance/credit-insurance.html
 * Selector: div.product-highlight-banner. Structure: 1 row x 2 cells =
 *   image | H2 + paragraphs + bullet list.
 * Validated against migration-work/block-context/columns-highlight/source.html
 * (.banner-image img.banner-img — decorative img.risk-icon skipped;
 *  .banner-content h2.section-title + .section-description p/ul; empty .tips-info-items skipped).
 */
export default function parse(element, { document }) {
  const image = element.querySelector('.banner-image img.banner-img')
    || element.querySelector('.banner-image picture img')
    || element.querySelector('img:not(.risk-icon)');

  const content = element.querySelector('.banner-content') || element;
  const heading = content.querySelector('h2, h3, .section-title');
  const description = content.querySelector('.section-description');

  const textCell = [];
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    textCell.push(h2);
  }
  if (description) {
    [...description.children]
      .filter((n) => /^(P|UL|OL|H[3-6])$/.test(n.tagName) && n.textContent.trim())
      .forEach((n) => textCell.push(n));
  }
  // Optional highlighted tips list (empty on the source page).
  content.querySelectorAll('.tips-info-items ul').forEach((ul) => {
    if (ul.querySelector('li') && ul.textContent.trim()) textCell.push(ul);
  });

  if (!image && !textCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[image || '', textCell.length ? textCell : '']];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-highlight', cells });
  element.replaceWith(block);
}
