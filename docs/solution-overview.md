# Solution Overview — CrisisAI

## What We Built

CrisisAI is an intelligent emergency operations platform that converts raw, unstructured citizen emergency reports into consolidated, prioritized incidents for emergency command-center decision support.

Instead of treating every incoming message as an independent ticket, CrisisAI:

1. Extracts structured incident information from free-text reports using NLP.
2. Identifies reports that describe the same physical event using TF-IDF N-gram similarity and cosine distance.
3. Merges corroborating reports into a single incident and synthesizes AI evidence (e.g., "11 similar reports received, 3 mention trapped people, 2 mention rising water").
4. Ranks all incidents by a multi-factor priority score that combines urgency, category severity, human life risk, and the number of corroborating reports.
5. Presents a live Emergency Command Center dashboard with incident cards, a tactical map, evidence summaries, and recommended dispatcher actions.

## How It Works

```
Step 1 — Report Ingestion
    Citizen or field team submits emergency text via dashboard or REST API.

Step 2 — AI Information Extraction
    IBM Granite (watsonx.ai, if configured) OR Local NLP engine:
    → Extracts: incident_type, location, urgency, people_at_risk, people_count, category

Step 3 — Location Geocoding
    Extracted location text resolved to lat/lng using configured landmark map.

Step 4 — TF-IDF N-gram Similarity Search
    New report compared against all active incidents using:
    - TF-IDF (unigram + bigram) vectorization
    - Cosine similarity
    - Location and type corroboration bonuses

Step 5 — Deduplication Decision
    composite_score >= 0.55 → Merge into matching incident
    composite_score < 0.55  → Create new incident

Step 6 — Evidence Synthesis
    Corroborating signals extracted from all merged reports.
    Recommended dispatcher action generated.

Step 7 — Priority Scoring
    score = urgency_base + category_weight + human_risk + log2(report_count+1) × 60

Step 8 — Dashboard Display
    Incidents sorted by priority score descending.
    Command center shows cards, map, evidence, and recommended action.
```

## Architecture Diagram

> See [`architecture.md`](architecture.md) for the full architecture.

```
[Citizen Reports]
        ↓
[FastAPI Backend]
    ├─ IBM Granite (watsonx.ai)  ← if AI_MODE=watsonx
    └─ Local NLP Engine          ← default fallback
        ↓
[TF-IDF N-gram Similarity + Cosine Distance]
        ↓
[Incident Deduplication & Evidence Synthesis]
        ↓
[Multi-Factor Priority Scoring]
        ↓
[React Command Center Dashboard]
```

## Key Design Decisions

| Decision | Rationale |
|---|---|
| Dual-engine AI (Granite + Local NLP) | IBM Granite provides foundation-model NLP when credentials are available; local engine guarantees the demo works offline without credentials. These are not equivalent — local mode is deterministic and tuned to the demo dataset. |
| TF-IDF N-gram + cosine similarity for deduplication | Computationally lightweight, deterministic, and interpretable — judges can trace exactly why two reports are merged. No GPU or external embedding service required. |
| Entity corroboration bonuses | Pure text similarity can be fooled by coincidental word overlap; location and type corroboration provides a principled signal boost that reduces false merges. |
| Logarithmic corroboration factor in priority score | Prevents high report volume from dominating over genuine urgency; a single critical trapped-person incident outranks a low-urgency event with many observers. |
| SQLite for prototype | Zero-setup persistent storage; judges can run the project without any database server. Documented upgrade path to PostgreSQL. |

## IBM Technologies Used

### IBM watsonx.ai / Granite 3.0

**Role:** Application-level LLM inference for structured information extraction.

When `AI_MODE=watsonx` is set with valid credentials, the backend sends each incoming emergency report to the IBM Granite `ibm/granite-3-8b-instruct` model via the watsonx.ai REST API. The model is prompted to return a structured JSON object containing `incident_type`, `location`, `urgency`, `people_at_risk`, `people_count`, `category`, and `description`. IBM Cloud IAM is used for OAuth Bearer token authentication.

If the watsonx.ai API call fails for any reason, the system automatically falls back to the local NLP engine — ensuring zero crashes during demonstration.

### IBM Bob

**Role:** Development engineering assistance throughout the hackathon.

IBM Bob (the AI coding assistant) was used during Days 1–3 of development to:

- Draft and iterate Pydantic schemas, SQLAlchemy models, and FastAPI endpoint signatures.
- Generate the initial TF-IDF similarity engine with entity corroboration logic.
- Debug edge cases in the deduplication algorithm (e.g., false merges between different incident types at different locations).
- Write the automated test suite (`test_api.py`) including the 50-report → 18-incident integration test.
- Write documentation and the evaluation script (`evaluate_model.py`).
- Review the AI evidence synthesis and priority scoring formula for correctness.

Bob was not used for runtime inference — IBM Granite (watsonx.ai) handles that role.

See `src/bob_sessions/task_session_report_day1_day3.md` for the full session log.

## Evaluation Results (50-record evaluation set)

| Metric | Result |
|---|---|
| Urgency classification accuracy | 100% on the 50-record evaluation set |
| Urgency Macro F1 | 100% on the 50-record evaluation set |
| Incident-type accuracy | 98% on the 50-record evaluation set |
| Incident-type Macro F1 | ~97.78% on the 50-record evaluation set |
| Clustering ARI | 1.000 across the 18 known incident groups |
| Ground-truth incidents | 18 |
| AI-discovered incidents | 18 |

> **Note:** These results are measured on the 50-record curated/synthetic evaluation set included in the repository, not on an independent external benchmark. The dataset was designed to cover the 18 incident categories present in the demonstration. Run `python src/backend/tests/evaluate_model.py` to reproduce.
