/**
 * Table (compare): converts authored rows into a semantic comparison table.
 * Row 1 = header (first cell usually empty, then one cell per product).
 * Following rows = first cell is the row label, remaining cells are values.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // bold product links in the header are column titles, not buttons
  block.querySelectorAll('a.button').forEach((a) => {
    a.removeAttribute('class');
    a.closest('.button-wrapper')?.removeAttribute('class');
    const strong = document.createElement('strong');
    a.replaceWith(strong);
    strong.append(a);
  });

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const colCount = Math.max(...rows.map((row) => row.children.length));

  rows.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');
    const cells = [...row.children];
    for (let i = 0; i < colCount; i += 1) {
      const cell = cells[i];
      const isHeader = rowIndex === 0;
      const isLabel = !isHeader && i === 0;
      const el = document.createElement(isHeader || isLabel ? 'th' : 'td');
      if (isHeader) el.scope = 'col';
      if (isLabel) el.scope = 'row';
      if (cell) el.append(...cell.childNodes);
      tr.append(el);
    }
    (rowIndex === 0 ? thead : tbody).append(tr);
  });

  table.append(thead, tbody);
  const scroller = document.createElement('div');
  scroller.className = 'table-compare-scroll';
  scroller.tabIndex = 0;
  scroller.setAttribute('role', 'region');
  // label the region with the section's own (default-content) heading, if any
  const caption = block.closest('.section')?.querySelector('.default-content-wrapper :is(h2, h3)');
  scroller.setAttribute('aria-label', caption ? caption.textContent.trim() : 'Comparison table');
  scroller.append(table);
  block.replaceChildren(scroller);
}
