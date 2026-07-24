import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment — try /content/footer first (local + this content
  // tree), then fall back to the footer metadata path or /footer (DA/EDS prod).
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  let fragment = await loadFragment('/content/footer');
  if (!fragment || !fragment.firstElementChild) {
    fragment = await loadFragment(footerPath);
  }

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // tag the two top-level sections for layout: brand/info column + link columns
  const sections = footer.querySelectorAll(':scope > .section, :scope > div');
  if (sections[0]) sections[0].classList.add('footer-brand');
  if (sections[1]) sections[1].classList.add('footer-links');

  block.append(footer);
}
