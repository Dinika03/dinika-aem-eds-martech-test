/**
 * Columns (highlight): tall rounded portrait image beside heading, copy and
 * bullet list. Row structure: image | text (either order is accepted).
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('columns-highlight-row');
    const cells = [...row.children];
    const imageCell = cells.find((cell) => cell.querySelector('picture')
      && cell.textContent.trim() === '');
    cells.forEach((cell) => {
      cell.classList.add(cell === imageCell ? 'columns-highlight-image' : 'columns-highlight-text');
    });
    // image always renders first (left on desktop) regardless of authored order
    if (imageCell && imageCell !== row.firstElementChild) {
      row.classList.add('columns-highlight-image-last');
    }
    if (!imageCell) row.classList.add('no-image');
  });
}
