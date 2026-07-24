/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: our-offer-page section breaks + section metadata.
 *
 * Offer-page-specific companion to remarkable-sections.js (homepage). Runs in
 * afterTransform only. Reads payload.template.sections (from
 * page-templates.json) and, for each section:
 *   - inserts an <hr> before the section element (except the first section)
 *   - appends a "Section Metadata" block after the section element when the
 *     section defines a `style`.
 *
 * For our-offer-page there are 8 sections, yielding 7 <hr> section breaks and
 * 2 Section Metadata (style: accent) blocks: the CTA banner
 * (a.our-offer-page-navlink3) and the testimonials grid (testimonial17-wrapper).
 *
 * Sections are processed in reverse order so that inserting nodes does not
 * shift the positions of sections not yet processed. Section selectors
 * (hero17-wrapper, features24-wrapper, a.our-offer-page-navlink3,
 * features25-wrapper, a.our-offer-page-navlink4, steps2-wrapper,
 * testimonial17-wrapper, contact10-wrapper) were verified against
 * migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  // Runs in beforeTransform: the section boundaries on this page ARE the block
  // wrapper elements (hero17-wrapper, features24-wrapper, ...). Parsers replace
  // those wrappers with block tables during block parsing, so the <hr> breaks
  // and Section Metadata must be inserted around them BEFORE parsing, while the
  // wrappers still exist. The inserted <hr>/metadata siblings survive the
  // subsequent replaceWith() calls and keep their positions.
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
