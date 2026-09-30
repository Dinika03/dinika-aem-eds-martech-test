# Data layer spec — tabs-insights

- **Block / component name:** `tabs-insights`
- **Component name string:** `Export Trends`
- **Source sheet:** Data Layer Requirements - 1

## Tracking requirements

- 1 — Track clicks on CTA (Pill button, card selected, format type)
- 2 — Track clicks on CTA (More Resources Link)

## Event: `cta`

**Trigger:** a. When a user clicks on any one of the pill button of the Export Trends 
b. When user selects one of the card under that Pill button

| Data Layer Element | Example Value | Value rule |
| --- | --- | --- |
| `eventInfo.eventName` | `button click - Features"
"Features - card click - Grow your business with mergers and acquisition - webinar` | a. Event action with text of the pill (button click - <pill text>). Text to be retreived automatically
b. Text of the pill with event action and title of the card selected <pill Text> - card click - <title> - <format type>. Text, title, format type to be retreived automatically |
| `eventInfo.eventAction` | `button"
"card` | a. Action taken by the user (pill button)
b. Action taken by the user (card selected) |
| `eventInfo.eventType` | `click` | Type of event - hardcoded |
| `eventInfo.eventComponent` | `Export Trends` | Retreive name of AEM component |
| `eventInfo.eventText` | `Features"
"Features - Grow your business with mergers and acquisition - webinar` | a. Retreive text of the pill
b. Retreive text of the pill and title of the card selected and format type <pill text> - <card title> - <format type> |

