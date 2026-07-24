export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const cols = [...row.children];
  block.classList.add(`columns-steps-${cols.length}-cols`);

  // First column is the header/intro column.
  if (cols[0]) cols[0].classList.add('columns-steps-header');

  // Second column contains alternating number/title paragraphs.
  const stepsCol = cols[1];
  if (!stepsCol) return;
  stepsCol.classList.add('columns-steps-list');

  const paras = [...stepsCol.querySelectorAll(':scope > p')];
  // Group into [number, title, (optional description)] steps.
  // Detect a number paragraph as a short numeric-only string (e.g. "01").
  const isNumber = (el) => /^\d{1,2}$/.test(el.textContent.trim());

  const steps = [];
  let current = null;
  paras.forEach((p) => {
    if (isNumber(p)) {
      current = { number: p, contents: [] };
      steps.push(current);
    } else if (current) {
      current.contents.push(p);
    }
  });

  if (!steps.length) return;

  stepsCol.textContent = '';
  steps.forEach((step) => {
    const card = document.createElement('div');
    card.className = 'columns-steps-card';

    const num = document.createElement('span');
    num.className = 'columns-steps-number';
    num.textContent = step.number.textContent.trim();

    const body = document.createElement('div');
    body.className = 'columns-steps-card-body';
    step.contents.forEach((el, i) => {
      // Promote the first content paragraph to a step title.
      if (i === 0) {
        const title = document.createElement('p');
        title.className = 'columns-steps-title';
        title.textContent = el.textContent;
        body.append(title);
      } else {
        body.append(el);
      }
    });

    card.append(num, body);
    stepsCol.append(card);
  });
}
