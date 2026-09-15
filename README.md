# 🚀 CrisisAI: Emergency Incident Prioritization & Deduplication Dashboard

> **IBM Bob Hackathon Submission**  
> **Track:** AI  
> **Theme:** Turn Idea into Impact Faster

---

## 👥 Team

| Field | Value |
|---|---|
| **Team Name** | TechTitans |
| **Track** | AI |
| **Team Lead** | Janvi Prajapati — 24aiml052@charusat.edu.in |
| **Members** | Krima Parmar, Hemangi Parmar, Vidhi Patel |


---

## 🎯 Problem Statement

During natural disasters and major urban emergencies, emergency dispatchers and incident commanders receive large volumes of fragmented, unstructured reports from citizens, SMS channels, hotlines, and field teams. Manually reading, categorizing, cross-referencing, and prioritizing these reports creates duplicate tickets and delays the identification of life-threatening incidents.

Traditional systems also tend to rely on keywords, timestamps, or static categories, which can miss the difference between a routine observation and a critical situation involving trapped or vulnerable people.

---

## 💡 Solution

**CrisisAI** is an intelligent emergency operations platform that converts raw emergency reports into structured, prioritized, and deduplicated incidents. It uses NLP with **IBM watsonx.ai Granite** or a resilient local fallback to extract incident information, uses TF-IDF N-gram vectors and cosine similarity to cluster corroborating reports, and applies multi-factor priority scoring to rank emergencies by human life risk.

The resulting intelligence is presented through an interactive **Emergency Command Center dashboard** with live incident counters, priority cards, tactical map visualization, AI evidence summaries, and recommended response actions.

---

## ✨ Key Features

- **🧠 AI-Powered NLP Extraction:** Extracts incident type, location, urgency, people at risk, people count, and operational category from unstructured emergency text.
- **🤖 IBM watsonx.ai Granite Integration:** Supports IBM Granite foundation models through the watsonx.ai API, with a local NLP fallback for reliable offline execution.
- **🔗 Intelligent Deduplication:** Uses TF-IDF N-gram vectors and cosine similarity to identify reports describing the same incident.
- **📊 Multi-Factor Priority Scoring:** Combines urgency, incident category, human-life risk, vulnerable people, and corroborating report volume.
- **🗺️ Tactical Disaster Geo-Grid:** Displays incidents geographically with severity indicators and critical-alert radar effects.
- **🚨 Actionable AI Evidence:** Summarizes corroborating reports and provides recommended emergency response actions.
- **📥 Live Report Ingestion:** Allows emergency reports to be submitted and analyzed through the dashboard.
- **🔎 Search & Filtering:** Helps dispatchers quickly locate incidents based on operational conditions.
- **🧪 Automated Evaluation:** Includes API/integration tests and an ML evaluation suite for extraction, clustering, and priority behavior.
- **🎬 50-Report Demonstration:** Demonstrates how 50 incoming reports can be consolidated into 18 actionable incidents.

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Languages** | Python, JavaScript |
| **Frontend** | React 19, Vite 8, Lucide React, CSS3 |
| **Backend** | FastAPI, Uvicorn, Pydantic |
| **AI / ML** | IBM watsonx.ai Granite 3.0, scikit-learn, TF-IDF N-gram vectors, cosine similarity |
| **IBM Technologies** | IBM watsonx.ai, IBM Granite foundation model |
| **Database** | SQLite, SQLAlchemy 2.0 |
| **Testing** | pytest, custom ML evaluation suite |
| **Configuration** | python-dotenv, environment variables |
| **Version Control** | Git / GitHub |

---

## 🧠 AI Pipeline

```text
                    ┌──────────────────────────┐
                    │   Raw Citizen Report     │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                 ┌───────────────────────────────┐
                 │ 1. NLP Information Extraction │
                 │ IBM Granite / Local NLP       │
                 └──────────────┬────────────────┘
                                │
                                ▼
                    ┌─────────────────────────┐
                    │ Structured Incident Data│
                    │ Type / Location / Risk   │
                    └────────────┬────────────┘
                                 │
                                 ▼
                 ┌───────────────────────────────┐
                 │ 2. Similarity & Deduplication │
                 │ TF-IDF N-grams + Cosine       │
                 └──────────────┬────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
              Similar report          New event
                    │                       │
                    ▼                       ▼
          Merge existing incident    Create incident
                    │                       │
                    └───────────┬───────────┘
                                │
                                ▼
                 ┌──────────────────────────────┐
                 │ 3. Evidence Synthesis       │
                 │ Corroborating report signals│
                 └──────────────┬───────────────┘
                                │
                                ▼
                 ┌──────────────────────────────┐
                 │ 4. Priority Ranking          │
                 │ Urgency + Risk + Corroboration│
                 └──────────────┬───────────────┘
                                │
                                ▼
                 ┌──────────────────────────────┐
                 │ Emergency Command Center     │
                 └──────────────────────────────┘
```

### Priority Scoring

CrisisAI uses a continuous multi-factor score:

