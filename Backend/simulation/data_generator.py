import random
from datetime import datetime, timedelta
import pandas as pd

# These global variables will be populated by main.py on server startup
TRAINED_MODEL = None
FEATURE_NAMES = None

# In-memory state for the simulation
state = {
    "tick": 0,
    "is_critical_event": False,
    "critical_event_start_tick": -1,
    "full_alerts": [],
    "historical_charts": {
        "vibration": [], "stress": [], "temperature": [], "acoustic": []
    }
}

# --- SIMULATION HELPER FUNCTIONS ---
def _initialize_simulation():
    """Populates initial historical data."""
    for _ in range(24):
        state["historical_charts"]["vibration"].append(random.uniform(1, 3))
        state["historical_charts"]["stress"].append(random.uniform(30, 38))
        state["historical_charts"]["temperature"].append(random.uniform(25, 30))
        state["historical_charts"]["acoustic"].append(random.uniform(40, 55))
_initialize_simulation()

def _update_simulation_state():
    """Advances the simulation clock and manages event lifecycles."""
    state["tick"] += 1

    if state["tick"] % 60 == 0 and not state["is_critical_event"]:
        state["is_critical_event"] = True
        state["critical_event_start_tick"] = state["tick"]

    if state["is_critical_event"] and state["tick"] > state["critical_event_start_tick"] + 20:
        state["is_critical_event"] = False

def _generate_live_feature_vector():
    """Generates a single sample of 13 features for the ML model."""
    if state["is_critical_event"]:
        return [
            random.uniform(180, 250), random.uniform(15, 25), random.uniform(3.5, 5.0),
            random.uniform(0.4, 0.6), random.uniform(25, 45), random.uniform(80, 100),
            random.uniform(400, 600), random.uniform(35, 50), random.uniform(10, 20),
            random.uniform(30, 45), random.uniform(45, 55), random.uniform(10, 15),
            random.uniform(4.0, 6.0)
        ]
    else:
        return [
            random.uniform(60, 120), random.uniform(1, 5), random.uniform(0.5, 1.5),
            random.uniform(0.05, 0.15), random.uniform(70, 90), random.uniform(180, 220),
            random.uniform(10, 50), random.uniform(1, 5), random.uniform(0, 2),
            random.uniform(80, 100), random.uniform(20, 30), random.uniform(25, 30),
            random.uniform(0.5, 1.5)
        ]

# --- API DATA PROVIDER FUNCTIONS ---

def get_dashboard_data():
    """Provides a consolidated summary for the main dashboard page."""
    # This function is the primary driver of the simulation tick
    _update_simulation_state()
    return {
        "sensorOverview": get_sensor_overview_data(),
        "aiPrediction": get_prediction_data(),
        "latestAlerts": get_all_alerts(update_state=False),  # Pass False to prevent double-update
        "charts": get_real_time_charts_data(update_state=False),  # Pass False to prevent double-update
    }

def get_sensor_overview_data():
    vibration = random.uniform(5, 9) if state["is_critical_event"] else random.uniform(1, 4)
    stress = random.uniform(50, 70) if state["is_critical_event"] else random.uniform(30, 38)
    acoustic = random.uniform(75, 90) if state["is_critical_event"] else random.uniform(40, 55)
    
    return [
        {"id": "vibration", "name": "Vibration", "value": round(vibration, 1), "unit": "mm/s", "status": "critical" if vibration > 8 else "warning" if vibration > 5 else "normal", "trend": "+1.2", "lastUpdate": "Just now", "threshold": {"warning": 5.0, "critical": 8.0}},
        {"id": "stress", "name": "Wall Stress", "value": round(stress, 1), "unit": "MPa", "status": "critical" if stress > 60 else "warning" if stress > 40 else "normal", "trend": "+3.1", "lastUpdate": "Just now", "threshold": {"warning": 40.0, "critical": 60.0}},
        {"id": "temperature", "name": "Temperature", "value": 28.5, "unit": "°C", "status": "normal", "trend": "-0.1", "lastUpdate": "1m ago", "threshold": {"warning": 35.0, "critical": 45.0}},
        {"id": "acoustic", "name": "Acoustic Activity", "value": round(acoustic, 1), "unit": "dB", "status": "critical" if acoustic > 70 else "warning" if acoustic > 60 else "normal", "trend": "+6.2", "lastUpdate": "Just now", "threshold": {"warning": 60.0, "critical": 70.0}},
    ]

