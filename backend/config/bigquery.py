from google.cloud import bigquery
import os
from typing import Optional

# Global variables
bq_client: Optional[bigquery.Client] = None

def initialize_bigquery():
    """Initialize BigQuery client"""
    global bq_client
    
    try:
        # Load service account key
        service_account_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)), 
            "..", 
            "careerbridge-ai-c8f42-firebase-adminsdk-fbsvc-09f10bb1bc.json"
        )
        
        bq_client = bigquery.Client.from_service_account_json(
            service_account_path,
            project='careerbridge-ai-c8f42'
        )
        print("✅ BigQuery initialized successfully")
        
    except Exception as e:
        print(f"❌ Error initializing BigQuery: {e}")
        raise e

def get_bigquery_client():
    """Get BigQuery client instance"""
    if bq_client is None:
        raise Exception("BigQuery client not initialized")
    return bq_client

# BigQuery configuration
BIGQUERY_CONFIG = {
    "project_id": "careerbridge-ai-c8f42",
    "dataset_id": "career_data",
    "tables": {
        "JOB_TRENDS": "job_trends",
        "SKILL_DEMAND": "skill_demand", 
        "SALARY_DATA": "salary_data",
        "INDUSTRY_ANALYSIS": "industry_analysis",
        "LOCATION_INSIGHTS": "location_insights",
        "EDUCATION_REQUIREMENTS": "education_requirements"
    }
}

