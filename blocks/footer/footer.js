import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // The EDC test page uses its own EDC-branded footer; every other page keeps
  // the default Remarkable footer.
  const isEdc = window.location.pathname.includes('edc-test-page');

  // load footer as fragment — try /content/footer first (local + this content
  // tree), then fall back to the footer metadata path or /footer (DA/EDS prod).
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const localFooter = isEdc ? '/content/edc-footer' : '/content/footer';
  const prodFooter = isEdc ? '/edc-footer' : footerPath;
  let fragment = await loadFragment(localFooter);
  if (!fragment || !fragment.firstElementChild) {
    fragment = await loadFragment(prodFooter);
  }

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const sections = footer.querySelectorAll(':scope > .section, :scope > div');

  if (isEdc) {
    footer.classList.add('edc-footer');
    // EDC layout: [0] newsletter signup, [1] link columns, [2] legal + social
    if (sections[0]) sections[0].classList.add('edc-footer-newsletter');
    if (sections[1]) sections[1].classList.add('edc-footer-links');
    if (sections[2]) sections[2].classList.add('edc-footer-legal');

    // Group each heading + its following list into a column so the three
    // link groups align as columns (source DOM is a flat h3/ul sequence).
    const linkWrapper = sections[1] && sections[1].querySelector('.default-content-wrapper');
    if (linkWrapper) {
      const columns = document.createElement('div');
      columns.className = 'edc-footer-columns';
      linkWrapper.querySelectorAll(':scope > h3').forEach((h3) => {
        const col = document.createElement('div');
        col.className = 'edc-footer-col';
        // capture the list that follows the heading BEFORE moving the heading
        const list = h3.nextElementSibling;
        col.append(h3);
        if (list && list.tagName === 'UL') col.append(list);
        columns.append(col);
      });
      linkWrapper.append(columns);
    }

    // Build the email signup row (form controls live in JS, not the fragment).
    const newsletter = sections[0];
    if (newsletter) {
      const heading = newsletter.querySelector('p');
      const form = document.createElement('div');
      form.className = 'edc-footer-signup';
      const input = document.createElement('input');
      input.type = 'email';
      input.setAttribute('aria-label', 'Business email address');
      input.placeholder = 'Business email address';
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'Subscribe';
      form.append(input, button);
      if (heading) heading.after(form);
    }
  } else {
    // Remarkable layout: brand/info column + link columns
    if (sections[0]) sections[0].classList.add('footer-brand');
    if (sections[1]) sections[1].classList.add('footer-links');
  }

  block.append(footer);
}
