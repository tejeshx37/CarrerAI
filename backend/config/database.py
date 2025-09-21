import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud import firestore as firestore_client
import os
from typing import Optional

# Global variables
db: Optional[firestore_client.Client] = None

def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    global db
    
    try:
        # Check if Firebase is already initialized
        if not firebase_admin._apps:
            # Load service account key
            service_account_path = os.path.join(
                os.path.dirname(os.path.dirname(__file__)), 
                "..", 
                "careerbridge-ai-c8f42-firebase-adminsdk-fbsvc-09f10bb1bc.json"
            )
            
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred, {
                'projectId': 'careerbridge-ai-c8f42',
                'databaseURL': 'https://careerbridge-ai-c8f42-default-rtdb.firebaseio.com'
            })
        
        # Initialize Firestore client
        db = firestore_client.Client(project='careerbridge-ai-c8f42')
        print("✅ Firebase Admin SDK initialized successfully")
        
    except Exception as e:
        print(f"❌ Error initializing Firebase: {e}")
        raise e

def get_db():
    """Get Firestore database instance"""
    if db is None:
        raise Exception("Database not initialized")
    return db

# Collection names
COLLECTIONS = {
    "USERS": "users",
    "ASSESSMENTS": "assessments",
    "ASSESSMENT_RESPONSES": "assessment_responses", 
    "CAREER_PATHS": "career_paths",
    "SKILLS": "skills",
    "JOBS": "jobs",
    "APPLICATIONS": "applications",
    "PSYCHOMETRIC_TESTS": "psychometric_tests",
    "MARKET_TRENDS": "market_trends",
    "RECOMMENDATIONS": "recommendations",
    "SESSIONS": "sessions"
}

