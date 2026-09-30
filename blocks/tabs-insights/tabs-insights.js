// eslint-disable-next-line import/no-unresolved
import { toClassName, createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const CARD_LINK = 'https://main--dinika-aem-eds-martech-test--dinika03.aem.live/';
const COMPONENT_NAME = 'Export Trends';

function pushInsightDataLayer({ eventName, eventAction, eventText }) {
  window.eventData = window.eventData || [];
  window.eventData.push({
    event: 'cta',
    eventInfo: {
      eventName,
      eventAction,
      eventType: 'click',
      eventComponent: COMPONENT_NAME,
      eventText,
    },
  });
}

/**
 * Turn a panel's flat [picture, heading, picture, heading, …, more-link]
 * sequence into linked article cards (image + heading + arrow) plus a
 * trailing "More resources" link.
 * @param {Element} content The panel content wrapper
 */
function decoratePanel(content) {
  const cards = document.createElement('div');
  cards.className = 'tabs-insights-cards';

  let moreLink = null;
  const nodes = [...content.children];
  let pendingImage = null;

  nodes.forEach((node) => {
    const picture = node.querySelector('picture');
    const anchor = node.querySelector('a');

    if (picture) {
      pendingImage = picture;
      return;
    }

    if (node.tagName === 'H3') {
      const card = document.createElement('a');
      card.className = 'tabs-insights-card';
      card.href = CARD_LINK;

      if (pendingImage) {
        const imgWrap = document.createElement('div');
        imgWrap.className = 'tabs-insights-card-image';
        imgWrap.append(pendingImage);
        card.append(imgWrap);
        pendingImage = null;
      }

      const foot = document.createElement('div');
      foot.className = 'tabs-insights-card-foot';
      const heading = document.createElement('h3');
      heading.innerHTML = node.innerHTML;
      const arrow = document.createElement('span');
      card.addEventListener('click', () => {
        const title = heading.textContent.trim() || '';
        const formatType = card.querySelector('.tabs-insights-card-arrow') ? 'webinar' : '';
        const tabLabel = card.closest('.tabs-insights-panel')?.getAttribute('data-tab-label') || '';
        pushInsightDataLayer({
          eventName: `${tabLabel} - card click - ${title} - ${formatType}`,
          eventAction: 'card',
          eventText: `${tabLabel} - ${title} - ${formatType}`,
        });
      });
      arrow.className = 'tabs-insights-card-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      foot.append(heading, arrow);
      card.append(foot);
      cards.append(card);
      return;
    }

    if (anchor) {
      anchor.href = CARD_LINK;
      anchor.addEventListener('click', () => {
        const tabLabel = content.closest('.tabs-insights-panel')?.getAttribute('data-tab-label') || '';
        pushInsightDataLayer({
          eventName: `link click - ${tabLabel}`,
          eventAction: 'link',
          eventText: 'more resources',
        });
      });
      moreLink = document.createElement('p');
      moreLink.className = 'tabs-insights-more';
      moreLink.append(anchor);
    }
  });

  content.textContent = '';
  content.append(cards);
  if (moreLink) content.append(moreLink);

  // optimize images now that they live in their final wrappers
  content.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}

export default async function decorate(block) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-insights-list';
  tablist.setAttribute('role', 'tablist');

  // decorate tabs and tabpanels
  const tabs = [...block.children].map((child) => child.firstElementChild);
  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);

    // decorate tabpanel
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-insights-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('data-tab-label', tab.textContent.trim());
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // build tab button
    const button = document.createElement('button');
    button.className = 'tabs-insights-tab';
    button.id = `tab-${id}`;

    button.innerHTML = tab.innerHTML;

    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      const pillText = button.textContent.trim();
      pushInsightDataLayer({
        eventName: `button click - ${pillText}`,
        eventAction: 'button',
        eventText: pillText,
      });
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
    tab.remove();
    moveInstrumentation(button.querySelector('p'), null);

    // transform the remaining panel content into linked article cards
    const content = tabpanel.firstElementChild;
    if (content) decoratePanel(content);
  });

  block.prepend(tablist);
}
