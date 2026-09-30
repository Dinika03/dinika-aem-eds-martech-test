/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-testimonial. Base: columns. Source: https://www.edc.ca/en/solutions/insurance/credit-insurance.html
 * Selector: section.c-testimonial-quote. Structure: 1 row x 2 cells =
 *   quote paragraph(s) + <strong>author</strong> + <em>author title</em> | image + story link.
 * Validated against migration-work/block-context/columns-testimonial/source.html
 * (blockquote #quote p; figcaption span.author + cite.title; .testimonial__image-wrapper img.cover-image
 *  + .testimonial__link-wrapper a.link). The decorative img.quote-icon is skipped.
 */
export default function parse(element, { document }) {
  const quoteWrap = element.querySelector('blockquote #quote')
    || element.querySelector('blockquote')
    || element.querySelector('.testimonial__block-quote-wrapper');
  const author = element.querySelector('figcaption .author');
  const title = element.querySelector('figcaption .title') || element.querySelector('figcaption cite');

  const quoteCell = [];
  if (quoteWrap) {
    const paras = [...quoteWrap.querySelectorAll('p')].filter((p) => p.textContent.trim());
    if (paras.length) {
      quoteCell.push(...paras);
    } else if (quoteWrap.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = quoteWrap.textContent.trim();
      quoteCell.push(p);
    }
  }
  if (author && author.textContent.trim()) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = author.textContent.trim();
    p.append(strong);
    quoteCell.push(p);
  }
  if (title && title !== author && title.textContent.trim()) {
    const p = document.createElement('p');
    const em = document.createElement('em');
    em.textContent = title.textContent.trim();
    p.append(em);
    quoteCell.push(p);
  }

  const mediaWrap = element.querySelector('.testimonial__image-wrapper') || element;
  const image = mediaWrap.querySelector('img.cover-image')
    || mediaWrap.querySelector('picture img, img:not(.quote-icon)');
  const link = mediaWrap.querySelector('.testimonial__link-wrapper a[href]')
    || mediaWrap.querySelector('a.link[href]');

  const mediaCell = [];
  if (image) mediaCell.push(image);
  if (link) {
    const p = document.createElement('p');
    p.append(link);
    mediaCell.push(p);
  }

  if (!quoteCell.length && !mediaCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[quoteCell.length ? quoteCell : '', mediaCell.length ? mediaCell : '']];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-testimonial', cells });
  element.replaceWith(block);
}
