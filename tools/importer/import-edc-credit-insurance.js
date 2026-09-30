/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS (credit-insurance parsers; other templates use separate parsers)
import heroPageParser from './parsers/credit-hero-page.js';
import columnsBenefitsParser from './parsers/credit-columns-benefits.js';
import columnsHighlightParser from './parsers/credit-columns-highlight.js';
import tableCompareParser from './parsers/credit-table-compare.js';
import ctaBandParser from './parsers/credit-cta-band.js';
import formLeadgenParser from './parsers/credit-form-leadgen.js';
import columnsTestimonialParser from './parsers/credit-columns-testimonial.js';
import accordionFaqParser from './parsers/credit-accordion-faq.js';
import columnsInquiryParser from './parsers/credit-columns-inquiry.js';

// TRANSFORMER IMPORTS (credit-insurance specific)
import cleanupTransformer from './transformers/credit-cleanup.js';
import sectionsTransformer from './transformers/credit-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  "name": "edc-credit-insurance",
  "description": "EDC credit insurance solution page. Imported to /dinika-edc-credit-insurance-test. Uses EDC nav/footer; body links rewritten to /.",
  "urls": [
    "https://www.edc.ca/en/solutions/insurance/credit-insurance.html"
  ],
  "blocks": [
    {
      "name": "hero-page",
      "instances": [
        "header.c-l2-header"
      ]
    },
    {
      "name": "columns-benefits",
      "instances": [
        "div.text.aem-GridColumn--default--4"
      ]
    },
    {
      "name": "columns-highlight",
      "instances": [
        "div.product-highlight-banner"
      ]
    },
    {
      "name": "table-compare",
      "instances": [
        "section.table"
      ]
    },
    {
      "name": "cta-band",
      "instances": [
        "section.c-triage-cta"
      ]
    },
    {
      "name": "form-leadgen",
      "instances": [
        "section.c-gated-lead-gen-form"
      ]
    },
    {
      "name": "columns-testimonial",
      "instances": [
        "section.c-testimonial-quote"
      ]
    },
    {
      "name": "accordion-faq",
      "instances": [
        "div.new-accordion"
      ]
    },
    {
      "name": "columns-inquiry",
      "instances": [
        "section.inquiry-submission"
      ]
    }
  ],
  "sections": [
    {
      "id": "rc1",
      "name": "page-header",
      "selector": [
        "div.l2header"
      ],
      "style": null,
      "blocks": [
        "hero-page"
      ],
      "defaultContent": []
    },
    {
      "id": "rc2",
      "name": "benefits",
      "selector": [
        "div.text.aem-GridColumn--phone--none.aem-GridColumn--default--12"
      ],
      "style": null,
      "blocks": [
        "columns-benefits"
      ],
      "defaultContent": [
        "div.text.aem-GridColumn--phone--none.aem-GridColumn--default--12 h2",
        "div.text.aem-GridColumn--phone--none.aem-GridColumn--default--12 p"
      ]
    },
    {
      "id": "rc3",
      "name": "highlight",
      "selector": [
        "div.producthighlightbanner"
      ],
      "style": null,
      "blocks": [
        "columns-highlight"
      ],
      "defaultContent": []
    },
    {
      "id": "rc4",
      "name": "coverage-options",
      "selector": [
        "div.text.aem-GridColumn--phone--hide"
      ],
      "style": null,
      "blocks": [
        "table-compare",
        "cta-band"
      ],
      "defaultContent": [
        "div.text.aem-GridColumn--phone--hide h2",
        "div.text.aem-GridColumn--phone--hide p"
      ]
    },
    {
      "id": "rc5",
      "name": "lead-gen",
      "selector": [
        "div.bluebackgroundcontainer",
        "div.gatedleadgenform"
      ],
      "style": "light-blue",
      "blocks": [
        "form-leadgen"
      ],
      "defaultContent": [
        "section.c-gated-lead-gen-form h2",
        "section.c-gated-lead-gen-form h2 + p"
      ]
    },
    {
      "id": "rc6",
      "name": "testimonial",
      "selector": [
        "div.testimonialquote"
      ],
      "style": null,
      "blocks": [
        "columns-testimonial"
      ],
      "defaultContent": []
    },
    {
      "id": "rc7",
      "name": "faq",
      "selector": [
        "div.accordionwrapper"
      ],
      "style": null,
      "blocks": [
        "accordion-faq"
      ],
      "defaultContent": [
        "div.new-accordion > h2"
      ]
    },
    {
      "id": "rc8",
      "name": "inquiry",
      "selector": [
        "div.inquirysubmission"
      ],
      "style": null,
      "blocks": [
        "columns-inquiry"
      ],
      "defaultContent": [
        "div.modifieddate"
      ]
    }
  ]
};

// PARSER REGISTRY
const parsers = {
  'hero-page': heroPageParser,
  'columns-benefits': columnsBenefitsParser,
  'columns-highlight': columnsHighlightParser,
  'table-compare': tableCompareParser,
  'cta-band': ctaBandParser,
  'form-leadgen': formLeadgenParser,
  'columns-testimonial': columnsTestimonialParser,
  'accordion-faq': accordionFaqParser,
  'columns-inquiry': columnsInquiryParser,
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

    // 6. Generate sanitized path — content must land at /dinika-edc-credit-insurance-test
    // (override the source path).
    const path = WebImporter.FileUtils.sanitizePath('/dinika-edc-credit-insurance-test');

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
