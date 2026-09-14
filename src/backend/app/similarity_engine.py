import re
import numpy as np
from typing import List, Tuple, Optional, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.config import SIMILARITY_THRESHOLD
from app.schemas import ReportAnalysis
from app.models import Incident, Report

def compute_text_similarity(text1: str, text2: str) -> float:
    """Calculates cosine similarity between two text snippets using TF-IDF n-grams."""
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words="english")
    try:
        tfidf_matrix = vectorizer.fit_transform([text1, text2])
        sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return float(sim)
    except Exception:
        # If vocabulary is empty or single word
        return 0.0


def find_matching_incident(
    report_text: str,
    analysis: ReportAnalysis,
    active_incidents: List[Incident]
) -> Tuple[Optional[Incident], float]:
    """
    Person 2 Similarity Engine:
    Compares incoming report against active incidents to identify duplicates or related reports.
    """
    if not active_incidents:
        return None, 0.0

    best_match: Optional[Incident] = None
    highest_score = 0.0

    report_repr = f"{report_text} {analysis.location} {analysis.incident_type}".lower()

    for incident in active_incidents:
        # Build incident representative text from its title, location, type, and existing reports
        incident_texts = [incident.title, incident.location, incident.incident_type]
        if incident.reports:
            incident_texts.extend([r.text for r in incident.reports[:5]])
        incident_repr = " ".join(incident_texts).lower()

        # Text cosine similarity
        text_sim = compute_text_similarity(report_repr, incident_repr)

        # Entity correlation bonus
        location_match = (
            analysis.location.lower() in incident.location.lower() or
            incident.location.lower() in analysis.location.lower()
        )

        type_match = (
            analysis.incident_type.lower() in incident.incident_type.lower() or
            incident.incident_type.lower() in analysis.incident_type.lower()
        )

        composite_score = text_sim

        if location_match and type_match:
            composite_score = max(composite_score, 0.75 + (text_sim * 0.25))
        elif location_match:
            composite_score = max(composite_score, 0.50 + (text_sim * 0.40))
        elif type_match:
            composite_score = max(composite_score, 0.40 + (text_sim * 0.40))

        if composite_score > highest_score:
            highest_score = composite_score
            best_match = incident

    if highest_score >= SIMILARITY_THRESHOLD and best_match is not None:
        return best_match, highest_score

    return None, highest_score


def synthesize_ai_evidence(incident: Incident, reports: List[Report]) -> Tuple[List[str], str]:
    """
    Synthesizes verifiable AI evidence and recommends actionable response based on all merged reports.
    """
    report_count = len(reports)
    evidence: List[str] = []

    # Count specific signals
    trapped_count = sum(1 for r in reports if re.search(r"trapped|buried|stranded|unable to evacuate", r.text, re.I))
    rising_water_count = sum(1 for r in reports if re.search(r"rising|chest height|flash flood|gushing", r.text, re.I))
    smoke_flame_count = sum(1 for r in reports if re.search(r"smoke|flames|billowing|shooting|fire", r.text, re.I))
    power_wire_count = sum(1 for r in reports if re.search(r"power line|live wire|sparking|electrocution", r.text, re.I))
    gas_fume_count = sum(1 for r in reports if re.search(r"gas leak|fumes|hissing|toxic", r.text, re.I))
    structural_count = sum(1 for r in reports if re.search(r"crack|collapse|scaffolding|vibrating", r.text, re.I))

    evidence.append(f"{report_count} similar reports received and clustered")

    if trapped_count > 0:
        evidence.append(f"{trapped_count} reports mention trapped people")
    if rising_water_count > 0:
        evidence.append(f"{rising_water_count} reports mention rising or surging water")
    if smoke_flame_count > 0:
        evidence.append(f"{smoke_flame_count} reports describe heavy smoke or active flames")
    if power_wire_count > 0:
        evidence.append(f"{power_wire_count} reports report live sparking wires")
    if gas_fume_count > 0:
        evidence.append(f"{gas_fume_count} reports confirm chemical or gas odor")
    if structural_count > 0:
        evidence.append(f"{structural_count} reports indicate severe structural instability")

    evidence.append(f"Location mentioned consistently: {incident.location}")

    # Recommended action synthesis
    action = "Dispatch field assessment team to confirm conditions."
    
    if incident.incident_type == "Flood" and trapped_count > 0:
        action = "Prioritize rescue assessment. Deploy swift water rescue boats and evacuation team immediately."
    elif incident.incident_type == "Flood":
        action = "Deploy portable flood barriers, stage water pumps, and issue flash flood evacuation advisory."
    elif "Fire" in incident.incident_type:
        action = "Dispatch 2nd alarm fire response and aerial ladder units. Establish firebreak and ventilate."
    elif incident.incident_type == "Gas Leak":
        action = "Establish 500m safety perimeter, isolate gas trunk valves, and mandate chemical evacuation."
    elif incident.incident_type in ["Bridge Structural Damage", "Building Collapse"]:
        action = "Blockade approaches immediately. Dispatch USAR search-and-rescue team with structural acoustic sensors."
    elif incident.incident_type == "Downed Power Line":
        action = "Request emergency substation line cut from utility grid. Cordon off electrified wet pavement."
    elif incident.incident_type == "Road Blockage":
        action = "Dispatch municipal highway team with heavy chainsaws and cranes to clear traffic lanes."
    elif incident.incident_type == "Vehicle Collision":
        action = "Dispatch trauma EMS units, tow wreckers, and hazmat sand units for highway fuel leak."
    elif incident.incident_type == "Water Main Burst":
        action = "Notify water authority for emergency valve shutoff. Barricade road collapse sinkhole area."
    elif "Observation" in incident.incident_type or incident.urgency == "LOW":
        action = "Log gauge metrics in telemetry database; maintain automated routine monitoring."

    return evidence, action
