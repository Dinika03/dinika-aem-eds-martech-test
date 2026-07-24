/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS (offer-page-specific parsers; homepage parsers are separate)
import heroIntroParser from './parsers/offer-hero-intro.js';
import cardsServicesParser from './parsers/offer-cards-services.js';
import cardsPricingParser from './parsers/offer-cards-pricing.js';
import columnsStepsParser from './parsers/offer-columns-steps.js';
import cardsTestimonialParser from './parsers/offer-cards-testimonial.js';
import cardsContactParser from './parsers/offer-cards-contact.js';

// TRANSFORMER IMPORTS (offer-page-specific)
import cleanupTransformer from './transformers/offer-page-cleanup.js';
import sectionsTransformer from './transformers/offer-page-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'our-offer-page',
  description: 'Offers/pricing landing page: hero with image collage, feature lists, CTA banners, pricing plans, steps/process, testimonials grid, and contact cards.',
  urls: [
    'https://remarketabletemplateaepdinika.netlify.app/our-offer-page',
  ],
  blocks: [
    { name: 'hero-intro', instances: ['hero17-wrapper'] },
    { name: 'cards-services', instances: ['features24-wrapper', 'features25-wrapper'] },
    { name: 'cards-pricing', instances: ['a.our-offer-page-navlink4'] },
    { name: 'columns-steps', instances: ['steps2-wrapper'] },
    { name: 'cards-testimonial', instances: ['testimonial17-wrapper'] },
    { name: 'cards-contact', instances: ['contact10-wrapper'] },
    { name: 'section-cta', instances: ['a.our-offer-page-navlink3'], section: 'accent' },
    { name: 'section-testimonials', instances: ['testimonial17-wrapper'], section: 'accent' },
  ],
  sections: [
    { id: 'rc1', name: 'hero', selector: 'hero17-wrapper', style: null, blocks: ['hero-intro'], defaultContent: [] },
    { id: 'rc2', name: 'features1', selector: 'features24-wrapper', style: null, blocks: ['cards-services'], defaultContent: [] },
    { id: 'rc3', name: 'cta', selector: 'a.our-offer-page-navlink3', style: 'accent', blocks: [], defaultContent: ['a.our-offer-page-navlink3'] },
    { id: 'rc4', name: 'features2', selector: 'features25-wrapper', style: null, blocks: ['cards-services'], defaultContent: [] },
    { id: 'rc5', name: 'pricing', selector: 'a.our-offer-page-navlink4', style: null, blocks: ['cards-pricing'], defaultContent: [] },
    { id: 'rc6', name: 'steps', selector: 'steps2-wrapper', style: null, blocks: ['columns-steps'], defaultContent: [] },
    { id: 'rc7', name: 'testimonials', selector: 'testimonial17-wrapper', style: 'accent', blocks: ['cards-testimonial'], defaultContent: [] },
    { id: 'rc8', name: 'contact', selector: 'contact10-wrapper', style: null, blocks: ['cards-contact'], defaultContent: [] },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-intro': heroIntroParser,
  'cards-services': cardsServicesParser,
  'cards-pricing': cardsPricingParser,
  'columns-steps': columnsStepsParser,
  'cards-testimonial': cardsTestimonialParser,
  'cards-contact': cardsContactParser,
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

    // 6. Generate sanitized path
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
