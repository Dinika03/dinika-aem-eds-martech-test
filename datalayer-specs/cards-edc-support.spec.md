# Data layer spec — cards-edc-support

- **Block / component name:** `cards-edc-support`
- **Component name string:** `knowledge and resources`
- **Source sheet:** Data Layer Requirements

## Tracking requirements

- 1 — Track clicks on CTA (card selection)

## Event: `cta`

**Trigger:** When a user clicks on any one of the card of the Knowledge and Resources component

| Data Layer Element | Example Value | Value rule |
| --- | --- | --- |
| `eventInfo.eventName` | `card click - Building an export plan` | Event action with title of the card (card click - <title>). Title to be retreived automatically |
| `eventInfo.eventAction` | `card` | Action taken by the user |
| `eventInfo.eventType` | `click` | Type of event - hardcoded |
| `eventInfo.eventComponent` | `knowledge and resources` | Retreive name of AEM component |
| `eventInfo.eventText` | `Building an export plan` | Retreive title of the card |