```text
Priority Score =
    Urgency Base
    + Category Weight
    + Human Risk Bonus
    + log2(Report Count + 1) × 60
```

The logarithmic corroboration factor rewards incidents reported by multiple independent sources without allowing report volume alone to overpower an immediate life-threatening situation.

### Deduplication Decision

```text
If:
    Cosine Similarity >= 0.55
    AND location/type are corroborated

        → Merge report into existing incident

Otherwise:

        → Create a new incident
```

The similarity threshold can be configured using the `SIMILARITY_THRESHOLD` environment variable.

---

## 🏆 Core Demonstration: 50 Reports → 18 Incidents

The built-in demonstration processes **50 synthetic emergency reports** and consolidates them into **18 unique incidents**.

| Priority | Count | Example Incidents |
|---|---:|---|
| 🔴 **Critical** | 5 | Railway Station Flood, Main Market Plaza Fire, Industrial Gas Leak, Riverdale Bridge Damage, Sector 4 Collapse |
| 🟠 **High** | 6 | Fallen Tree Road Blockage, Oakwood Power Line, Highway 101 Pileup, Water Main Burst, Pine Hill Wildfire, Substation Fire |
| 🟡 **Medium** | 4 | Downtown Signal Outage, Hillside Mudslide, Sector 9 Street Drainage, High Street Storefront |
| 🟢 **Low** | 3 | North Creek Water Gauge, Maple Street Tree Trimming, Sunset Blvd Streetlight |

### Highlighted Incident: Railway Station Flood

The demonstration includes an incident where **11 reports** are merged into one incident.

The dashboard identifies:

- **Urgency:** Critical
- **Reports merged:** 11
- **People at risk:** Yes
- **Vulnerable victims:** Elderly people reported trapped
- **Corroborating evidence:** Multiple reports mention trapped people and rising water
- **Recommended action:** Prioritize rescue assessment and deploy appropriate water-rescue and evacuation resources

---

## 📁 Repository Structure

```text
CrisisAI/
├── src/
│   ├── backend/
│   │   ├── app/
│   │   │   ├── __init__.py
│   │   │   ├── main.py                 # FastAPI application & API endpoints
│   │   │   ├── config.py               # Configuration & location mapping
│   │   │   ├── database.py             # SQLite / SQLAlchemy connection
│   │   │   ├── models.py               # Incident & Report ORM models
│   │   │   ├── schemas.py              # Pydantic request/response schemas
│   │   │   ├── ai_extractor.py         # NLP / IBM Granite extraction
│   │   │   ├── similarity_engine.py    # Embeddings & deduplication
│   │   │   ├── priority_ranker.py      # Emergency priority scoring
│   │   │   └── data/
│   │   │       ├── sample_reports.json # Synthetic demo reports
│   │   │       └── kaggle_crisis_dataset.json
│   │   ├── tests/
│   │   │   ├── test_api.py             # API & integration tests
│   │   │   └── evaluate_model.py       # ML evaluation
│   │   └── requirements.txt
│   │
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── App.jsx                 # Main dashboard
│   │   │   ├── index.css               # Tactical UI styling
│   │   │   ├── components/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── DemoControlBar.jsx
│   │   │   │   ├── IncidentCard.jsx
│   │   │   │   ├── IncidentMap.jsx
│   │   │   │   ├── IncidentDetail.jsx
│   │   │   │   └── ReportSubmitModal.jsx
│   │   │   └── services/
│   │   │       └── api.js
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   └── .env.example
│
├── docs/
│   ├── problem-statement.md
│   ├── solution-overview.md
│   ├── architecture.md
│   └── setup-guide.md
│
├── demo/
│   ├── README.md
│   ├── screenshots/
│   ├── demo-video-link.txt
│   └── live-demo-url.txt
│
├── presentation/
│   └── slides_content.md
│
├── bob_sessions/
│   ├── README.md
│   └── task_session_report_day1_day3.md
│
├── submission.yaml
├── CONTRIBUTING.md
└── README.md
```

---

## ⚡ How to Run

### Prerequisites

Install:

- **Python 3.10+**
- **Node.js 18+**
- **npm 9+**
- **Git**

The project can run completely offline using the built-in local AI engine.

### 1. Clone the Repository

```bash
git clone https://github.com/<your-repository>.git
cd <your-repository>
```

### 2. Install Backend Dependencies

```powershell
cd src/backend
pip install -r requirements.txt
```

### 3. Install Frontend Dependencies

Open a second terminal:

```powershell
cd src/frontend
npm install
```

### 4. Configure Environment

From the repository root, copy the example environment file:

```powershell
copy src\.env.example src\.env
```

The application works in local mode without IBM credentials.

### 5. Start the Backend

```powershell
cd src/backend
python -m uvicorn app.main:app --reload --port 8000
```

Backend:

```text
http://localhost:8000
```

Swagger API documentation:

```text
http://localhost:8000/docs
```

### 6. Start the Frontend

In another terminal:

```powershell
cd src/frontend
npm run dev
```

