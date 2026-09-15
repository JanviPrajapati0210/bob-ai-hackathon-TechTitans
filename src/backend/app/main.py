import os
import json
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.config import CORS_ORIGINS, DATABASE_URL
from app.database import engine, Base, get_db
from app.models import Incident, Report
from app.schemas import (
    ReportCreate,
    ReportAnalysis,
    ReportResponse,
    IncidentResponse,
    IncidentStatusUpdate,
    StatsResponse,
    SeedDemoResponse
)
from app.ai_extractor import analyze_report
from app.similarity_engine import find_matching_incident, synthesize_ai_evidence
from app.priority_ranker import calculate_priority_score

# Initialize database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Emergency Incident Prioritization & Deduplication API",
    description="IBM Bob Hackathon AI Emergency Response System: NLP Extraction, Similarity Clustering, AI Prioritization & Dispatch",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local frontends on any port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "Emergency Response AI Core",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@app.post("/api/analyze", response_model=ReportAnalysis, tags=["AI Analysis"])
def analyze_text_endpoint(report_in: ReportCreate):
    """Person 1 Component: Standalone AI extraction and classification endpoint."""
    analysis = analyze_report(report_in.text)
    return analysis


@app.post("/api/reports", tags=["Ingestion & Pipeline"])
def submit_report(report_in: ReportCreate, db: Session = Depends(get_db)):
    """
    Ingests an incoming citizen or field report, runs AI extraction,
    compares embeddings with active incidents, deduplicates/merges or creates a new incident.
    """
    # 1. AI Extraction
    analysis = analyze_report(report_in.text)

    # 2. Query active incidents
    active_incidents = db.query(Incident).filter(Incident.status != "Resolved").all()

    # 3. TF-IDF N-gram Similarity & Deduplication (Person 2 Component)
    matched_incident, similarity_score = find_matching_incident(
        report_in.text,
        analysis,
        active_incidents
    )

    is_duplicate = matched_incident is not None
    now_iso = datetime.now(timezone.utc).isoformat()

    # Create Report Record
    db_report = Report(
        text=report_in.text,
        timestamp=now_iso,
        reporter=report_in.reporter or "Anonymous Citizen",
        source=report_in.source or "Web Submission",
        incident_type=analysis.incident_type,
        location=analysis.location,
        urgency=analysis.urgency,
        people_at_risk=analysis.people_at_risk,
        people_count=analysis.people_count,
        category=analysis.category,
        latitude=analysis.latitude,
        longitude=analysis.longitude
    )

    if is_duplicate:
        # Merge into existing incident
        target_incident = matched_incident
        db_report.incident_id = target_incident.id
        db.add(db_report)
        db.commit()
        db.refresh(db_report)

        # Update Incident properties
        target_incident.report_count += 1
        target_incident.last_reported_at = now_iso
        if analysis.people_at_risk:
            target_incident.people_at_risk = True
        target_incident.people_count = max(target_incident.people_count, analysis.people_count)

        # Escalate urgency if incoming report has higher severity
        urgency_ranks = {"LOW": 1, "MEDIUM": 2, "HIGH": 3, "CRITICAL": 4}
        if urgency_ranks.get(analysis.urgency, 1) > urgency_ranks.get(target_incident.urgency, 1):
            target_incident.urgency = analysis.urgency

        # Synthesize updated AI evidence & recommended action
        all_linked_reports = db.query(Report).filter(Report.incident_id == target_incident.id).all()
        evidence_list, recommended_action = synthesize_ai_evidence(target_incident, all_linked_reports)
        target_incident.ai_evidence = evidence_list
        target_incident.recommended_action = recommended_action

        # Recalculate priority score
        target_incident.priority_score = calculate_priority_score(target_incident)
        db.commit()
        db.refresh(target_incident)

        return {
            "is_duplicate": True,
            "similarity_score": round(similarity_score, 3),
            "report": db_report,
            "incident": target_incident
        }

    else:
        # Create a new Incident
        new_incident = Incident(
            title=f"{analysis.incident_type} - {analysis.location}",
            incident_type=analysis.incident_type,
            category=analysis.category,
            location=analysis.location,
            latitude=analysis.latitude,
            longitude=analysis.longitude,
            urgency=analysis.urgency,
            status="Active",
            report_count=1,
            people_at_risk=analysis.people_at_risk,
            people_count=analysis.people_count,
            first_reported_at=now_iso,
            last_reported_at=now_iso
        )
        db.add(new_incident)
        db.commit()
        db.refresh(new_incident)

        db_report.incident_id = new_incident.id
        db.add(db_report)
        db.commit()
        db.refresh(db_report)

        # Initial evidence & action
        evidence_list, recommended_action = synthesize_ai_evidence(new_incident, [db_report])
        new_incident.ai_evidence = evidence_list
        new_incident.recommended_action = recommended_action
        new_incident.priority_score = calculate_priority_score(new_incident)
        db.commit()
        db.refresh(new_incident)

        return {
            "is_duplicate": False,
            "similarity_score": round(similarity_score, 3),
            "report": db_report,
            "incident": new_incident
        }


