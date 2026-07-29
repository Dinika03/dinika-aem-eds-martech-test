import {
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  buildBlock,
  readBlockConfig,
  toClassName,
  toCamelCase,
} from './aem.js';

import {
  initMartech, martechEager, martechLazy, martechDelayed, updateUserConsent,
} from '../plugins/martech/src/index.js';

// updated by dinika
const MARTECH = {
  orgId: '0CEB60F754C7E06B0A4C98A2@AdobeOrg',
  alloySrc: '/scripts/alloy.min.js',
  environments: {
    dev: {
      datastreamId: '18cfd0f5-2757-48c7-b1b9-5d5116d9ef3b',
      launchUrl: 'https://assets.adobedtm.com/e72b4113c11a/5921c51080ee/launch-53700c41e133-development.min.js',   // from Tags → Environments → Development
    },
    prod: {
      datastreamId: 'cb8a0d46-2f72-4712-917f-604cd90c8abd',
      launchUrl: 'https://assets.adobedtm.com/e72b4113c11a/5921c51080ee/launch-db988140f833.min.js',  // from Tags → Environments → Production
    },
  },
};

// EDS hostnames decide the environment:
//   localhost / *.aem.page (preview)  -> dev
//   *.aem.live + your production domain -> prod
function getEnvironment() {
  const { hostname } = window.location;
  if (hostname === 'localhost'
      || hostname.endsWith('.aem.page')
      || hostname.endsWith('.hlx.page')) {
    return 'dev';
  }
  return 'prod';
}
const ENV = MARTECH.environments[getEnvironment()];

// WebSDK config — the onBeforeEventSend hook is where eventData feeds Analytics
const webSDKConfig = {
  datastreamId: ENV.datastreamId,          // from your getEnvironment()
  orgId: '0CEB60F754C7E06B0A4C98A2@AdobeOrg',
  onBeforeEventSend: (payload) => {
    // Plugin has already scaffolded payload.data.__adobe.analytics = {}
    const aa = payload.data?.__adobe?.analytics;
    if (aa && payload.xdm?.eventType === 'web.webpagedetails.pageViews') {
      const pv = (window.eventData || []).find((e) => e.event === 'page-loaded');
      const p = (pv && pv.pageInfo) || {};
      aa.pageName = p.pageName || document.title;
      // map more fields per your spec, using REAL variable names:
       aa.eVar1 = p.pageName;
       aa.eVar6 = p.pageURL;
       aa.eVar7 = p.pagePath;
    }
    return true; // returning false blocks the send
  },
};

const martechConfig = {
  dataLayer: false,                        // ACDL OFF — DLM owns the data layer
  launchUrls: ENV.launchUrl && !ENV.launchUrl.startsWith('PASTE_') ? [ENV.launchUrl] : [],
  // analytics: true, personalization: true, trackPageView: true, performanceOptimized: true (defaults)
};

//end of dinika update

