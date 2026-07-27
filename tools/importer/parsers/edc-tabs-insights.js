/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-insights. Base: tabs. Source: https://www.edc.ca/ (div.export-trends).
 * JS-driven tabs. Structure: 2 columns per row = [tab label | tab content].
 *   Row 1: block name (auto)
 *   Each tab row: cell 1 = tab label, cell 2 = that tab's article cards + "More resources" link
 * The static DOM contains all tab panels (panel0/panel1/panel2). Labels and panels are
 * paired by DOM order. If a tab has no matching panel content, an empty content cell is emitted.
 * Generated: 2026-07-24
 */
export default function parse(element, { document }) {
  const tabButtons = Array.from(element.querySelectorAll('.tabs > button, .tabs button'));
  const panels = Array.from(element.querySelectorAll('.tab-panels > .tab-content, .tab-content'));

  const cells = [];

  tabButtons.forEach((btn, i) => {
    // Tab label: prefer the inner label/text
    const label = btn.querySelector('label') || btn;
    const labelText = (label.textContent || '').trim();
    const labelEl = document.createElement('p');
    labelEl.textContent = labelText;

    // Corresponding panel content (paired by index)
    const panel = panels[i];
    const contentCell = [];

    if (panel) {
      const cardEls = Array.from(panel.querySelectorAll('.cards-container > .card, .card'));
      cardEls.forEach((card) => {
        const fullLink = card.querySelector('a.full-link, a[href]');
        const img = card.querySelector('.card-image img, img');
        const heading = card.querySelector('.card-link-title h3, h3, .title, [class*="title"]');

        if (img) contentCell.push(img);

        if (heading) {
          if (fullLink && fullLink.getAttribute('href')) {
            const link = document.createElement('a');
            link.href = fullLink.getAttribute('href');
            link.textContent = (heading.textContent || '').trim();
            contentCell.push(link);
          } else {
            contentCell.push(heading);
          }
        }
      });

      // "More resources" / "More market info" link at the bottom of the panel
      const moreLink = panel.querySelector('a.more-link, a[class*="more"]');
      if (moreLink && moreLink.getAttribute('href')) {
        const ml = document.createElement('a');
        ml.href = moreLink.getAttribute('href');
        ml.textContent = (moreLink.textContent || '').trim() || 'More resources';
        contentCell.push(ml);
      }
    }

    // Always emit a row per tab label; content cell may be empty for tabs without static content.
    cells.push([[labelEl], contentCell.length ? contentCell : ['']]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-insights', cells });
  element.replaceWith(block);
}
