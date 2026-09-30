/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-inquiry. Base: columns. Source: https://www.edc.ca/en/solutions/insurance/credit-insurance.html
 * Selector: section.inquiry-submission. Structure: 1 row x 2 cells =
 *   image | H2 + paragraph (tel: link kept) + "Contact EDC" button link on its own line.
 * Validated against migration-work/block-context/columns-inquiry/source.html
 * (.panel-left img.inq-image; .panel-right h2.inq-title, p, a.c-interaction-button).
 */
export default function parse(element, { document }) {
  const left = element.querySelector('.panel-left') || element;
  const right = element.querySelector('.panel-right') || element;

  const image = left.querySelector('img.inq-image') || left.querySelector('picture img, img');

  const textCell = [];
  const heading = right.querySelector('h2, h3, .inq-title');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    textCell.push(h2);
  }
  [...right.querySelectorAll(':scope > p')].forEach((p) => {
    if (p.textContent.trim()) textCell.push(p);
  });
  [...right.querySelectorAll(':scope > a[href]')].forEach((a) => {
    const p = document.createElement('p');
    p.append(a);
    textCell.push(p);
  });

  if (!image && !textCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[image || '', textCell.length ? textCell : '']];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-inquiry', cells });
  element.replaceWith(block);
}
