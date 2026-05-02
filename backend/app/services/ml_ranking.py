import numpy as np
import pandas as pd
try:
    from sklearn.ensemble import RandomForestRegressor
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import mean_squared_error
except ImportError:
    # Fallback for environments without sklearn
    class RandomForestRegressor:
        def fit(self, X, y): pass
        def predict(self, X): return np.zeros(len(X))
    def train_test_split(*args, **kwargs): return args
    def mean_squared_error(y_true, y_pred): return 0

from sqlalchemy.orm import Session
from sqlalchemy import func, String
import joblib
import os
from ..models.feedback import HiringFeedback
from ..models.analytics import AnalyticsEvent

MODEL_PATH = "backend/ml_models/ranking_model.pkl"

def train_ranking_model(db: Session):
    """Train a model to predict match quality based on feedback."""
    # Get feedback data
    feedbacks = db.query(HiringFeedback).all()

    if len(feedbacks) < 10:
        return {"status": "not enough data", "samples": len(feedbacks)}

    # Prepare data
    data = []
    for feedback in feedbacks:
        # Get match data for this candidate/job from analytics
        # event_metadata['candidate_id']
        match = db.query(AnalyticsEvent).filter(
            AnalyticsEvent.event_type == "match_analyzed",
            func.cast(AnalyticsEvent.event_metadata['candidate_id'].astext, String) == str(feedback.candidate_id),
            func.cast(AnalyticsEvent.event_metadata['job_id'].astext, String) == str(feedback.job_id)
        ).first()

        if match:
            meta = match.event_metadata
            confidences = meta.get("skill_confidence", {})
            avg_conf = np.mean(list(confidences.values())) if confidences else 0
            
            data.append({
                "fit_score": meta.get("fit_score", 0),
                "semantic_similarity": meta.get("semantic_similarity", 0),
                "skill_confidence_avg": avg_conf,
                "hired": int(feedback.hired)
            })

    if len(data) < 10:
        return {"status": "not enough data after filtering", "samples": len(data)}

    df = pd.DataFrame(data)

    # Features and target
    X = df[["fit_score", "semantic_similarity", "skill_confidence_avg"]]
    y = df["hired"]  # Predict whether candidate was hired

    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)

    # Save model
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH)

    return {
        "status": "trained",
        "samples": len(data),
        "rmse": float(rmse),
        "features": list(X.columns)
    }

def predict_match_quality(match_data: dict) -> float:
    """Predict the likelihood of a candidate being hired."""
    if not os.path.exists(MODEL_PATH):
        # Fallback to a normalized fit score if model doesn't exist
        return float(match_data.get("fit_score", 0) / 100)

    try:
        model = joblib.load(MODEL_PATH)
        
        confidences = match_data.get("skill_confidence", {})
        avg_conf = np.mean(list(confidences.values())) if confidences else 0
        
        # Prepare features
        features = [
            match_data.get("fit_score", 0),
            match_data.get("semantic_similarity", 0),
            avg_conf
        ]

        # Predict
        prediction = model.predict([features])[0]
        return float(np.clip(prediction, 0, 1))  # Ensure between 0 and 1
    except Exception as e:
        print(f"ML Prediction Error: {e}")
        return float(match_data.get("fit_score", 0) / 100)
