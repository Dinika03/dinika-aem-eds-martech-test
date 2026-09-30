/**
 * Columns (benefits): plain side-by-side text columns (heading + paragraph).
 * Each cell of each row becomes one column.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const firstRow = block.firstElementChild;
  const count = firstRow ? firstRow.children.length : 0;
  block.classList.add(`columns-benefits-${Math.min(Math.max(count, 1), 4)}-cols`);

  [...block.children].forEach((row) => {
    row.classList.add('columns-benefits-row');
    [...row.children].forEach((cell) => {
      cell.classList.add('columns-benefits-col');
      if (!cell.textContent.trim() && !cell.querySelector('picture')) cell.classList.add('is-empty');
    });
  });
}
