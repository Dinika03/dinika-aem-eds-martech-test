/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Remarkable section breaks + section metadata.
 *
 * Runs in afterTransform only. Reads payload.template.sections (from
 * page-templates.json) and, for each section:
 *   - inserts an <hr> before the section element (except the first section)
 *   - appends a "Section Metadata" block after the section element when the
 *     section defines a `style`.
 *
 * Sections are processed in reverse order so that inserting nodes does not
 * shift the positions of sections not yet processed. Section selectors
 * (e.g. section.home-hero, section.home-testimonials) were verified against
 * migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
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
