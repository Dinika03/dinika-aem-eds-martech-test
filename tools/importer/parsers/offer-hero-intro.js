/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-intro (our-offer-page variant).
 * Base block: hero
 * Source: https://remarketabletemplateaepdinika.netlify.app/our-offer-page
 * Selector: hero17-wrapper
 * Generated: 2026-07-24
 *
 * Library structure (hero): 1 column, 3 rows.
 *   Row 1: block name
 *   Row 2: background image (optional)
 *   Row 3: title (heading) + subheading + CTA(s)
 *
 * Source variation (teleporthq hero17): heading in <h1 class="hero17-text1">,
 * supporting copy in <p class="hero17-text2">, two CTA <button> elements in
 * <div class="hero17-actions">, and many decorative animated <img> tiles.
 * There is no dedicated background image, so all authorable content is placed
 * into the single content cell of a 1-column hero. Buttons are converted to
 * links so the CTA text survives (buttons carry no href, so a placeholder
 * anchor keeps the label; href resolves to '#').
 */
export default function parse(element, { document }) {
  // INPUT EXTRACTION (validated against source.html)
  const heading = element.querySelector('h1, h2, .hero17-text1, [class*="text1"]');
  const description = element.querySelector('.hero17-text2, p[class*="text2"], p');

  // CTAs are <button> elements in .hero17-actions; convert to anchors so text
  // is preserved as a call-to-action in the hero content cell.
  const actionButtons = Array.from(element.querySelectorAll('.hero17-actions button'));
  const ctas = actionButtons.map((btn) => {
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = (btn.textContent || '').trim();
    return a;
  }).filter((a) => a.textContent);

  // Decorative hero images (animated tiles). Included per hero content model.
  const images = Array.from(element.querySelectorAll('img'));

  // Empty-block guard
  if (!heading && !description && images.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // 1-column hero: single content cell holding heading, description, CTAs, images.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  ctas.forEach((a) => contentCell.push(a));
  images.forEach((img) => contentCell.push(img));

  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-intro', cells });
  element.replaceWith(block);
}
