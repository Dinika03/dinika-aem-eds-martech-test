/**
 * CTA band: a full-width highlighted band whose heading links to a target.
 * Makes the whole band clickable if a single link is present.
 */
export default function decorate(block) {
  const link = block.querySelector('a');
  if (link) {
    block.classList.add('cta-band-linked');
    block.addEventListener('click', (e) => {
      // Only navigate when the click did not originate on the link itself
      if (!e.target.closest('a')) {
        link.click();
      }
    });
  }
}
