export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div');
  if (!cell) return;

  const textCol = document.createElement('div');
  textCol.className = 'hero-intro-text';
  const mediaCol = document.createElement('div');
  mediaCol.className = 'hero-intro-media';

  [...cell.children].forEach((el) => {
    const pic = el.querySelector && el.querySelector('picture, img');
    if (pic) {
      // image paragraphs go to the media column
      mediaCol.append(el);
    } else {
      textCol.append(el);
    }
  });

  // The first image is a decorative line — keep it with the text column.
  const firstMedia = mediaCol.querySelector(':scope > p');
  if (firstMedia && /line-/.test(firstMedia.querySelector('img')?.getAttribute('src') || '')) {
    firstMedia.classList.add('hero-intro-line');
    textCol.append(firstMedia);
  }

  cell.textContent = '';
  cell.append(textCol);
  if (mediaCol.children.length) cell.append(mediaCol);

  if (!mediaCol.children.length) block.classList.add('no-image');
}
