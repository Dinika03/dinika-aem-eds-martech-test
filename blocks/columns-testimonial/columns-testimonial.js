/**
 * Columns (testimonial): bordered card with a large quote glyph, quote text and
 * author (left) beside a photo with an overlaid "read the story" link (right).
 * Row structure: quote + author name + author title | image + link.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('columns-testimonial-row');
    const cells = [...row.children];
    const mediaCell = cells.find((cell) => cell.querySelector('picture'));
    const quoteCell = cells.find((cell) => cell !== mediaCell);

    if (quoteCell) {
      quoteCell.classList.add('columns-testimonial-quote');
      const figure = document.createElement('figure');
      const quote = document.createElement('blockquote');
      const caption = document.createElement('figcaption');
      // single-paragraph cells arrive as bare inline content; wrap loose inline runs in <p>
      const paragraphs = [];
      let run = null;
      [...quoteCell.childNodes].forEach((node) => {
        const isBlock = node.nodeType === Node.ELEMENT_NODE
          && /^(P|DIV|H[1-6]|UL|OL|BLOCKQUOTE)$/.test(node.tagName);
        if (isBlock) {
          run = null;
          paragraphs.push(node);
        } else if (node.nodeType === Node.ELEMENT_NODE || node.textContent.trim()) {
          if (!run) {
            run = document.createElement('p');
            paragraphs.push(run);
          }
          run.append(node);
        }
      });
      // the quote is everything before the first line that is (or starts with) bold/italic text;
      // the attribution (name in bold, title in italics) follows.
      const attrIndex = paragraphs.findIndex((p, i) => i > 0
        && (p.querySelector('strong, b, em, i') || /^[-–—]/.test(p.textContent.trim())));
      const splitAt = attrIndex === -1 ? paragraphs.length : attrIndex;
      paragraphs.forEach((p, i) => (i < splitAt ? quote : caption).append(p));
      figure.append(quote);
      if (caption.children.length) figure.append(caption);
      quoteCell.replaceChildren(figure);
    }

    if (mediaCell) {
      mediaCell.classList.add('columns-testimonial-media');
      const link = mediaCell.querySelector('a');
      if (link) {
        const linkWrap = link.closest('p') || link;
        linkWrap.classList.add('columns-testimonial-link');
      }
    } else {
      row.classList.add('no-image');
    }
  });
}
