# Data layer spec — cards-solutions

- **Block / component name:** `cards-solutions`
- **Component name string:** `Products`
- **Data-layer sheets:** Data Layer Requirements

## Tracking requirements

- 1 — Track clicks on Cards

## Sheet: Data Layer Requirements

### Event: `cta`

**Trigger:** When a user clicks on any one of the card of the Product component

| Data Layer Element | Example Value | Value rule |
| --- | --- | --- |
| `eventInfo.eventName` | `card click - Insurance` | Event action with title of the card (card click - <title>). Title to be retreived automatically |
| `eventInfo.eventAction` | `card` | Action taken by the user |
| `eventInfo.eventType` | `click` | Type of event - hardcoded |
| `eventInfo.eventComponent` | `Products` | Retreive name of AEM component |
| `eventInfo.eventText` | `Insurance` | Retreive title of the card |

