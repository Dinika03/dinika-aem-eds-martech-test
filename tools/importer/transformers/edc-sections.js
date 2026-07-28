/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: EDC (www.edc.ca) section breaks + section metadata.
 *
 * EDC-specific companion to remarkable-sections.js (homepage) and
 * offer-page-sections.js (our-offer-page). Reads payload.template.sections
 * (from page-templates.json) and, for each section:
 *   - inserts an <hr> before the section element (except the first section)
 *   - appends a "Section Metadata" block after the section element when the
 *     section defines a `style`.
 *
 * For edc-test-page there are 8 sections, yielding 7 <hr> section breaks and
 * 2 Section Metadata blocks:
 *   - promo bar  (div.homepage-flag:nth-of-type(2), style: promo-bar)
 *   - solutions-finder CTA band (section.c-triage-cta, style: accent)
 *
 * ⚠️ Runs in beforeTransform (NOT afterTransform). On this site the section
 * boundaries ARE the block wrapper elements (div.top-banner-comp,
 * section.knowledge-and-resources, div.export-trends, div.homepageproductcard,
 * section.c-triage-cta, section.trade-expertise-highlights,
 * div.homepage-flag). Block parsers replace those wrappers with block tables
 * between the beforeTransform and afterTransform hooks, so the <hr> breaks and
 * Section Metadata must be inserted around the wrappers BEFORE parsing while
 * they still exist. The inserted <hr>/metadata siblings survive the subsequent
 * parser replaceWith() calls and keep their positions. This mirrors the fix
 * applied to offer-page-sections.js.
 *
 * Section selectors are consumed generically from payload.template.sections;
 * they were verified against migration-work/cleaned.html for edc-test-page.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    if (sections.length < 2) return;

    const doc = element.ownerDocument;

    // Reverse order keeps earlier section elements at stable positions while
    // we insert <hr> / Section Metadata around later ones.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section || !section.selector) continue;

      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Section Metadata block (only when the section defines a style).
      if (section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        if (sectionEl.nextSibling) {
          sectionEl.parentNode.insertBefore(metadataBlock, sectionEl.nextSibling);
        } else {
          sectionEl.parentNode.appendChild(metadataBlock);
        }
      }

      // Section break before every section except the first.
      if (i > 0) {
        const hr = doc.createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    }
  }
}
