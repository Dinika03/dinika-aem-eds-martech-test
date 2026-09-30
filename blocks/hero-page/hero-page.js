/**
 * Hero (page header): full-width EDC blue title band with H1 + subtitle.
 * Optional picture anywhere in the block is moved behind the text as a
 * decorative background.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const picture = block.querySelector('picture');
  const content = document.createElement('div');
  content.className = 'hero-page-content';

  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      [...cell.childNodes].forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && node.querySelector?.('picture') && node.textContent.trim() === '') return;
        if (node.nodeName === 'PICTURE') return;
        content.append(node);
      });
    });
  });

  // first paragraph after the title is the subtitle
  const subtitle = content.querySelector('h1 ~ p, h2 ~ p');
  if (subtitle) subtitle.classList.add('hero-page-subtitle');

  block.textContent = '';
  if (picture) {
    const bg = document.createElement('div');
    bg.className = 'hero-page-bg';
    const img = picture.querySelector('img');
    if (img) img.alt = img.alt || '';
    bg.append(picture);
    block.append(bg);
    block.classList.add('has-image');
  }
  block.append(content);
}
