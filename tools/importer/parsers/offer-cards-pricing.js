/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-pricing (our-offer-page variant).
 * Base block: cards
 * Source: https://remarketabletemplateaepdinika.netlify.app/our-offer-page
 * Selector: a.our-offer-page-navlink4 (wraps pricing14-wrapper)
 * Generated: 2026-07-24
 *
 * Library structure (cards, 'no images' variant): 1 column.
 *   Row 1: block name.
 *   Each subsequent row = one card in a single cell: heading + description +
 *   optional CTA. Pricing plans carry no photographic image (only decorative
 *   SVG check icons in the feature list), so the 1-column 'no images' cards
 *   layout is used.
 *
 * Source variation (teleporthq pricing14): plan cards are
 * <div class="pricing14-column1/2/3 thq-card"> (columns 4-6 are yearly-tab
 * duplicates of the same three plans, so only the first three are used). Each
 * card has a plan name <p>, price <h3>, secondary price <p>, a feature list
 * (.pricing14-listN with .pricing14-list-item* rows), and a CTA <button>.
 */
export default function parse(element, { document }) {
  // Only the first three plan columns; columns 4-6 are yearly duplicates.
  const planCards = Array.from(element.querySelectorAll('[class*="pricing14-column1"], [class*="pricing14-column2"], [class*="pricing14-column3"]'));

  // Empty-block guard
  if (planCards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  planCards.forEach((card) => {
    const contentCell = [];

    // Plan header: name (<p>), price (<h3>) and secondary price (<p>) live in
    // the inner price group (e.g. .pricing14-price11/13/15). The outer
    // .pricing14-price10 wrapper nests both this group and the feature list, so
    // target the inner group specifically and take its direct-child headings.
    const priceGroups = Array.from(card.querySelectorAll('[class*="pricing14-price1"]'));
    // Innermost group is the deepest matching element (has no nested price group).
    const priceWrapper = priceGroups.find((g) => !g.querySelector('[class*="pricing14-price1"]')) || card;
    Array.from(priceWrapper.querySelectorAll(':scope > p, :scope > h2, :scope > h3')).forEach((el) => {
      contentCell.push(el);
    });

    // Feature list: build a real <ul> so each feature label is preserved.
    const featureItems = Array.from(card.querySelectorAll('[class*="pricing14-list-item"]'));
    if (featureItems.length) {
      const ul = document.createElement('ul');
      featureItems.forEach((item) => {
        const label = item.querySelector('span[class*="body"], span');
        const li = document.createElement('li');
        li.textContent = (label ? label.textContent : item.textContent || '').trim();
        if (li.textContent) ul.append(li);
      });
      if (ul.children.length) contentCell.push(ul);
    }

    // CTA button -> anchor (buttons carry no href).
    const ctaBtn = card.querySelector('button');
    if (ctaBtn) {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = (ctaBtn.textContent || '').trim();
      if (a.textContent) contentCell.push(a);
    }

    // 1-column 'no images' card: single cell holds all plan content.
    cells.push([contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-pricing', cells });
  element.replaceWith(block);
}
