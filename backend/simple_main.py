from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Security scheme
security = HTTPBearer()

# Create FastAPI app
app = FastAPI(
    title="CareerBridgeAI API",
    description="AI-powered career guidance platform for Indian students",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "CareerBridgeAI API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "success": True,
        "message": "CareerBridgeAI Backend is running",
        "status": "healthy"
    }

# Simple questions endpoint
@app.get("/api/assessments/questions")
async def get_career_questions():
    """Get career assessment questions"""
    questions = [
        {
            "id": 1,
            "question": "What is your current education level?",
            "type": "single",
            "options": [
                "High School",
                "Associate Degree", 
                "Bachelor's Degree",
                "Master's Degree",
                "PhD/Doctorate"
            ]
        },
        {
            "id": 2,
            "question": "Which of the following career fields interest you most?",
            "type": "multiple",
            "options": [
                "Technology/Software Development",
                "Healthcare",
                "Finance/Banking",
                "Education",
                "Marketing/Advertising",
                "Engineering",
                "Business/Management",
                "Arts/Design"
            ]
        },
        {
            "id": 3,
            "question": "How many years of work experience do you have?",
            "type": "single",
            "options": [
                "0-1 years (Entry level)",
                "2-3 years (Junior)",
                "4-6 years (Mid-level)",
                "7-10 years (Senior)",
                "10+ years (Expert)"
            ]
        },
        {
            "id": 4,
            "question": "What type of work environment do you prefer?",
            "type": "single",
            "options": [
                "Remote work",
                "Office-based",
                "Hybrid (mix of remote and office)",
                "Field work",
                "No preference"
            ]
        },
        {
            "id": 5,
            "question": "Which skills do you currently possess? (Select all that apply)",
            "type": "multiple",
            "options": [
                "Programming/Coding",
                "Data Analysis",
                "Project Management",
                "Communication",
                "Leadership",
                "Problem Solving",
                "Creative Thinking",
                "Technical Writing"
            ]
        }
    ]
    
    return {
        "success": True,
        "data": {"questions": questions}
    }

# Simple submit answers endpoint
@app.post("/api/assessments/submit-answers")
async def submit_career_answers(answers: dict):
    """Submit career assessment answers"""
    try:
        # For now, just return a mock response
        mock_recommendations = {
            "career_path": "AI-Generated Career Path based on your responses",
            "skill_gaps": ["Communication", "Technical Skills", "Leadership"],
            "courses": [
                {
                    "title": "Professional Development Fundamentals",
                    "description": "Essential skills for career advancement",
                    "category": "Professional Development",
                    "difficulty": "Beginner",
                    "duration": "6 weeks",
                    "platform": "CareerBridgeAI Learning",
                    "priority": "High",
                    "reason": "Foundation for career growth"
                },
                {
                    "title": "Industry-Specific Skills",
                    "description": "Skills relevant to your career interests",
                    "category": "Technical",
                    "difficulty": "Intermediate",
                    "duration": "8 weeks",
                    "platform": "Specialized Learning Platform",
                    "priority": "High",
                    "reason": "Directly applicable to career interests"
                }
            ],
            "learning_path": "Begin with foundational courses, then progress to specialized skills",
            "next_steps": ["Review your career goals", "Start with high-priority courses", "Track your progress"]
        }
        
        return {
            "success": True,
            "message": "Assessment submitted and recommendations generated successfully",
            "data": {
                "response_id": "mock_response_id",
                "recommendations_id": "mock_recommendations_id",
                "recommendations": mock_recommendations
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to submit answers: {str(e)}"
        )

# Simple recommendations endpoint
@app.get("/api/assessments/recommendations")
async def get_user_recommendations():
    """Get user's course recommendations"""
    mock_recommendations = {
        "career_path": "AI-Generated Career Path based on your responses",
        "skill_gaps": ["Communication", "Technical Skills", "Leadership"],
        "courses": [
            {
                "title": "Professional Development Fundamentals",
                "description": "Essential skills for career advancement",
                "category": "Professional Development",
                "difficulty": "Beginner",
                "duration": "6 weeks",
                "platform": "CareerBridgeAI Learning",
                "priority": "High",
                "reason": "Foundation for career growth"
            },
            {
                "title": "Industry-Specific Skills",
                "description": "Skills relevant to your career interests",
                "category": "Technical",
                "difficulty": "Intermediate",
                "duration": "8 weeks",
                "platform": "Specialized Learning Platform",
                "priority": "High",
                "reason": "Directly applicable to career interests"
            }
        ],
        "learning_path": "Begin with foundational courses, then progress to specialized skills",
        "next_steps": ["Review your career goals", "Start with high-priority courses", "Track your progress"]
    }
    
    return {
        "success": True,
        "data": {
            "recommendation": {
                "recommendations": mock_recommendations,
                "generated_at": "2024-01-01T00:00:00Z",
                "ai_model": "mock-model"
            }
        }
    }

if __name__ == "__main__":
    uvicorn.run(
        "simple_main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )