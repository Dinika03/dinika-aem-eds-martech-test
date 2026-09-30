/* eslint-disable */
/* global WebImporter */
/**
 * Parser for form-leadgen. Custom block. Source: https://www.edc.ca/en/solutions/insurance/credit-insurance.html
 * Selector: section.c-gated-lead-gen-form. Only the visible e-mail step (form.email-section)
 * is imported; hidden later steps / thank-you / processing screens are ignored.
 * The intro H2 + paragraph become default content inserted BEFORE the block.
 * Block rows (keyed):
 *   Field   | Business e-mail address: | example@edc.ca
 *   Consent | consent text
 *   Submit  | Access your guide
 * Validated against migration-work/block-context/form-leadgen/source.html
 */
export default function parse(element, { document }) {
  const form = element.querySelector('form.email-section') || element.querySelector('form') || element;

  const heading = form.querySelector('.form-wrapper h2') || form.querySelector('h2');
  let intro = null;
  if (heading) {
    let sib = heading.nextElementSibling;
    while (sib && sib.tagName !== 'P' && !sib.matches('.form-group, .form-disclaimer')) sib = sib.nextElementSibling;
    if (sib && sib.tagName === 'P' && sib.textContent.trim()) intro = sib;
  }

  const group = form.querySelector('.form-group');
  const label = group ? group.querySelector('label') : form.querySelector('label');
  const input = form.querySelector('input[type="email"]')
    || form.querySelector('input.email-submit')
    || form.querySelector('input[name="emailAddress"], input#emailAddress');
  const consent = form.querySelector('.form-disclaimer .text') || form.querySelector('.form-disclaimer');
  const button = form.querySelector('button[type="submit"]') || form.querySelector('button, input[type="submit"]');

  const cells = [];
  const labelText = label ? label.textContent.trim() : '';
  // Source placeholder is "example@edc.ca"; fall back to it when attributes were stripped.
  const placeholder = (input && (input.getAttribute('placeholder') || '').trim()) || 'example@edc.ca';
  if (labelText || placeholder) cells.push(['Field', labelText || 'Business e-mail address:', placeholder]);

  if (consent) {
    const consentNodes = [...consent.querySelectorAll(':scope > p')].filter((p) => p.textContent.trim());
    if (consentNodes.length) cells.push(['Consent', consentNodes, '']);
    else if (consent.textContent.trim()) cells.push(['Consent', consent.textContent.trim(), '']);
  }

  const buttonText = button ? (button.textContent || button.value || '').trim() : '';
  if (buttonText) cells.push(['Submit', buttonText, '']);

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Default content before the block.
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    element.before(h2);
  }
  if (intro) element.before(intro);

  const block = WebImporter.Blocks.createBlock(document, { name: 'form-leadgen', cells });
  element.replaceWith(block);
}
