/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: EDC credit-insurance page section breaks + section metadata
 * (template edc-credit-insurance, 8 sections -> 7 <hr>, 1 Section Metadata).
 *
 * Section boundaries come from payload.template.sections[].selector (array,
 * tried in order, first match wins). Each boundary is the FIRST element of
 * its section, so the <hr> lands before all of that section's content:
 *   rc1 div.l2header                    hero (first section, no break)
 *   rc2 div.text...--phone--none...--default--12  H2 + intro div, followed by
 *       the 3 benefit column divs (div.text...--default--4)
 *   rc3 div.producthighlightbanner
 *   rc4 div.text.aem-GridColumn--phone--hide  H2/p div, followed by
 *       div.table (section.table) and div.triagecta (section.c-triage-cta)
 *   rc5 div.bluebackgroundcontainer (fallback div.gatedleadgenform) — style light-blue
 *   rc6 div.testimonialquote
 *   rc7 div.accordionwrapper
 *   rc8 div.inquirysubmission, followed by div.modifieddate (the feedback
 *       wrapper in between is removed by credit-cleanup.js)
 * All selectors verified against migration-work/cleaned.html.
 *
 * <hr> breaks are inserted in beforeTransform (parsers may replace section
 * elements between hooks); Section Metadata is inserted in afterTransform,
 * anchored to the surviving section element (placed after it, i.e. inside the
 * section) or, if the element was replaced, to the marker <hr>.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };
const SECTION_MARKER_ATTR = 'data-excat-section-id';

function toSelectorList(selector) {
  if (!selector) return [];
  return Array.isArray(selector) ? selector : [selector];
}

// section.selector is an array of candidate selectors — first match wins.
function querySection(root, selector) {
  const list = toSelectorList(selector);
  for (let i = 0; i < list.length; i += 1) {
    const el = root.querySelector(list[i]);
    if (el) return el;
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const template = payload && payload.template;
  const sections = template && Array.isArray(template.sections) ? template.sections : [];
  if (sections.length < 2) return;
  const doc = element.ownerDocument || document;

  if (hookName === TransformHook.beforeTransform) {
    // Reverse order: inserting before a live element never shifts sections
    // that have not been processed yet.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section) continue;
      if (i === 0 && !section.style) continue;
      const sectionEl = querySection(element, section.selector);
      if (!sectionEl) continue;

      const hr = doc.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === TransformHook.afterTransform) {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section || !section.style) continue;

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      const sectionEl = querySection(element, section.selector);
      const anchor = sectionEl || marker;
      if (!anchor) continue;

      const metadataBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metadataBlock);

      if (marker) {
        marker.removeAttribute(SECTION_MARKER_ATTR);
        if (i === 0) marker.remove();
      }
    }
  }
}
