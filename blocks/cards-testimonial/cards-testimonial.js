import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-testimonial-card-image';
      else div.className = 'cards-testimonial-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    // SVGs must not be run through createOptimizedPicture: it emits a webp
    // <source> that most origins can't transcode, leaving a broken image.
    if (/\.svg(\?|$)/i.test(img.src)) return;
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);

  // Carousel: show one testimonial at a time with prev/next arrows.
  const slides = [...ul.children];
  if (slides.length <= 1) return;

  let current = 0;
  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === current);
    });
  };

  const controls = document.createElement('div');
  controls.className = 'cards-testimonial-controls';

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'cards-testimonial-prev';
  prev.setAttribute('aria-label', 'Previous testimonial');
  prev.addEventListener('click', () => show(current - 1));

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'cards-testimonial-next';
  next.setAttribute('aria-label', 'Next testimonial');
  next.addEventListener('click', () => show(current + 1));

  controls.append(prev, next);
  block.append(controls);

  show(0);
}
