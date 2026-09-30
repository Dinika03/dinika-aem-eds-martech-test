/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-benefits. Base: columns. Source: https://www.edc.ca/en/solutions/insurance/credit-insurance.html
 * Selector: div.text.aem-GridColumn--default--4 (3 sibling grid columns, each .cmp-text with H3 + p).
 * The first matched element gathers itself plus all following siblings matching the same
 * selector into ONE block (1 row x N cells, each H3 + paragraph) and removes those siblings.
 * Later invocations on the removed siblings no-op (no parentNode).
 * Validated against migration-work/block-context/columns-benefits/source.html
 */
const isColumn = (el) => !!el
  && !!el.classList
  && el.classList.contains('text')
  && el.classList.contains('aem-GridColumn--default--4');

export default function parse(element, { document }) {
  // Already consumed by the first sibling's invocation.
  if (!element.parentNode) return;

  const columns = [element];
  let next = element.nextElementSibling;
  while (isColumn(next)) {
    columns.push(next);
    next = next.nextElementSibling;
  }

  const row = columns.map((col) => {
    const content = col.querySelector('.cmp-text') || col;
    const nodes = [...content.children]
      .filter((n) => /^(H[1-6]|P|UL|OL)$/.test(n.tagName) && n.textContent.trim());
    return nodes.length ? nodes : '';
  });

  if (!row.some((c) => c)) {
    element.replaceWith(...element.childNodes);
    return;
  }

  columns.slice(1).forEach((col) => col.remove());

  const cells = [row];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-benefits', cells });
  element.replaceWith(block);
}
