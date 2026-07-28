export default function decorate(block) {
  const cols = [...block.children];
  // first column holds the photo, second the heading/copy/CTA
  const imageCol = cols.find((col) => col.querySelector('picture'));
  const textCol = cols.find((col) => col !== imageCol) || cols[cols.length - 1];

  if (imageCol) imageCol.classList.add('hero-edc-image');
  if (textCol) textCol.classList.add('hero-edc-text');

  if (!imageCol) block.classList.add('no-image');
}