def get_prediction_data():
    if not TRAINED_MODEL or not FEATURE_NAMES:
        return {"error": "ML model is not available."}
    
    feature_vector = _generate_live_feature_vector()
    features_df = pd.DataFrame([feature_vector], columns=FEATURE_NAMES)
    
    prediction = TRAINED_MODEL.predict(features_df)[0]
    probability = TRAINED_MODEL.predict_proba(features_df)[0][1]
    
    return {
        "riskProbability": int(probability * 100),
        "trend": "increasing" if state["is_critical_event"] else "stable",
        "confidence": int(abs(probability - 0.5) * 2 * 15 + 80),
        "lastModelRun": "Just now",
        "nextPrediction": "in 15 seconds",
        "factors": [
            {"name": "Porewater Pressure", "impact": "high", "value": f"+{random.randint(10,20)}%"},
            {"name": "Displacement", "impact": "medium", "value": f"+{random.randint(5,10)}%"},
            {"name": "Microseismic Events", "impact": "low", "value": f"+{random.randint(1,5)}%"}
        ],
        "recommendations": [
            "Evacuate personnel from Zone C immediately"
        ]
    }

def get_all_alerts(update_state=True):
    """
    Generates alert data. Advances simulation state if called directly.
    """
    if update_state:
        _update_simulation_state()

    if state["is_critical_event"] and not any(a['severity'] == 'critical' and not a['acknowledged'] for a in state['full_alerts']):
        state['full_alerts'].insert(0, {"id": f"ALT-{state['tick']}", "timestamp": datetime.now().isoformat(), "sensorType": "AI Model", "severity": "critical", "zone": "C3", "message": "AI model predicts >85% rockfall probability.", "recommendedAction": "Evacuate Zone C immediately.", "acknowledged": False})

    if state["tick"] % 25 == 0:
         state['full_alerts'].insert(0, {"id": f"ALT-{state['tick']}", "timestamp": (datetime.now() - timedelta(minutes=random.randint(1,10))).isoformat(), "sensorType": "Vibration", "severity": "high", "zone": "A1", "message": "Vibration levels approaching warning threshold.", "recommendedAction": "Increase monitoring frequency.", "acknowledged": False})
    
    return state.get('full_alerts', [])[:15]


def get_real_time_charts_data(update_state=True):
    """
    Generates time-series data for charts. Advances simulation state if called directly.
    """
    if update_state:
        _update_simulation_state()

    for key in state["historical_charts"]:
        series = state["historical_charts"][key]
        new_val = series[-1] + (random.random() - 0.5) * (series[-1] * 0.1)
        if state["is_critical_event"]: new_val += 5
        series.append(new_val)
        state["historical_charts"][key] = series[-24:]

    def format_series(series):
        now = datetime.now()
        return [{
            "time": (now - timedelta(hours=i)).strftime("%H:%M"),
            "timestamp": (now - timedelta(hours=i)).timestamp() * 1000,
            "value": round(max(0, val), 2)
        } for i, val in enumerate(reversed(series))]
        
    return {
        "vibration": format_series(state["historical_charts"]["vibration"]),
        "stress": format_series(state["historical_charts"]["stress"]),
        "temperature": format_series(state["historical_charts"]["temperature"]),
        "acoustic": format_series(state["historical_charts"]["acoustic"]),
    }

def get_system_health_data():
    offline_sensor = state["tick"] % 50 > 40
    return {
        "sensors": [
            {"id": "VIB-001", "name": "Vibration Sensor A1", "status": "online", "lastPing": "2s ago", "battery": 87},
            {"id": "VIB-002", "name": "Vibration Sensor B2", "status": "online", "lastPing": "1s ago", "battery": 92},
            {"id": "STR-001", "name": "Stress Sensor C3", "status": "warning", "lastPing": "45s ago", "battery": 23},
            {"id": "TMP-002", "name": "Temperature Sensor B5", "status": "offline" if offline_sensor else "online", "lastPing": "5m ago" if offline_sensor else "2s ago", "battery": 0 if offline_sensor else 88},
        ],
        "systemComponents": [
            {"name": "Data Processing Server", "status": "online", "uptime": "99.8%", "load": random.randint(40, 50)},
            {"name": "AI Model Server", "status": "online", "uptime": "99.9%", "load": random.randint(65, 75)},
            {"name": "Network Gateway", "status": "warning" if state["is_critical_event"] else "online", "uptime": "98.2%", "load": random.randint(85, 95) if state["is_critical_event"] else random.randint(50,60)},
        ],
        "networkStatus": { "connectivity": "stable", "bandwidth": 85, "latency": 12, "packetsLost": 0.02,},
    }

def get_site_map_data():
    return [
        [ {"zone": "A1", "risk": "low", "value": 15}, {"zone": "A2", "risk": "medium", "value": 45}, {"zone": "A3", "risk": "low", "value": 20} ],
        [ {"zone": "B1", "risk": "medium", "value": 52}, {"zone": "B2", "risk": "high" if state["is_critical_event"] else "medium", "value": 78}, {"zone": "B3", "risk": "high", "value": 82} ],
        [ {"zone": "C1", "risk": "low", "value": 18}, {"zone": "C2", "risk": "medium", "value": 48}, {"zone": "C3", "risk": "critical" if state["is_critical_event"] else "high", "value": 85} ],
    ]



