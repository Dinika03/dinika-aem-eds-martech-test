import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const CARD_LINK = 'https://main--dinika-aem-eds-martech-test--dinika03.aem.live/';
const COMPONENT_NAME = 'knowledge and resources';

function pushCardClickDataLayer(link) {
  const title = link.querySelector('h2, h3, h4, .title, [class*="title"]')?.textContent.trim()
    || link.textContent.trim()
    || '';

  window.eventData = window.eventData || [];
  window.eventData.push({
    event: 'cta',
    eventInfo: {
      eventName: `card click - ${title}`,
      eventAction: 'card',
      eventType: 'click',
      eventComponent: COMPONENT_NAME,
      eventText: title,
    },
  });
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-edc-support-card-image';
      else div.className = 'cards-edc-support-card-body';
    });
    // whole card is a link
    const link = document.createElement('a');
    link.className = 'cards-edc-support-card-link';
    link.href = CARD_LINK;
    link.addEventListener('click', () => pushCardClickDataLayer(link));
    while (li.firstChild) link.append(li.firstChild);
    li.append(link);
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
