from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Import your custom modules
from ml.model_trainer import train_and_get_model
import simulation.data_generator as sim

@asynccontextmanager
async def lifespan(app: FastAPI):
    # This code runs once on server startup
    print("--- ASTRA Backend Starting Up ---")
    print("Initializing Machine Learning Model...")
    
    # Train the model and store it in the app_state
    model, feature_names = train_and_get_model()
    if model and feature_names:
        # Pass the trained model and feature names to the data generator module
        sim.TRAINED_MODEL = model
        sim.FEATURE_NAMES = feature_names
        print("--- ML Model is trained and ready for predictions. ---")
    else:
        print("--- WARNING: ML Model training failed. Prediction endpoints will not work. ---")
    
    yield # The application runs here
    
    # This code runs on server shutdown
    print("--- ASTRA Backend Shutting Down ---")

# Initialize FastAPI App with the lifespan manager
app = FastAPI(lifespan=lifespan)

# Configure CORS to allow your Next.js frontend to make requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API ENDPOINTS ---

@app.get("/")
def read_root():
    return {"message": "ASTRA FastAPI Backend is running."}

@app.get("/api/dashboard")
def get_dashboard():
    """Endpoint for the main dashboard page, providing a consolidated summary."""
    return sim.get_dashboard_data()

@app.get("/api/alerts")
def get_alerts():
    """Endpoint for the dedicated alerts page and the layout's popup."""
    return sim.get_all_alerts()

@app.get("/api/real-time-data")
def get_real_time_data():
    """Endpoint for the detailed, historical time-series charts page."""
    return sim.get_real_time_charts_data()

@app.get("/api/risk-assessment")
def get_risk_assessment():
    """This page uses the AI Prediction Panel, so we serve prediction data."""
    return sim.get_prediction_data()

@app.get("/api/predictions")
def get_predictions():
    """Endpoint for the AI prediction panel, powered by the live ML model."""
    return sim.get_prediction_data()

@app.get("/api/site-map")
def get_site_map():
    """Endpoint to provide data for visualizing the mine layout."""
    return sim.get_site_map_data()

@app.get("/api/system-health")
def get_system_health():
    """Endpoint for the system health monitoring component."""
    return sim.get_system_health_data()

