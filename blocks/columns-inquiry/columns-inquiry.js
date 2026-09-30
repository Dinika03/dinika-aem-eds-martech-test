/**
 * Columns (inquiry): grey rounded panel with a photo beside heading, copy
 * (e.g. phone link) and a primary button. Row structure: image | text.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('columns-inquiry-row');
    const cells = [...row.children];
    const imageCell = cells.find((cell) => cell.querySelector('picture')
      && cell.textContent.trim() === '');
    cells.forEach((cell) => {
      cell.classList.add(cell === imageCell ? 'columns-inquiry-image' : 'columns-inquiry-text');
    });
    if (!imageCell) row.classList.add('no-image');

    // a paragraph holding only a (non-tel) link is the primary button
    row.querySelectorAll('.columns-inquiry-text p').forEach((p) => {
      const link = p.querySelector('a');
      if (link && p.children.length === 1 && link.textContent.trim() === p.textContent.trim()
        && !link.href.startsWith('tel:')) {
        p.classList.add('columns-inquiry-cta');
      }
    });
  });
}