@app.get("/api/reports", response_model=List[ReportResponse], tags=["Reports"])
def list_reports(db: Session = Depends(get_db)):
    """Retrieve all submitted reports."""
    return db.query(Report).order_by(Report.id.desc()).all()


@app.get("/api/incidents", response_model=List[IncidentResponse], tags=["Incidents"])
def list_incidents(
    urgency: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Retrieve all incidents sorted by AI Priority Score descending."""
    query = db.query(Incident)

    if urgency:
        query = query.filter(Incident.urgency == urgency.upper())
    if category:
        query = query.filter(Incident.category == category)
    if status:
        query = query.filter(Incident.status == status)

    incidents = query.order_by(Incident.priority_score.desc()).all()
    return incidents


@app.get("/api/reports/priority", response_model=List[IncidentResponse], tags=["Incidents"])
def get_priority_feed(db: Session = Depends(get_db)):
    """Convenience endpoint returning priority-ranked active incidents."""
    return db.query(Incident).filter(Incident.status != "Resolved").order_by(Incident.priority_score.desc()).all()


@app.get("/api/incidents/{incident_id}", response_model=IncidentResponse, tags=["Incidents"])
def get_incident_detail(incident_id: int, db: Session = Depends(get_db)):
    """Retrieve detailed information and all merged reports for a specific incident."""
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident


@app.patch("/api/incidents/{incident_id}/status", response_model=IncidentResponse, tags=["Incidents"])
def update_incident_status(incident_id: int, update: IncidentStatusUpdate, db: Session = Depends(get_db)):
    """Update incident operational status (Active, In Progress, Resolved)."""
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    incident.status = update.status
    db.commit()
    db.refresh(incident)
    return incident


@app.get("/api/stats", response_model=StatsResponse, tags=["Dashboard"])
def get_stats(db: Session = Depends(get_db)):
    """Calculates live summary counts for command center dashboard counters."""
    total_reports = db.query(Report).count()
    total_incidents = db.query(Incident).count()
    critical_count = db.query(Incident).filter(Incident.urgency == "CRITICAL").count()
    high_count = db.query(Incident).filter(Incident.urgency == "HIGH").count()
    medium_count = db.query(Incident).filter(Incident.urgency == "MEDIUM").count()
    low_count = db.query(Incident).filter(Incident.urgency == "LOW").count()
    active_count = db.query(Incident).filter(Incident.status == "Active").count()
    in_progress_count = db.query(Incident).filter(Incident.status == "In Progress").count()
    resolved_count = db.query(Incident).filter(Incident.status == "Resolved").count()

    return StatsResponse(
        total_reports=total_reports,
        total_incidents=total_incidents,
        critical_count=critical_count,
        high_count=high_count,
        medium_count=medium_count,
        low_count=low_count,
        active_count=active_count,
        in_progress_count=in_progress_count,
        resolved_count=resolved_count
    )


@app.post("/api/demo/reset", tags=["Demo & Testing"])
def reset_database(db: Session = Depends(get_db)):
    """Clears all records for clean demonstration testing."""
    db.query(Report).delete()
    db.query(Incident).delete()
    db.commit()
    return {"message": "Database reset successfully."}


@app.post("/api/demo/seed", response_model=SeedDemoResponse, tags=["Demo & Testing"])
def seed_demo(db: Session = Depends(get_db)):
    """
    Executes the complete 50-report pipeline demonstration:
    Ingests 50 curated sample reports and clusters them into 18 distinct incidents.
    """
    # Reset first
    db.query(Report).delete()
    db.query(Incident).delete()
    db.commit()

    sample_file = Path(__file__).resolve().parent / "data" / "sample_reports.json"
    if not sample_file.exists():
        raise HTTPException(status_code=500, detail="Sample reports dataset missing")

    with open(sample_file, "r", encoding="utf-8") as f:
        samples = json.load(f)

    for item in samples:
        report_create = ReportCreate(
            text=item["text"],
            reporter=item.get("reporter", "Citizen"),
            source=item.get("source", "Web")
        )
        # Execute ingestion pipeline
        submit_report(report_create, db)

    # Calculate final tally
    total_reps = db.query(Report).count()
    total_incs = db.query(Incident).count()
    crit = db.query(Incident).filter(Incident.urgency == "CRITICAL").count()
    hi = db.query(Incident).filter(Incident.urgency == "HIGH").count()
    med = db.query(Incident).filter(Incident.urgency == "MEDIUM").count()
    lo = db.query(Incident).filter(Incident.urgency == "LOW").count()

    return SeedDemoResponse(
        message=f"Demo initialized: {total_reps} reports processed into {total_incs} unique incidents.",
        total_reports_processed=total_reps,
        total_unique_incidents=total_incs,
        breakdown={
            "critical": crit,
            "high": hi,
            "medium": med,
            "low": lo
        }
    )
