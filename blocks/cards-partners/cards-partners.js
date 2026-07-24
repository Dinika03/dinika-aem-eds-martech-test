import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-partners-card-image';
      else div.className = 'cards-partners-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    // SVGs must not be run through createOptimizedPicture: it emits a webp
    // <source> that most origins can't transcode, leaving a broken image.
    if (/\.svg(\?|$)/i.test(img.src)) return;
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Group the logo tiles into vertically-centered columns to match the source's
  // staggered logo wall (heading sits to the left; columns to the right).
  const tiles = [...ul.children];
  const COLS = 4;
  // Distribute so middle columns are taller → vertically centering yields a
  // staggered pyramid like the original.
  const distribution = [3, 5, 5, 3];
  const columnsWrap = document.createElement('div');
  columnsWrap.className = 'cards-partners-columns';

  let cursor = 0;
  for (let c = 0; c < COLS; c += 1) {
    const count = distribution[c] ?? Math.ceil(tiles.length / COLS);
    const col = document.createElement('div');
    col.className = 'cards-partners-column';
    tiles.slice(cursor, cursor + count).forEach((tile) => col.append(tile));
    cursor += count;
    if (col.children.length) columnsWrap.append(col);
  }
  // Any leftover tiles (if distribution didn't cover all) go to the last column.
  if (cursor < tiles.length && columnsWrap.lastElementChild) {
    tiles.slice(cursor).forEach((tile) => columnsWrap.lastElementChild.append(tile));
  }

  block.textContent = '';
  block.append(columnsWrap);
}
