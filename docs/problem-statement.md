# Problem Statement — CrisisAI

## Background

During natural disasters, urban flooding, infrastructure failures, and major incidents, municipal emergency dispatch centers receive a high volume of fragmented, unstructured text reports simultaneously from citizens via SMS hotlines, mobile apps, social media channels, and field teams. Each message may describe the same physical event in different language, from a different vantage point, or with a different level of detail.

## The Problem

Emergency dispatchers managing a disaster response manually read, categorize, and cross-reference incoming reports in real time. When 50+ messages arrive about the same flooded railway station, dispatchers may create duplicate tickets, miss the accumulation of life-threatening signals across those messages, and fail to identify which of many simultaneous events requires immediate deployment of rescue resources.

Specific pain points:

- **Duplicate tickets:** The same flooding event generates 11 separate reports, each treated as an independent incident.
- **Delayed severity recognition:** No single report contains all the signals that together confirm "elderly people are trapped and water is chest-height." The picture emerges across multiple reports, but is not assembled automatically.
- **Cognitive overload:** Dispatchers reading raw text cannot sort incidents by life-risk priority in real time across a large volume of incoming reports.
- **No evidence trail:** When a dispatcher escalates an incident, there is no automated summary of which reports corroborate the decision.

## Who Is Affected

**Primary user:** Emergency incident commanders and dispatchers at municipal emergency operations centers managing flood, fire, gas leak, structural collapse, and traffic incidents.

**Secondary user:** Field team supervisors who need a prioritized list of incidents to deploy limited resources across multiple simultaneous events.

## Why It Matters

Every minute of delay in identifying a life-threatening incident — such as elderly residents trapped in a flooded building — directly increases risk to human life. Dispatchers operating under cognitive overload in a high-volume emergency are more likely to miss the clustering of signals that indicate a critical situation requiring immediate rescue intervention.

## Why Existing Solutions Fall Short

Traditional emergency ticketing systems:

- Treat each incoming message as an independent record with no cross-report linkage.
- Rely on manual dispatcher classification rather than automated severity extraction.
- Do not aggregate corroborating signals across multiple reports describing the same event.
- Do not provide an evidence summary explaining why a particular incident is flagged as critical.

CrisisAI automates the report-to-incident transformation, deduplicates corroborating reports, aggregates evidence signals, and presents dispatchers with a priority-ranked, evidence-backed command-center view.
