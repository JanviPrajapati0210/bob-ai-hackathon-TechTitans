# IBM Bob Task Session Report: Emergency Response AI Dashboard

**Project**: CrisisAI - Emergency Prioritization & Deduplication Command Center  
**Theme**: Turn Idea into Impact Faster (IBM Bob Hackathon)  
**Track**: Proof of Concept / AI Incident Management  
**AI Engines**: IBM watsonx.ai Granite (`ibm/granite-3-8b-instruct`) + Local NLP & Embedding Engine  

---

## Task Summary

### Session Overview
- **Objective**: Design, architect, and implement a full-stack, multi-component AI emergency response management system capable of processing 50+ multi-channel citizen emergency reports, deduplicating them into 18 clustered incidents using text similarity embeddings, determining real-time urgency, and ranking incidents on a live tactical dashboard.
- **Team Division**:
  - Person 1: AI / NLP Information Extraction (Incident Classification, Urgency Analysis, Structured JSON)
  - Person 2: Similarity & Deduplication Engine (Embeddings, Cosine Similarity, Smart Clustering, Multi-Report AI Evidence Synthesis)
  - Person 3: Backend & Data Management (FastAPI, SQLite, Priority Ranker, Endpoints)
  - Person 4: Frontend Command Center (React, Vite, Responsive Tactical Map, Incident Cards, Live Report Ingestion)

---

## Chronological Session Log (Day 1 – Day 3)

### Day 1: Core AI Information Extraction & Backend Infrastructure
- **Actions Assisted by Bob**:
  1. Drafted Pydantic schemas (`ReportCreate`, `ReportAnalysis`, `IncidentResponse`, `StatsResponse`).
  2. Implemented IBM watsonx.ai Granite integration module with automatic OAuth Bearer token retrieval via IBM Cloud IAM (`https://iam.cloud.ibm.com/identity/token`).
  3. Formulated fallback rule-and-pattern NLP engine to ensure reliable zero-latency offline operation during hackathon evaluation.
  4. Built SQLite database models (`Report`, `Incident`) with SQLAlchemy ORM.
  5. Established core FastAPI endpoints:
     - `POST /api/reports` (Ingest, extract, deduplicate, cluster)
     - `GET /api/reports` (Raw citizen report stream)
     - `POST /api/analyze` (AI extraction preview)
     - `GET /api/reports/priority` (Ranked priority feed)
  6. Prepared 50 curated sample emergency reports reflecting real-world natural disaster and infrastructure emergencies without PII.

### Day 2: Text Similarity, Deduplication & Frontend Development
- **Actions Assisted by Bob**:
  1. Developed TF-IDF N-Gram vectorizer and cosine similarity matrix engine (`backend/app/similarity_engine.py`).
  2. Engineered automated clustering: detects whether an incoming report refers to an existing active emergency or initiates a novel incident.
  3. Implemented multi-report AI evidence synthesizer: aggregates corroborating reports and generates verified bullet points (e.g. *11 similar reports*, *3 mention trapped people*, *2 mention rising water*, *Location mentioned consistently: Railway Station*).
  4. Formulated actionable dispatcher recommendations (e.g. *Prioritize rescue assessment*).
  5. Built modern React frontend with dark command-center aesthetic, live status counters, and tactical map view.

### Day 3: Pipeline Integration, Automated Testing & Evaluation
- **Actions Assisted by Bob**:
  1. Connected frontend API service to backend.
  2. Developed automated unit & integration test suite (`backend/tests/test_api.py`) verifying all 4 AI components.
  3. Verified the end-to-end demo: 50 incoming reports $\rightarrow$ clustered into 18 unique incidents:
     - 🔴 5 Critical incidents
     - 🟠 6 High incidents
     - 🟡 4 Medium incidents
     - 🟢 3 Low incidents
  4. Verified Incident #1 (Flood at Railway Station) merges 11 reports and assigns Critical priority with rescue recommendations.
  5. Packaged project with run scripts (`run.bat`, `run.ps1`) and documentation.

---

## Bob IDE Best Practices Observed
- Used structured modular code separation (`backend/app`, `backend/tests`, `frontend/src`).
- Maintained non-destructive edits and zero credentials in repository code (used `.env.example`).
- Kept memory and context optimized during iterative development.
