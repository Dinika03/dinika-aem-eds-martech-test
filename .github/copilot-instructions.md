# Copilot Instructions — AEM Edge Delivery Services data layer

These rules apply to all Copilot Chat and Agent-mode interactions in this repository.

## Project

- This is an AEM Edge Delivery Services (EDS) project.
- Blocks (a.k.a. components) live in `blocks/<block-name>/<block-name>.js`
  and `blocks/<block-name>/<block-name>.css`. Some blocks also have a
  JSON model/definition file.
- Each block's JS exports `default function decorate(block) { ... }`.

## Specs are Excel; convert before reading

- Data layer specs are authored as **Excel files** (`.xlsx`), dropped under
  `datalayer-specs/incoming/`.
- Never parse `.xlsx` bytes directly. Always convert first with:
  `node scripts/spec-to-md.mjs <path-to.xlsx> <block-name>`
  which produces `datalayer-specs/<block-name>.spec.md`.
- The `.xlsx` is the source of truth; the generated `.spec.md` is the working
  copy the agent reads. A human confirms the generated `.spec.md` before code
  is written.

## Data layer rules (non-negotiable)

- Analytics is **event-driven** via the Adobe Client Data Layer, consumed by
  the **Data Layer Manager extension in Adobe Tags (Launch)**.
- Push events with `window.adobeDataLayer.push({ event, ... })`.
  Always guard first: `window.adobeDataLayer = window.adobeDataLayer || [];`
- **Never** call Adobe Analytics / WebSDK / `alloy` / `s.t()` / `_satellite`
  directly from block code. Blocks only push to the data layer.
- The **component name equals the block name** (the block folder name), but
  match the exact string the spec provides (e.g. `knowledge and resources`)
  wherever the spec asks for the component name.
- Build nested objects from dot-notation element paths
  (`eventInfo.eventName` -> `{ eventInfo: { eventName: ... } }`).

## Implementation constraints

- Attach listeners inside the block's `decorate()` function. No page-level
  globals unless the spec is page-scoped.
- Preserve the EDS performance model (eager / lazy / delayed). No blocking
  work or eager network calls for tracking.
- Do not modify content, authoring structure, styling, or existing block
  behavior. Only add the tracking code.
- Keep pushes idempotent — attach each listener once per element.

## Workflow constraints

- Never commit or push to `main`. Produce changes on the current feature
  branch only, for human review.
- After editing, output a mapping table: each spec row -> the exact line/value
  you implemented, and flag any value you could not resolve from the provided
  files.
