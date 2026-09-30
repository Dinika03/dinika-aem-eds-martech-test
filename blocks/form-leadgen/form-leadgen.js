/**
 * Form (lead-gen): simple email signup rendered from authored rows.
 *
 * Rows (all optional except the field row):
 *   Field   | label text              | placeholder text
 *   Consent | consent / legal text
 *   Submit  | button label (link = optional thank-you / next-step URL)
 *   Success | message shown after submit
 *
 * The first cell of each row is a key. Rows without a recognised key fall back
 * by shape: 2 cells = field, a cell holding only a link = submit, otherwise consent.
 * There is no backend: submit validates the email, dispatches a
 * `form-leadgen:submit` event (for martech/analytics hooks) and shows the
 * success message.
 * @param {Element} block The block element
 */

const KEYS = ['field', 'email', 'consent', 'submit', 'button', 'success', 'thank you'];

let formCount = 0;

/** a cell whose only content is one link (an authored button) */
function isButtonOnly(cell) {
  const links = cell?.querySelectorAll('a') || [];
  return links.length === 1 && links[0].textContent.trim() === cell.textContent.trim();
}

function readRows(block) {
  const config = {};
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const key = cells[0]?.textContent.trim().toLowerCase().replace(/:$/, '');
    const keyed = cells.length > 1 && KEYS.includes(key);
    const values = keyed ? cells.slice(1) : cells;

    if (keyed && (key === 'field' || key === 'email')) {
      config.label = values[0]?.textContent.trim();
      config.placeholder = values[1]?.textContent.trim();
    } else if (keyed && key === 'consent') {
      [config.consent] = values;
    } else if (keyed && (key === 'submit' || key === 'button')) {
      [config.submit] = values;
    } else if (keyed && (key === 'success' || key === 'thank you')) {
      [config.success] = values;
    } else if (!keyed && cells.length === 2 && !config.label) {
      config.label = cells[0].textContent.trim();
      config.placeholder = cells[1].textContent.trim();
    } else if (!keyed && !config.submit && isButtonOnly(cells[0])) {
      [config.submit] = cells;
    } else if (!keyed && !config.consent) {
      [config.consent] = cells;
    } else if (!keyed && !config.submit) {
      [config.submit] = cells;
    }
  });
  return config;
}

export default function decorate(block) {
  const config = readRows(block);
  formCount += 1;
  const inputId = `form-leadgen-email-${formCount}`;
  const consentId = `form-leadgen-consent-${formCount}`;

  const form = document.createElement('form');
  form.noValidate = true;

  const field = document.createElement('div');
  field.className = 'form-leadgen-field';
  const label = document.createElement('label');
  label.htmlFor = inputId;
  label.textContent = config.label || 'Business e-mail address:';
  const input = document.createElement('input');
  input.type = 'email';
  input.id = inputId;
  input.name = 'email';
  input.required = true;
  input.autocomplete = 'email';
  input.placeholder = config.placeholder || '';
  const error = document.createElement('p');
  error.className = 'form-leadgen-error';
  error.id = `${inputId}-error`;
  error.setAttribute('aria-live', 'polite');
  input.setAttribute('aria-describedby', error.id);
  field.append(label, input, error);

  const actions = document.createElement('div');
  actions.className = 'form-leadgen-actions';
  if (config.consent) {
    const consent = document.createElement('div');
    consent.className = 'form-leadgen-consent';
    consent.id = consentId;
    consent.append(...config.consent.childNodes);
    input.setAttribute('aria-describedby', `${error.id} ${consentId}`);
    actions.append(consent);
  }

  const link = config.submit?.querySelector('a');
  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'form-leadgen-submit';
  button.textContent = (link || config.submit)?.textContent.trim() || 'Submit';
  actions.append(button);

  const success = document.createElement('div');
  success.className = 'form-leadgen-success';
  success.setAttribute('role', 'status');
  success.hidden = true;
  if (config.success) success.append(...config.success.childNodes);
  else success.textContent = 'Thank you. Please check your inbox.';

  form.append(field, actions);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value || !input.checkValidity()) {
      error.textContent = 'Please enter a valid e-mail address.';
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    error.textContent = '';
    input.removeAttribute('aria-invalid');
    block.dispatchEvent(new CustomEvent('form-leadgen:submit', {
      bubbles: true,
      detail: { email: value, target: link?.href },
    }));
    if (link?.href) {
      window.location.href = link.href;
      return;
    }
    form.hidden = true;
    success.hidden = false;
  });

  block.replaceChildren(form, success);
}
