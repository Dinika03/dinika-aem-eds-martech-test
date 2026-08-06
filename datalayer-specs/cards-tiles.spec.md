# Data layer spec — cards-tiles

- **Block / component name:** `cards-tiles`
- **Component name string:** `Trade Expertise Highlights`
- **Data-layer sheets:** Data Layer Requirements - 1, Data Layer Requirements - 2

## Tracking requirements

- 1 — Track clicks on Cards
- 2 — Track horizontal scroll 50% and 100% scroll rate (mobile only based on latest discussion)

## Sheet: Data Layer Requirements - 1

### Event: `cta`

**Trigger:** When a user clicks on any one of the card of the Trade Expertise Highlights

| Data Layer Element | Example Value | Value rule |
| --- | --- | --- |
| `eventInfo.eventName` | `card click - CleanTech` | Event action with title of the card (card click - <title>). Title to be retreived automatically |
| `eventInfo.eventAction` | `card` | Action taken by the user |
| `eventInfo.eventType` | `click` | Type of event - hardcoded |
| `eventInfo.eventComponent` | `Trade Expertise Highlights` | Retreive name of AEM component |
| `eventInfo.eventText` | `CleanTech` | Retreive title of the card |

## Sheet: Data Layer Requirements - 2

### Event: `scroll`

**Trigger:** When a user scrolls horizontal in the trade expertise component

| Data Layer Element | Example Value | Value rule |
| --- | --- | --- |
| `eventInfo.eventName` | `1/2 - scroll` | Specific name of the scroll event with the scroll rate |
| `eventInfo.eventAction` | `horizontal scroll` | Action taken by the user |
| `eventInfo.eventType` | `component scroll` | Type of event - hardcoded |
| `eventInfo.eventComponent` | `Trade Expertise Highlights` | Retreive name of AEM component |