Dashboard:

```text
http://localhost:5173
```

---

## 🤖 Optional IBM watsonx.ai Configuration

CrisisAI supports IBM watsonx.ai Granite inference, but IBM credentials are **not required** for the default local demonstration.

Create/configure `.env` with:

```env
AI_MODE=watsonx
WATSONX_APIKEY=your_ibm_cloud_api_key
WATSONX_PROJECT_ID=your_watsonx_project_id
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_MODEL_ID=ibm/granite-3-8b-instruct
SIMILARITY_THRESHOLD=0.55
PORT=8000
DATABASE_URL=sqlite:///./emergency.db
```

When `AI_MODE=watsonx`, the backend attempts to use IBM Granite for structured NLP extraction. The local engine provides a fallback when external inference is unavailable.

**Never commit API keys or other credentials to GitHub.**

---

## 🧪 Testing & Evaluation

### Run Automated Tests

From the repository root:

```powershell
python src/backend/tests/test_api.py
```

The test suite covers:

- NLP information extraction
- Flood report extraction
- Road blockage extraction
- Observation extraction
- Similarity-based deduplication
- 50-report → 18-incident clustering
- Dynamic priority ordering

### Run ML Evaluation

```powershell
python src/backend/tests/evaluate_model.py
```

The included evaluation suite is designed to measure:

- Classification accuracy
- Macro F1 score
- Clustering quality using Adjusted Rand Index (ARI)

> Evaluation values should be reported exactly as produced by the current test run rather than assumed from previous runs.

---

## 🖥️ Demo

| Artifact | Link / Location |
|---|---|
| 📹 **Demo Video** | `demo/demo-video-link.txt` |
| 🌐 **Live Demo** | `demo/live-demo-url.txt` |
| 🖼️ **Screenshots** | `demo/screenshots/` |
| 📊 **Presentation** | `presentation/` |

### Demo Video

The repository currently contains the configured demo-video reference in:

```text
demo/demo-video-link.txt
```


### 🌐 Live Demo

[**🚀 Open CrisisAI Live Demo**](https://crisisai-frontend.onrender.com/)


## 🔐 Security & Data Privacy

- IBM Cloud credentials are loaded from environment variables.
- No API keys should be hardcoded in source files.
- The demonstration uses synthetic emergency scenarios.
- The project does not require private social-media scraping.
- The local AI mode enables demonstration without external API credentials.
- SQLite can be replaced with PostgreSQL for production deployments.
- Large-scale vector search can be extended with technologies such as pgvector or a dedicated vector database.

---

## ⚠️ Known Limitations

- **Synthetic Demo Data:** The primary 50-report demonstration uses curated/synthetic emergency scenarios rather than a live production emergency feed.
- **Local NLP Fallback:** Local mode is designed for deterministic demonstration and resilience; it does not provide the same broad language understanding as a production foundation model.
- **SQLite Storage:** SQLite is suitable for the demonstration but should be replaced with a production database for high-concurrency deployments.
- **Location Mapping:** The current implementation uses a configured landmark/coordinate mapping rather than a full production geocoding service.
- **No Production Dispatch Integration:** Recommended actions are decision-support outputs and are not directly connected to 911, EMS, fire, police, or municipal dispatch systems.
- **Threshold Tuning:** Similarity and priority thresholds require further validation against large, real-world crisis datasets before production use.
- **Human Oversight Required:** AI-generated classifications, evidence summaries, and recommendations should support—not replace—trained emergency personnel.

---

## 🏅 What We're Most Proud Of

The strongest part of **CrisisAI** is the complete end-to-end intelligence pipeline: instead of treating every incoming message as an independent ticket, the system transforms noisy emergency communications into a **single operational picture**.

Our demonstration shows the complete journey from **50 raw reports → AI extraction → similarity-based deduplication → 18 unique incidents → life-risk prioritization → tactical dashboard visualization**.

The dual-engine design is also a key strength. **IBM watsonx.ai Granite** can provide foundation-model intelligence when configured, while the local inference engine allows the application to remain usable during offline evaluation or when cloud credentials are unavailable.

Most importantly, the platform is designed around the emergency dispatcher’s real question:

> **“Which incident needs attention first, and why?”**

CrisisAI answers that question by combining **urgency, human risk, corroborating evidence, incident context, and geographic visibility** into one command-center workflow.

---

## 📚 Additional Documentation

Detailed documentation is available in:

- `docs/problem-statement.md` — Detailed problem definition and target users
- `docs/solution-overview.md` — Solution mechanism and design decisions
- `docs/architecture.md` — Technical architecture and data flow
- `docs/setup-guide.md` — Complete installation, execution, verification, and troubleshooting guide
- `presentation/slides_content.md` — Presentation content
- `bob_sessions/task_session_report_day1_day3.md` — IBM Bob development session report

---

## 📄 License / Submission Note

This repository was prepared as an **IBM Bob Hackathon submission**. Refer to the hackathon requirements and repository documentation for submission-specific rules.
