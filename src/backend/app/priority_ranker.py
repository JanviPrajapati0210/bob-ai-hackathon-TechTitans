import math
from app.models import Incident

URGENCY_WEIGHTS = {
    "CRITICAL": 1000.0,
    "HIGH": 500.0,
    "MEDIUM": 200.0,
    "LOW": 50.0
}

CATEGORY_WEIGHTS = {
    "Rescue": 150.0,
    "Fire": 120.0,
    "Hazard": 100.0,
    "Infrastructure": 50.0,
    "Observation": 0.0
}

def calculate_priority_score(incident: Incident) -> float:
    """
    Component 4: AI Prioritization Algorithm
    Calculates a multi-factor emergency priority score based on:
    1. Base urgency level (Critical, High, Medium, Low)
    2. Incident category severity (Rescue, Hazard, Infrastructure, etc.)
    3. Human risk factor (trapped, casualties, people affected)
    4. Report corroboration volume (logarithmic scale)
    """
    urgency_base = URGENCY_WEIGHTS.get(incident.urgency.upper(), 100.0)
    category_base = CATEGORY_WEIGHTS.get(incident.category, 25.0)

    # Human life risk bonus
    human_risk = 0.0
    if incident.people_at_risk:
        human_risk += 350.0
        human_risk += min(incident.people_count, 10) * 30.0

    # Volume corroboration: multiple citizens reporting the same event indicates higher real-world severity
    # Uses scaled log2 factor to prevent infinite runaway while rewarding confirmed multi-reports
    volume_bonus = math.log2(max(incident.report_count, 1) + 1) * 60.0

    total_score = urgency_base + category_base + human_risk + volume_bonus
    return round(total_score, 2)
