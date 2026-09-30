/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion. Source: https://www.edc.ca/en/solutions/insurance/credit-insurance.html
 * Selector: div.new-accordion. The section H2 is kept as default content BEFORE the block.
 * Structure: one row per item = question | answer.
 * Items: .accordionitem div wrappers (iteration is not keyed on the <button>).
 *   question: .panel-label span text; answer: .panel-content .cmp-text children
 *   (collapsed / aria-hidden panels are read directly from the DOM).
 * Validated against migration-work/block-context/accordion-faq/source.html
 */
export default function parse(element, { document }) {
  const sectionHeading = element.querySelector(':scope > h2');

  let items = [...element.querySelectorAll('.accordionitem')];
  if (!items.length) items = [...element.querySelectorAll('.panel')];

  const cells = [];
  items.forEach((item) => {
    const label = item.querySelector('.panel-label span')
      || item.querySelector('.panel-label')
      || item.querySelector('.button-heading, h3');
    const questionText = label ? label.textContent.replace(/\s+/g, ' ').trim() : '';
    if (!questionText) return;

    const panel = item.querySelector('.panel-content');
    let answer = [];
    if (panel) {
      const texts = [...panel.querySelectorAll('.cmp-text')];
      const sources = texts.length ? texts : [panel];
      sources.forEach((src) => {
        [...src.children].forEach((n) => {
          if (n.textContent.trim() || n.querySelector('img')) answer.push(n);
        });
      });
      if (!answer.length && panel.textContent.trim()) answer = [panel.textContent.trim()];
    }

    const q = document.createElement('p');
    q.textContent = questionText;
    cells.push([q, answer.length ? answer : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  if (sectionHeading) element.before(sectionHeading);

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
