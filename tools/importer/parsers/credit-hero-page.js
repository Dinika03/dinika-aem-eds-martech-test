/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-page. Base: hero. Source: https://www.edc.ca/en/solutions/insurance/credit-insurance.html
 * Selector: header.c-l2-header. Structure: 1 row x 1 cell = H1 title + subtitle paragraph.
 * Validated against migration-work/block-context/hero-page/source.html
 * (h1.title, p.description inside .header-wrapper; .risk-image is an empty decorative div).
 */
export default function parse(element, { document }) {
  const wrapper = element.querySelector('.header-wrapper') || element;
  const heading = wrapper.querySelector('h1, h2');
  const subtitle = wrapper.querySelector('p.description') || wrapper.querySelector('p');

  if (!heading && !subtitle) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const contentCell = [];
  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.trim();
    contentCell.push(h1);
  }
  if (subtitle && subtitle.textContent.trim()) {
    const p = document.createElement('p');
    p.innerHTML = subtitle.innerHTML.trim();
    contentCell.push(p);
  }

  const cells = [[contentCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-page', cells });
  element.replaceWith(block);
}
