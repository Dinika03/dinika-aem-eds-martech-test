/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-edc. Base: hero. Source: https://www.edc.ca/ (div.top-banner-comp).
 * Structure: 1 column, 3 rows.
 *   Row 1: block name (auto)
 *   Row 2: background image
 *   Row 3: heading + paragraph + CTA link
 * Generated: 2026-07-24
 */
export default function parse(element, { document }) {
  // Background image lives in the .bkg-image picture (fallback: first picture/img in the banner)
  const bgPicture = element.querySelector('.bkg-image picture, .bkg-image img');
  const bgImage = bgPicture || element.querySelector('picture, img');

  // Text content lives in .banner-content .body
  const content = element.querySelector('.banner-content .body, .banner-content') || element;
  const heading = content.querySelector('h1, h2, .title, [class*="title"]');
  const description = content.querySelector('p, .description, [class*="description"]');
  const cta = content.querySelector('a.c-interaction-button, .banner-content a[href], a[class*="button"]');

  const cells = [];

  // Row 2: background image (optional)
  if (bgImage) cells.push([bgImage]);

  // Row 3: heading + paragraph + CTA (single cell holding all elements)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (cta) contentCell.push(cta);
  cells.push([contentCell]);

  if (!heading && !description && !cta) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-edc', cells });
  element.replaceWith(block);
}
