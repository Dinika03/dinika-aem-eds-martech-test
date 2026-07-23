/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroIntroParser from './parsers/hero-intro.js';
import columnsMediaParser from './parsers/columns-media.js';
import cardsServicesParser from './parsers/cards-services.js';
import cardsTestimonialParser from './parsers/cards-testimonial.js';
import cardsPartnersParser from './parsers/cards-partners.js';
import cardsArticlesParser from './parsers/cards-articles.js';
import columnsGalleryParser from './parsers/columns-gallery.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/remarkable-cleanup.js';
import sectionsTransformer from './transformers/remarkable-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Marketing homepage for the Remarkable small-business template: header/nav, hero, mission statements, improve/services sections, testimonials, partners logos, article cards, CTA banner, gallery, newsletter signup, and footer.',
  urls: [
    'https://remarketabletemplateaepdinika.netlify.app/'
  ],
  blocks: [
    { name: 'hero-intro', instances: ['section.home-hero', 'header.home-hero'] },
    { name: 'columns-media', instances: ['section.home-improve div.home-tabs'] },
    { name: 'cards-services', instances: ['section.home-services1 div.home-cards'] },
    { name: 'cards-testimonial', instances: ['section.home-testimonials div.home-container2'] },
    { name: 'cards-partners', instances: ['section.home-partners div.home-partners-desktop'] },
    { name: 'cards-articles', instances: ['section.home-services2 div.home-sections'] },
    { name: 'columns-gallery', instances: ['section.home-galleries div.home-gallery-desktop'] },
    { name: 'section-testimonials', instances: ['section.home-testimonials'], section: 'accent' },
    { name: 'section-banner', instances: ['section.home-banner'], section: 'accent' }
  ],
  sections: [
    { id: 'rc2', name: 'hero', selector: 'section.home-hero', style: null, blocks: ['hero-intro'], defaultContent: [] },
    { id: 'rc3', name: 'mission1', selector: 'section.home-mission1', style: null, blocks: [], defaultContent: ['section.home-mission1 h2.home-text15', 'section.home-mission1 a.home-navlink4'] },
    { id: 'rc4', name: 'improve', selector: 'section.home-improve', style: null, blocks: ['columns-media'], defaultContent: ['section.home-improve div.home-heading1'] },
    { id: 'rc5', name: 'services1', selector: 'section.home-services1', style: null, blocks: ['cards-services'], defaultContent: ['section.home-services1 h2.home-text25'] },
    { id: 'rc6', name: 'testimonials', selector: 'section.home-testimonials', style: 'accent', blocks: ['cards-testimonial'], defaultContent: [] },
    { id: 'rc7', name: 'partners', selector: 'section.home-partners', style: null, blocks: ['cards-partners'], defaultContent: ['section.home-partners div.home-content4'] },
    { id: 'rc8', name: 'services2', selector: 'section.home-services2', style: null, blocks: ['cards-articles'], defaultContent: ['section.home-services2 div.home-heading2'] },
    { id: 'rc9', name: 'banner', selector: 'section.home-banner', style: 'accent', blocks: [], defaultContent: ['section.home-banner div.home-container5'] },
    { id: 'rc10', name: 'mission2', selector: 'section.home-mission2', style: null, blocks: [], defaultContent: ['section.home-mission2 div.home-content5'] },
    { id: 'rc11', name: 'galleries', selector: 'section.home-galleries', style: null, blocks: ['columns-gallery'], defaultContent: [] },
    { id: 'rc12', name: 'mission3', selector: 'section.home-mission3', style: null, blocks: [], defaultContent: ['section.home-mission3 div.home-content6'] },
    { id: 'rc13', name: 'newsletter', selector: 'section.home-newsletter', style: null, blocks: [], defaultContent: ['section.home-newsletter div.home-header8', 'section.home-newsletter div.home-content7'] }
  ]
};

// PARSER REGISTRY
const parsers = {
  'hero-intro': heroIntroParser,
  'columns-media': columnsMediaParser,
  'cards-services': cardsServicesParser,
  'cards-testimonial': cardsTestimonialParser,
  'cards-partners': cardsPartnersParser,
  'cards-articles': cardsArticlesParser,
  'columns-gallery': columnsGalleryParser,
};

// TRANSFORMER REGISTRY - section transformer runs after cleanup
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks
    .filter((blockDef) => !blockDef.name.startsWith('section-'))
    .forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null,
          });
        });
      });
    });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 4b. Normalize bare-relative image srcs (e.g. "public/x.png") to absolute.
    // WebImporter.rules.adjustImageUrls only handles "./", "/", "../" prefixes and
    // drops any other src (new URL() throws with no base), which would remove all
    // of this template's images (they use paths like "public/hero1-1500w.png").
    main.querySelectorAll('img[src]').forEach((img) => {
      const src = img.getAttribute('src');
      if (src && !/^(https?:)?\/\//i.test(src) && !src.startsWith('data:') && !src.startsWith('/') && !src.startsWith('./') && !src.startsWith('../')) {
        try {
          img.src = new URL(src, url).toString();
        } catch (e) {
          // leave as-is; adjustImageUrls will handle/skip it
        }
      }
    });

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 5b. Redirect oversized source SVGs to locally optimized copies.
    // DA rejects SVGs > 40KB. group 2106.svg is 51.4KB; a locally svgo-optimized
    // copy (22.9KB) is committed at content/images/. Point the reference at it.
    // Runs AFTER adjustImageUrls so the local path is not re-absolutized.
    const OVERSIZED_SVG_MAP = {
      'group 2106.svg': '/content/images/gallery-accent-2106.svg',
      'group%202106.svg': '/content/images/gallery-accent-2106.svg',
    };
    main.querySelectorAll('img[src]').forEach((img) => {
      const src = img.getAttribute('src') || '';
      const key = Object.keys(OVERSIZED_SVG_MAP).find((k) => src.includes(k));
      if (key) img.src = OVERSIZED_SVG_MAP[key];
    });

    // 6. Generate sanitized path (root path "/" maps to "/index")
    const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath || '/index');

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
