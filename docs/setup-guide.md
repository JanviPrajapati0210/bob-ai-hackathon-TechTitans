# Setup Guide — CrisisAI

> CrisisAI converts noisy emergency reports into consolidated, prioritized incidents for emergency command-center decision support.

---

## Prerequisites

| Tool | Minimum version | Notes |
|---|---|---|
| Python | 3.10+ | 3.11 or 3.12 recommended |
| Node.js | 18+ | LTS release preferred |
| npm | 9+ | Bundled with Node.js 18+ |
| Git | any | For cloning |

IBM credentials are **not required** for local demonstration. The application runs fully offline using the built-in local NLP engine.

---

## 1. Clone the Repository

```bash
git clone https://github.com/<your-org>/<your-repo>.git
cd <your-repo>
```

---

## 2. Backend Setup

```powershell
# From the repository root:
cd src/backend
pip install -r requirements.txt
```

### Environment Variables

Copy the example environment file:

```powershell
# Windows PowerShell (from repository root):
Copy-Item src\.env.example src\.env

# macOS / Linux:
cp src/.env.example src/.env
```

The default `.env` settings use `AI_MODE=local` and `DATABASE_URL=sqlite:///./emergency.db`.
No changes are required for local demonstration.

| Variable | Default | Required |
|---|---|---|
| `AI_MODE` | `local` | No — set to `watsonx` to enable IBM Granite |
| `WATSONX_APIKEY` | *(empty)* | Only when `AI_MODE=watsonx` |
| `WATSONX_PROJECT_ID` | *(empty)* | Only when `AI_MODE=watsonx` |
| `WATSONX_URL` | `https://us-south.ml.cloud.ibm.com` | Only when `AI_MODE=watsonx` |
| `WATSONX_MODEL_ID` | `ibm/granite-3-8b-instruct` | Only when `AI_MODE=watsonx` |
| `DATABASE_URL` | `sqlite:///./emergency.db` | No |
| `SIMILARITY_THRESHOLD` | `0.55` | No |
| `PORT` | `8000` | No |

### Start the Backend

```powershell
# From repository root:
cd src/backend
python -m uvicorn app.main:app --reload --port 8000
```

Verify the backend is running:

```
http://localhost:8000          → {"status": "online", ...}
http://localhost:8000/docs     → Interactive Swagger API documentation
```

---

## 3. Frontend Setup

Open a **separate terminal**:

```powershell
# From repository root:
cd src/frontend
npm install
npm run dev
```

Dashboard available at:

```
http://localhost:5173
```

### Build for production (optional verification):

```powershell
cd src/frontend
npm run build
```

---

## 4. Running the 50-Report Demo

With the backend running, load the full demonstration dataset via the dashboard
**"Seed Demo Data"** button, or call the API directly:

```bash
curl -X POST http://localhost:8000/api/demo/seed
```

Expected response:

```json
{
  "message": "Demo initialized: 50 reports processed into 18 unique incidents.",
  "total_reports_processed": 50,
  "total_unique_incidents": 18,
  "breakdown": { "critical": 5, "high": 6, "medium": 4, "low": 3 }
}
```

---

## 5. IBM watsonx.ai Configuration (Optional)

To enable IBM Granite LLM-based extraction, set the following in `src/.env`:

```env
AI_MODE=watsonx
WATSONX_APIKEY=<your IBM Cloud API key>
WATSONX_PROJECT_ID=<your watsonx.ai project ID>
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_MODEL_ID=ibm/granite-3-8b-instruct
```

When `AI_MODE=watsonx` and credentials are valid, the backend uses IBM Granite for
structured NLP extraction. If the watsonx.ai call fails for any reason, the system
automatically falls back to the local NLP engine — the application never crashes.

When `AI_MODE=local` (default), the backend uses the built-in deterministic
rule/pattern-based extraction engine. No external API calls are made.

**Never commit real API keys to GitHub.**

---

## 6. Running Tests

```powershell
# From repository root:
python src/backend/tests/test_api.py
```

The test suite covers:

- NLP extraction (flood, road blockage, observation examples)
- Similarity-based deduplication
- 50-report → 18-incident clustering
- Stats and priority-ranking endpoints
- Railway Station flood incident: 11 reports merged, Critical urgency

Expected output: `OK` (all tests pass).

### Run ML Evaluation

```powershell
# From repository root:
python src/backend/tests/evaluate_model.py
```

Evaluates urgency classification accuracy, incident-type accuracy, and clustering
quality (ARI) on the 50-record evaluation dataset.

---

## 7. Troubleshooting

| Issue | Solution |
|---|---|
| `ModuleNotFoundError: No module named 'app'` | Run from `src/backend/`, not from `src/backend/app/` |
| `ModuleNotFoundError: No module named 'fastapi'` | Run `pip install -r src/backend/requirements.txt` |
| `Address already in use` on port 8000 | Change port: `--port 8001`, and update `src/frontend/src/services/api.js` |
| Frontend `ERR_CONNECTION_REFUSED` | Ensure backend is running on port 8000 before starting the frontend |
| `WATSONX_APIKEY not set` warning in logs | Normal in local mode; set `AI_MODE=local` in `.env` to suppress |
| `sqlite3.OperationalError` on first run | The database is created automatically on first start; no migration needed |
| `npm install` fails | Ensure Node.js 18+ is installed: `node --version` |
| Tests fail with `test_emergency.db` error | The test suite creates and deletes its own in-memory test DB automatically |
