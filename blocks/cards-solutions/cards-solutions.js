import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const CARD_LINK = 'https://main--dinika-aem-eds-martech-test--dinika03.aem.live/';

// Cards whose destination page has been migrated to this site, keyed by the
// card heading. Relative paths resolve to aem.page on preview, aem.live on live.
const MIGRATED_CARD_LINKS = {
  'trade credit insurance': '/dinika-edc-credit-insurance-test',
};

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-solutions-card-image';
      else div.className = 'cards-solutions-card-body';
    });
    // whole card is a link — use the card's authored link if it has one
    // (unwrapped to avoid nested anchors), then a migrated page, then the default
    const authored = li.querySelector('a[href]');
    const heading = li.querySelector('h1, h2, h3, h4, h5, h6');
    const migrated = heading && MIGRATED_CARD_LINKS[heading.textContent.trim().toLowerCase()];
    const link = document.createElement('a');
    link.className = 'cards-solutions-card-link';
    link.href = (authored && authored.getAttribute('href')) || migrated || CARD_LINK;
    if (authored) authored.replaceWith(...authored.childNodes);
    while (li.firstChild) link.append(li.firstChild);
    li.append(link);
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '120' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
