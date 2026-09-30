/**
 * Accordion (FAQ): each row is one item — question | answer.
 * Rendered as native <details>/<summary> (keyboard and screen-reader
 * accessible, collapsed by default).
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const [questionCell, ...answerCells] = [...row.children];
    if (!questionCell || !questionCell.textContent.trim()) {
      row.remove();
      return;
    }

    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-question';
    // unwrap a single paragraph / bold wrapper so the summary holds plain inline content
    const only = questionCell.children.length === 1 ? questionCell.firstElementChild : null;
    const source = only && only.tagName === 'P' ? only : questionCell;
    summary.append(...source.childNodes);

    const answer = document.createElement('div');
    answer.className = 'accordion-faq-answer';
    answerCells.forEach((cell) => answer.append(...cell.childNodes));

    const details = document.createElement('details');
    details.className = 'accordion-faq-item';
    details.append(summary, answer);
    row.replaceWith(details);
  });
}
