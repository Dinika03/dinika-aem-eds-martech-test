/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-services (our-offer-page variant).
 * Base block: cards
 * Source: https://remarketabletemplateaepdinika.netlify.app/our-offer-page
 * Selectors: features24-wrapper AND features25-wrapper (both share this structure)
 * Generated: 2026-07-24
 *
 * Library structure (cards): 2 columns.
 *   Row 1: block name.
 *   Each subsequent row = one card: cell 1 image/icon, cell 2 title + description.
 *
 * Source variation (teleporthq features24/features25): the three card images
 * live together in <div class="features2X-image-container"> as
 * .features2X-image1/2/3, while the three matching text blocks live in
 * <div class="features2X-content1/2/3"> (each an <h2> title + a <span>
 * description). Images and content are paired positionally (image[i] pairs
 * with content[i]) to build one 2-column card row per service.
 */
export default function parse(element, { document }) {
  // Images and content blocks are addressed with prefix-agnostic selectors so
  // the same parser works for features24-wrapper and features25-wrapper.
  const images = Array.from(element.querySelectorAll('[class*="image-container"] img'));
  const contents = Array.from(element.querySelectorAll('[class*="-content1"], [class*="-content2"], [class*="-content3"]'));

  // Empty-block guard
  if (images.length === 0 && contents.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  const cardCount = Math.max(images.length, contents.length);

  for (let i = 0; i < cardCount; i += 1) {
    const image = images[i];
    const content = contents[i];

    const textCell = [];
    if (content) {
      const heading = content.querySelector('h1, h2, h3, h4, [class*="heading"]');
      // Description is the body span that is a direct child of the content
      // block (the heading also contains a nested span, so scope to direct
      // children to avoid re-selecting the heading text).
      const desc = content.querySelector(':scope > span[class*="body"], :scope > span, :scope > p');
      if (heading) textCell.push(heading);
      if (desc && desc !== heading) textCell.push(desc);
    }

    // 2-column card row: [ image cell, text cell ]
    cells.push([image || '', textCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-services', cells });
  element.replaceWith(block);
}
