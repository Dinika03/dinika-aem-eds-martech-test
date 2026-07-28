/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS (edc-specific parsers; homepage/offer parsers are separate)
import heroEdcParser from './parsers/edc-hero-edc.js';
import cardsEdcSupportParser from './parsers/edc-cards-edc-support.js';
import tabsInsightsParser from './parsers/edc-tabs-insights.js';
import cardsSolutionsParser from './parsers/edc-cards-solutions.js';
import ctaBandParser from './parsers/edc-cta-band.js';
import cardsResourcesParser from './parsers/edc-cards-resources.js';
import cardsTilesParser from './parsers/edc-cards-tiles.js';

// TRANSFORMER IMPORTS (edc-specific)
import cleanupTransformer from './transformers/edc-cleanup.js';
import sectionsTransformer from './transformers/edc-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'edc-test-page',
  description: 'EDC (Export Development Canada) homepage: promo bar, hero, support cards, insights tabs, solutions cards, solutions-finder CTA, resources cards, tailored-support cards. Imported to /edc-test-page.',
  urls: [
    'https://www.edc.ca/',
  ],
  blocks: [
    { name: 'hero-edc', instances: ['div.top-banner-comp'] },
    { name: 'cards-edc-support', instances: ['div.knowledgeandresources:nth-of-type(2) section.knowledge-and-resources'] },
    { name: 'tabs-insights', instances: ['div.export-trends'] },
    { name: 'cards-solutions', instances: ['div.homepageproductcard'] },
    { name: 'cta-band', instances: ['section.c-triage-cta'] },
    { name: 'cards-resources', instances: ['div.knowledgeandresources:nth-of-type(6) section.knowledge-and-resources'] },
    { name: 'cards-tiles', instances: ['section.trade-expertise-highlights'] },
    { name: 'section-promo', instances: ['div.homepage-flag:nth-of-type(2)'], section: 'promo-bar' },
    { name: 'section-cta', instances: ['section.c-triage-cta'], section: 'accent' },
  ],
  sections: [
    { id: 'rc1', name: 'promo', selector: 'div.homepage-flag:nth-of-type(2)', style: 'promo-bar', blocks: [], defaultContent: ['div.homepage-flag:nth-of-type(2)'] },
    { id: 'rc2', name: 'hero', selector: 'div.top-banner-comp', style: null, blocks: ['hero-edc'], defaultContent: [] },
    { id: 'rc3', name: 'support', selector: 'div.knowledgeandresources:nth-of-type(2)', style: null, blocks: ['cards-edc-support'], defaultContent: ['div.knowledgeandresources:nth-of-type(2) div.heading-wrapper'] },
    { id: 'rc4', name: 'insights', selector: 'div.export-trends', style: null, blocks: ['tabs-insights'], defaultContent: ['div.export-trends h2'] },
    { id: 'rc5', name: 'solutions', selector: 'div.homepageproductcard', style: null, blocks: ['cards-solutions'], defaultContent: [] },
    { id: 'rc6', name: 'finder', selector: 'section.c-triage-cta', style: 'accent', blocks: ['cta-band'], defaultContent: [] },
    { id: 'rc7', name: 'resources', selector: 'div.knowledgeandresources:nth-of-type(6)', style: null, blocks: ['cards-resources'], defaultContent: ['div.knowledgeandresources:nth-of-type(6) div.heading-wrapper'] },
    { id: 'rc8', name: 'tailored', selector: 'section.trade-expertise-highlights', style: null, blocks: ['cards-tiles'], defaultContent: ['section.trade-expertise-highlights h2'] },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-edc': heroEdcParser,
  'cards-edc-support': cardsEdcSupportParser,
  'tabs-insights': tabsInsightsParser,
  'cards-solutions': cardsSolutionsParser,
  'cta-band': ctaBandParser,
  'cards-resources': cardsResourcesParser,
  'cards-tiles': cardsTilesParser,
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

    // 1. beforeTransform (initial cleanup + section breaks — boundaries are block wrappers)
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

    // 4. afterTransform (final cleanup + metadata prep)
    executeTransformers('afterTransform', main, payload);

    // 4b. Normalize bare-relative image srcs (e.g. "public/x.png") to absolute
    // before adjustImageUrls (which drops non ./ / ../ prefixed srcs).
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

    // 6. Generate sanitized path — source is the edc.ca root TLD but content
    // must land at /edc-test-page (override; do NOT fall back to /index).
    const path = WebImporter.FileUtils.sanitizePath('/edc-test-page');

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
