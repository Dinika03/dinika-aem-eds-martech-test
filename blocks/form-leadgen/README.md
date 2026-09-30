# form-leadgen

Custom **form** block. Purpose: lead-gen.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: label + email input + consent text + submit.

## Supported variations

No variations.

## Universal Editor fields

- Content fields derived from the block's decorate contract.

## Content structure

| Form Leadgen | | |
| --- | --- | --- |
| Field | Business e-mail address: | example@edc.ca |
| Consent | consent / legal text (links allowed) | |
| Submit | Access your guide (optionally a link to a thank-you / next-step URL) | |
| Success | message shown after submit (optional) | |

The first-cell keys (Field, Consent, Submit, Success) are recommended. Without keys: a 2-cell row is the field (label | placeholder), then the consent text row, then the button label row. No backend: submit validates the e-mail, fires a `form-leadgen:submit` DOM event (detail: `{ email, target }`) for martech hooks, then redirects to the Submit link if there is one, or shows the success message.
