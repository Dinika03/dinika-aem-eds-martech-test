/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-intro.
 * Base block: hero
 * Source: https://remarketabletemplateaepdinika.netlify.app/
 * Generated: 2026-07-23
 *
 * Library structure (hero): 1 column, 3 rows.
 *   Row 1: block name
 *   Row 2: background image (optional)
 *   Row 3: title (heading) + subheading + CTA
 *
 * Source variation: this hero has a heading, a supporting description, and
 * three lifestyle images (no dedicated background image, no CTA). All content
 * is placed into the single content cell of a 1-column hero.
 */
export default function parse(element, { document }) {
  // INPUT EXTRACTION (validated against source.html)
  const heading = element.querySelector('h1, h2, [class*="title"]');
  // description lives in a <span class="home-description1"> in source
  const description = element.querySelector('.home-description1, span[class*="description"], p');
  // All images in the hero (single image in .home-content1 + two in .home-image11)
  const images = Array.from(element.querySelectorAll('img'));
  const ctaLinks = Array.from(element.querySelectorAll('a'));

  // Empty-block guard
  if (!heading && !description && images.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // 1-column hero: single content cell holding heading, description, images, CTAs
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  images.forEach((img) => contentCell.push(img));
  ctaLinks.forEach((a) => contentCell.push(a));

  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-intro', cells });
  element.replaceWith(block);
}
