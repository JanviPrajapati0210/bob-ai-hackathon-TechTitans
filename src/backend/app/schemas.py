from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class ReportCreate(BaseModel):
    text: str = Field(..., description="Raw text of the incoming emergency report")
    reporter: Optional[str] = Field("Anonymous Citizen", description="Identifier or name of reporter")
    source: Optional[str] = Field("Web Submission", description="Source channel, e.g. Citizen SMS, Mobile App, Radio")

class ReportAnalysis(BaseModel):
    incident_type: str = Field(..., description="Type of incident: Flood, Road Blockage, Fire, etc.")
    location: str = Field(..., description="Extracted landmark or street name")
    urgency: str = Field(..., description="CRITICAL, HIGH, MEDIUM, LOW")
    people_at_risk: bool = Field(False, description="Whether human lives are immediately threatened")
    people_count: int = Field(0, description="Estimated number of people trapped or affected")
    category: str = Field("Observation", description="Rescue, Infrastructure, Hazard, Observation, etc.")
    description: str = Field(..., description="Normalized summary description")
    latitude: float = Field(..., description="Geographic latitude")
    longitude: float = Field(..., description="Geographic longitude")

class ReportResponse(BaseModel):
    id: int
    text: str
    timestamp: str
    reporter: str
    source: str
    incident_type: str
    location: str
    urgency: str
    people_at_risk: bool
    people_count: int
    category: str
    latitude: float
    longitude: float
    incident_id: Optional[int] = None

    class Config:
        from_attributes = True

class IncidentResponse(BaseModel):
    id: int
    title: str
    incident_type: str
    category: str
    location: str
    latitude: float
    longitude: float
    urgency: str
    priority_score: float
    status: str
    report_count: int
    people_at_risk: bool
    people_count: int
    ai_evidence: List[str]
    recommended_action: str
    first_reported_at: str
    last_reported_at: str
    reports: Optional[List[ReportResponse]] = None

    class Config:
        from_attributes = True

class IncidentStatusUpdate(BaseModel):
    status: str = Field(..., description="New status: Active, In Progress, or Resolved")

class StatsResponse(BaseModel):
    total_reports: int
    total_incidents: int
    critical_count: int
    high_count: int
    medium_count: int
    low_count: int
    active_count: int
    in_progress_count: int
    resolved_count: int

class SeedDemoResponse(BaseModel):
    message: str
    total_reports_processed: int
    total_unique_incidents: int
    breakdown: Dict[str, int]
