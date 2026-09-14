import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from project root or backend folder
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
if not env_path.exists():
    env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

AI_MODE = os.getenv("AI_MODE", "local").lower()
WATSONX_APIKEY = os.getenv("WATSONX_APIKEY", "").strip()
WATSONX_PROJECT_ID = os.getenv("WATSONX_PROJECT_ID", "").strip()
WATSONX_URL = os.getenv("WATSONX_URL", "https://us-south.ml.cloud.ibm.com").strip()
WATSONX_MODEL_ID = os.getenv("WATSONX_MODEL_ID", "ibm/granite-3-8b-instruct").strip()

SIMILARITY_THRESHOLD = float(os.getenv("SIMILARITY_THRESHOLD", "0.55"))
PORT = int(os.getenv("PORT", "8000"))
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./emergency.db")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173").split(",")

# City Coordinates Geocoding Reference Map (Metro emergency grid)
# Default anchor: Metropolitan emergency center (lat: 32.7767, lng: -96.7970)
LOCATION_COORDINATES = {
    "Railway Station": {"lat": 32.7758, "lng": -96.8080},
    "Main Market Plaza": {"lat": 32.7832, "lng": -96.7950},
    "Metro Industrial Park": {"lat": 32.7485, "lng": -96.8250},
    "Riverdale Bridge": {"lat": 32.7620, "lng": -96.8120},
    "Sector 4 Construction Site": {"lat": 32.7910, "lng": -96.7820},
    "XYZ Road": {"lat": 32.7890, "lng": -96.8200},
    "Oakwood Avenue": {"lat": 32.7680, "lng": -96.7840},
    "Highway 101 Exit 14": {"lat": 32.8120, "lng": -96.8400},
    "5th Avenue": {"lat": 32.7800, "lng": -96.7990},
    "Pine Hill Ridge": {"lat": 32.8350, "lng": -96.7600},
    "Tech Park Substation": {"lat": 32.7540, "lng": -96.7650},
    "Downtown Central Junction": {"lat": 32.7795, "lng": -96.7975},
    "Hillside Road": {"lat": 32.8250, "lng": -96.7750},
    "Green Valley Sector 9": {"lat": 32.7350, "lng": -96.8100},
    "High Street": {"lat": 32.7780, "lng": -96.7920},
    "North Creek Gauge": {"lat": 32.8400, "lng": -96.8100},
    "Maple Street": {"lat": 32.7660, "lng": -96.8050},
    "Sunset Boulevard": {"lat": 32.7510, "lng": -96.7900},
}

DEFAULT_COORDINATES = {"lat": 32.7767, "lng": -96.7970}
