import sys
import unittest
from pathlib import Path

# Add backend root to sys.path
backend_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_root))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db
from app.ai_extractor import analyze_report
from app.models import Incident, Report

# Test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_emergency.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

class EmergencyAITestCase(unittest.TestCase):
    def setUp(self):
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)

    def tearDown(self):
        Base.metadata.drop_all(bind=engine)

    def test_ai_extraction_user_flood_example(self):
        """Test Case 1: User's primary example from problem statement."""
        text = "Water has entered our house near the railway station. Two elderly people are trapped."
        res = analyze_report(text)
        self.assertEqual(res.incident_type, "Flood")
        self.assertIn("Railway Station", res.location)
        self.assertTrue(res.people_at_risk)
        self.assertEqual(res.urgency, "CRITICAL")
        self.assertEqual(res.category, "Rescue")

    def test_ai_extraction_user_road_blockage_example(self):
        """Test Case 2: User's secondary example from problem statement."""
        text = "Road is blocked because of fallen tree near XYZ."
        res = analyze_report(text)
        self.assertEqual(res.incident_type, "Road Blockage")
        self.assertIn("XYZ", res.location)
        self.assertEqual(res.urgency, "HIGH")
        self.assertEqual(res.category, "Infrastructure")

    def test_ai_extraction_user_observation_example(self):
        """Test Case 3: User's tertiary example from problem statement."""
        text = "Water level seems slightly higher than usual."
        res = analyze_report(text)
        self.assertEqual(res.urgency, "LOW")
        self.assertEqual(res.category, "Observation")

    def test_similarity_deduplication(self):
        """Test Component 2: Deduplication and clustering of two similar emergency reports."""
        rep1 = client.post("/api/reports", json={
            "text": "Water has entered our house near the railway station. Two elderly people are trapped.",
            "reporter": "Citizen A"
        }).json()
        self.assertFalse(rep1["is_duplicate"])
        first_incident_id = rep1["incident"]["id"]

        rep2 = client.post("/api/reports", json={
            "text": "Railway station east exit is submerged. People are stranded waiting for boats.",
            "reporter": "Citizen B"
        }).json()
        self.assertTrue(rep2["is_duplicate"])
        self.assertEqual(rep2["incident"]["id"], first_incident_id)
        self.assertEqual(rep2["incident"]["report_count"], 2)

    def test_seed_demo_50_reports_to_18_incidents(self):
        """
        Hackathon Core Demo Test:
        50 reports processed -> 18 unique incidents
        Breakdown: 5 Critical, 6 High, 4 Medium, 3 Low
        Railway Station Incident: 11 reports, people at risk = True, rescue assessment
        """
        res = client.post("/api/demo/seed")
        self.assertEqual(res.status_code, 200)
        data = res.json()

        self.assertEqual(data["total_reports_processed"], 50)
        self.assertEqual(data["total_unique_incidents"], 18)
        self.assertEqual(data["breakdown"]["critical"], 5)
        self.assertEqual(data["breakdown"]["high"], 6)
        self.assertEqual(data["breakdown"]["medium"], 4)
        self.assertEqual(data["breakdown"]["low"], 3)

        incidents_res = client.get("/api/incidents")
        incidents = incidents_res.json()
        railway_flood = next((i for i in incidents if "Railway Station" in i["location"] and "Flood" in i["incident_type"]), None)

        self.assertIsNotNone(railway_flood)
        self.assertEqual(railway_flood["report_count"], 11)
        self.assertTrue(railway_flood["people_at_risk"])
        self.assertEqual(railway_flood["urgency"], "CRITICAL")
        self.assertIn("Prioritize rescue assessment", railway_flood["recommended_action"])
        self.assertTrue(any("11 similar reports" in e for e in railway_flood["ai_evidence"]))

    def test_stats_and_priority_endpoints(self):
        """Test Component 4 & Dashboard stats endpoints."""
        client.post("/api/demo/seed")
        stats = client.get("/api/stats").json()
        self.assertEqual(stats["total_reports"], 50)
        self.assertEqual(stats["total_incidents"], 18)
        self.assertEqual(stats["critical_count"], 5)
        self.assertEqual(stats["high_count"], 6)

        priority_feed = client.get("/api/reports/priority").json()
        self.assertEqual(len(priority_feed), 18)
        self.assertEqual(priority_feed[0]["urgency"], "CRITICAL")
        self.assertGreaterEqual(priority_feed[0]["priority_score"], priority_feed[-1]["priority_score"])

if __name__ == "__main__":
    unittest.main()

