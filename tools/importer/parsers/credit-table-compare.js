/* eslint-disable */
/* global WebImporter */
/**
 * Parser for table-compare. Base: table. Source: https://www.edc.ca/en/solutions/insurance/credit-insurance.html
 * Selector: section.table. Structure: header row (empty cell + product names, links kept),
 * then one row per attribute: label | value | value. Inline markup (links, <br>, lists) kept.
 * Validated against migration-work/block-context/table-compare/source.html (table > tbody > tr > td).
 */
export default function parse(element, { document }) {
  const table = element.querySelector('table');
  if (!table) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const isBlank = (node) => node.nodeName === 'BR'
    || (node.nodeType === 3 && !node.textContent.replace(/ /g, ' ').trim());

  const cells = [...table.querySelectorAll('tr')].map((tr) => [...tr.children]
    .filter((td) => /^(TD|TH)$/.test(td.tagName))
    .map((td) => {
      if (!td.textContent.replace(/ /g, ' ').trim() && !td.querySelector('img, a')) return '';
      // strip trailing <br> / whitespace noise
      while (td.lastChild && isBlank(td.lastChild)) td.lastChild.remove();
      return [...td.childNodes];
    }));

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Pad rows so every row has the same number of cells.
  const width = Math.max(...cells.map((r) => r.length));
  cells.forEach((r) => { while (r.length < width) r.push(''); });

  const block = WebImporter.Blocks.createBlock(document, { name: 'table-compare', cells });
  element.replaceWith(block);
}