if (window.trustedTypes && window.trustedTypes.createPolicy) {
  const innerTT = window.trustedTypes.createPolicy('tt-inner', {
    createHTML: (s) => s, // avoid stack overflow
  });

  window.trustedTypes.createPolicy('default', {
    createHTML: (input, type, sink) => {
      let processedInput = input;
      if (/srcdoc\s*=/i.test(processedInput)) {
        const doc = new DOMParser().parseFromString(innerTT.createHTML(processedInput), 'text/html');
        doc.querySelectorAll('iframe[srcdoc]').forEach((el) => el.removeAttribute('srcdoc'));
        processedInput = doc.body.innerHTML;
      }
      if (sink.includes('createContextualFragment') || sink.includes('Document write')) {
        const doc = new DOMParser().parseFromString(innerTT.createHTML(processedInput), 'text/html');
        doc.querySelectorAll('script').forEach((el) => el.remove());
        processedInput = doc.body.innerHTML;
      }
      return processedInput;
    },
    createScriptURL: (input) => input,
    createScript: (input) => input,
  });
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Turns `/widgets/...` links into widget blocks.
 * @param {Element} main The container element
 */
function buildWidgetAutoBlocks(main) {
  const widgetLinks = [...main.querySelectorAll('a[href*="/widgets/"]')];
  widgetLinks.forEach((link) => {
    if (link.closest('.widget')) return;
    const newLink = link.cloneNode(true);
    const widgetBlock = buildBlock('widget', { elems: [newLink] });
    const p = link.closest('p');
    if (
      p
      && p.querySelectorAll('a').length === 1
      && p.querySelector('a') === link
      && p.textContent.trim() === link.textContent.trim()
    ) {
      p.replaceWith(widgetBlock);
    } else {
      link.replaceWith(widgetBlock);
    }
  });
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    // auto load `*/fragments/*` references
    const fragments = [...main.querySelectorAll('a[href*="/fragments/"]')].filter((f) => !f.closest('.fragment'));
    if (fragments.length > 0) {
      // eslint-disable-next-line import/no-cycle
      import('../blocks/fragment/fragment.js').then(({ loadFragment }) => {
        fragments.forEach(async (fragment) => {
          try {
            const { pathname } = new URL(fragment.href);
            const frag = await loadFragment(pathname);
            fragment.parentElement.replaceWith(...frag.children);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fragment loading failed', error);
          }
        });
      });
    }
    buildWidgetAutoBlocks(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates formatted links to style them as buttons.
 * @param {HTMLElement} main The main container element
 */
function decorateButtons(main) {
  main.querySelectorAll('p a[href]').forEach((a) => {
    a.title = a.title || a.textContent;
    const p = a.closest('p');
    const text = a.textContent.trim();

    // quick structural checks
    if (a.querySelector('img') || p.textContent.trim() !== text) return;

    // skip URL display links
    try {
      if (new URL(a.href).href === new URL(text, window.location).href) return;
    } catch { /* continue */ }

    // require authored formatting for buttonization
    const strong = a.closest('strong');
    const em = a.closest('em');
    if (!strong && !em) return;

    p.className = 'button-wrapper';
    a.className = 'button';
    if (strong && em) { // high-impact call-to-action
      a.classList.add('accent');
      const outer = strong.contains(em) ? strong : em;
      outer.replaceWith(a);
    } else if (strong) {
      a.classList.add('primary');
      strong.replaceWith(a);
    } else {
      a.classList.add('secondary');
      em.replaceWith(a);
    }
  });
}

/**
 * Move given attributes from one element to another.
 * @param {Element} from source element
 * @param {Element} to target element
 * @param {string[]} [attributes] list of attribute names to move (defaults to all)
 */
export function moveAttributes(from, to, attributes) {
  const attrs = attributes || [...from.attributes].map(({ nodeName }) => nodeName);
  attrs.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Move instrumentation attributes from one element to another.
 * @param {Element} from source element
 * @param {Element} to target element
 */
export function moveInstrumentation(from, to) {
  moveAttributes(
    from,
    to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter((attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')),
  );
}

/**
 * Applies section metadata: reads each `.section-metadata` block, converts its
 * key/value rows into section classes (e.g. style=accent → `.accent`) or data
 * attributes, then removes the block.
 * @param {Element} main The main element
 */
function processSectionMetadata(main) {
  main.querySelectorAll('.section-metadata').forEach((sectionMeta) => {
    const section = sectionMeta.closest('.section');
    if (!section) return;
    const meta = readBlockConfig(sectionMeta);
    Object.keys(meta).forEach((key) => {
      if (key === 'style') {
        meta.style.split(',').forEach((s) => section.classList.add(toClassName(s.trim())));
      } else {
        section.dataset[toCamelCase(key)] = meta[key];
      }
    });
    (sectionMeta.parentElement.classList.contains('section-metadata-wrapper')
      ? sectionMeta.parentElement : sectionMeta).remove();
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
export function decorateMain(main) {
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  processSectionMetadata(main);
  decorateBlocks(main);
  decorateButtons(main);
}
/** EDDL page-load event function */
function pushPageData() {
  window.eventData = window.eventData || [];
  window.eventData.push({
    event: 'page-loaded',
    pageInfo: {
      pageName: document.title,
      pagePath: window.location.pathname,
      pageURL: window.location.href,
    },
  });
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  //updated by dinika
  pushPageData();
  await initMartech(webSDKConfig, martechConfig);
  // TESTING ONLY — default consent is 'pending', so nothing sends until granted.
  // Wire this to your real CMP before production.
  updateUserConsent({ collect: true, marketing: true, personalize: true, share: false });
  //end of dinika update
  const main = doc.querySelector('main');
  if (main) {
    await martechEager();   //updated by dinika
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  loadHeader(doc.querySelector('header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
  await martechLazy(); //updated by dinika
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => {
    martechDelayed(); //updated by dinika
    import('./delayed.js')}, 3000)
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
