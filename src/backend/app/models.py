from sqlalchemy import Column, Integer, String, Float, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import json
from app.database import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    incident_type = Column(String(100), nullable=False, index=True)
    category = Column(String(100), nullable=False)
    location = Column(String(255), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    urgency = Column(String(50), nullable=False, index=True)  # CRITICAL, HIGH, MEDIUM, LOW
    priority_score = Column(Float, default=0.0, index=True)
    status = Column(String(50), default="Active", index=True) # Active, In Progress, Resolved
    report_count = Column(Integer, default=1)
    people_at_risk = Column(Boolean, default=False)
    people_count = Column(Integer, default=0)
    ai_evidence_json = Column(Text, default="[]")
    recommended_action = Column(Text, default="")
    first_reported_at = Column(String(50), default=lambda: datetime.utcnow().isoformat())
    last_reported_at = Column(String(50), default=lambda: datetime.utcnow().isoformat())

    reports = relationship("Report", back_populates="incident", order_by="Report.id.asc()")

    @property
    def ai_evidence(self):
        try:
            return json.loads(self.ai_evidence_json or "[]")
        except Exception:
            return []

    @ai_evidence.setter
    def ai_evidence(self, value):
        self.ai_evidence_json = json.dumps(value if isinstance(value, list) else [])


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    timestamp = Column(String(50), default=lambda: datetime.utcnow().isoformat())
    reporter = Column(String(100), default="Anonymous")
    source = Column(String(100), default="Web")
    incident_type = Column(String(100), nullable=False)
    location = Column(String(255), nullable=False)
    urgency = Column(String(50), nullable=False)
    people_at_risk = Column(Boolean, default=False)
    people_count = Column(Integer, default=0)
    category = Column(String(100), default="Observation")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=True, index=True)
    incident = relationship("Incident", back_populates="reports")
