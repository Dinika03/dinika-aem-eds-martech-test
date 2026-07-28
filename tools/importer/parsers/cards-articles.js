/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-articles.
 * Base block: cards (no images variant)
 * Source: https://remarketabletemplateaepdinika.netlify.app/
 * Generated: 2026-07-23
 *
 * Library structure (cards, no images): 1 column.
 *   Row 1: block name.
 *   Each subsequent row = one article: heading + description + 'Read more' CTA.
 *
 * Source: each article is a .home-section* div with an h3 heading, description
 * paragraphs, and a "Read more" <button> (no href). The button is converted to
 * a link so it authors as a CTA.
 */
export default function parse(element, { document }) {
  // Each article card is a .home-section* div (home-section1..home-section4)
  const articles = Array.from(element.querySelectorAll('[class*="home-section"]'));

  // Empty-block guard
  if (articles.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  articles.forEach((article) => {
    const heading = article.querySelector('h1, h2, h3, h4, [class*="header"] h3');
    const paras = Array.from(article.querySelectorAll('[class*="description"] p, p'));
    const cta = article.querySelector('a.button, a[class*="navlink"]');
    const ctaButton = article.querySelector('button');

    const contentCell = [];
    if (heading) contentCell.push(heading);
    paras.forEach((p) => contentCell.push(p));

    if (cta) {
      contentCell.push(cta);
    } else if (ctaButton) {
      // Convert the "Read more" button into an authorable CTA link.
      // Source buttons have no href; point them to the offers page.
      const link = document.createElement('a');
      link.href = '/our-offer-page';
      link.textContent = (ctaButton.textContent || 'Read more').trim();
      contentCell.push(link);
    }

    // 1-column card row: single cell holding heading + description + CTA
    cells.push([contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-articles', cells });
  element.replaceWith(block);
}
