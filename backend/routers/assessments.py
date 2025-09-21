from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any, List, Optional
from datetime import datetime
from pydantic import BaseModel

from auth.dependencies import get_current_active_user
from config.database import get_db, COLLECTIONS
from google.cloud.firestore import Client
from services.gemini_service import GeminiService

router = APIRouter()

class AssessmentCreate(BaseModel):
    assessment_type: str
    title: str
    description: Optional[str] = None
    questions: List[Dict[str, Any]]
    time_limit: Optional[int] = None
    difficulty: str = "mixed"

class AssessmentResponse(BaseModel):
    question_id: str
    answer: Any
    time_spent: Optional[int] = None

@router.post("/", response_model=Dict[str, Any])
async def create_assessment(
    assessment_data: AssessmentCreate,
    current_user: dict = Depends(get_current_active_user),
    db: Client = Depends(get_db)
):
    """Create a new assessment"""
    try:
        assessment_doc = {
            "user_id": current_user["id"],
            "assessment_type": assessment_data.assessment_type,
            "title": assessment_data.title,
            "description": assessment_data.description or "",
            "total_questions": len(assessment_data.questions),
            "time_limit": assessment_data.time_limit,
            "difficulty": assessment_data.difficulty,
            "questions": assessment_data.questions,
            "responses": [],
            "status": "draft",
            "version": "1.0",
            "language": "en",
            "tags": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Save to Firestore
        doc_ref = db.collection(COLLECTIONS["ASSESSMENTS"]).add(assessment_doc)[1]
        assessment_doc["id"] = doc_ref.id
        
        return {
            "success": True,
            "message": "Assessment created successfully",
            "data": {"assessment": assessment_doc}
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create assessment: {str(e)}"
        )

@router.get("/", response_model=Dict[str, Any])
async def get_user_assessments(
    assessment_type: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
    current_user: dict = Depends(get_current_active_user),
    db: Client = Depends(get_db)
):
    """Get user's assessments"""
    try:
        query = db.collection(COLLECTIONS["ASSESSMENTS"]).where("user_id", "==", current_user["id"])
        
        if assessment_type:
            query = query.where("assessment_type", "==", assessment_type)
        if status:
            query = query.where("status", "==", status)
        
        # Order by created_at desc
        query = query.order_by("created_at", direction="DESCENDING")
        
        # Apply pagination
        assessments = query.limit(limit).offset(offset).get()
        
        assessment_list = []
        for assessment in assessments:
            assessment_data = assessment.to_dict()
            assessment_data["id"] = assessment.id
            assessment_list.append(assessment_data)
        
        return {
            "success": True,
            "data": {
                "assessments": assessment_list,
                "total": len(assessment_list),
                "limit": limit,
                "offset": offset
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get assessments: {str(e)}"
        )

@router.get("/{assessment_id}", response_model=Dict[str, Any])
async def get_assessment(
    assessment_id: str,
    current_user: dict = Depends(get_current_active_user),
    db: Client = Depends(get_db)
):
    """Get assessment details"""
    try:
        assessment_doc = db.collection(COLLECTIONS["ASSESSMENTS"]).document(assessment_id).get()
        
        if not assessment_doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assessment not found"
            )
        
        assessment_data = assessment_doc.to_dict()
        
        # Check if user owns the assessment
        if assessment_data["user_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: You can only view your own assessments"
            )
        
        assessment_data["id"] = assessment_id
        
        return {
            "success": True,
            "data": {"assessment": assessment_data}
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get assessment: {str(e)}"
        )

@router.post("/{assessment_id}/start", response_model=Dict[str, Any])
async def start_assessment(
    assessment_id: str,
    current_user: dict = Depends(get_current_active_user),
    db: Client = Depends(get_db)
):
    """Start an assessment"""
    try:
        assessment_ref = db.collection(COLLECTIONS["ASSESSMENTS"]).document(assessment_id)
        assessment_doc = assessment_ref.get()
        
        if not assessment_doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assessment not found"
            )
        
        assessment_data = assessment_doc.to_dict()
        
        # Check if user owns the assessment
        if assessment_data["user_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: You can only start your own assessments"
            )
        
        # Check if assessment is already completed
        if assessment_data["status"] == "completed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Assessment is already completed"
            )
        
        # Start assessment
        assessment_ref.update({
            "status": "in_progress",
            "started_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        })
        
        return {
            "success": True,
            "message": "Assessment started successfully",
            "data": {"assessment_id": assessment_id}
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start assessment: {str(e)}"
        )

@router.get("/questions", response_model=Dict[str, Any])
async def get_career_questions():
    """Get career assessment questions"""
    try:
        # Sample career assessment questions
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
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get questions: {str(e)}"
        )

@router.post("/submit-answers", response_model=Dict[str, Any])
async def submit_career_answers(
    answers: Dict[str, Any],
    current_user: dict = Depends(get_current_active_user),
    db: Client = Depends(get_db)
):
    """Submit career assessment answers and generate recommendations"""
    try:
        # Save user responses
        response_doc = {
            "user_id": current_user["id"],
            "answers": answers,
            "submitted_at": datetime.utcnow(),
            "assessment_type": "career_guidance"
        }
        
        # Save to Firestore
        doc_ref = db.collection(COLLECTIONS["ASSESSMENT_RESPONSES"]).add(response_doc)[1]
        response_doc["id"] = doc_ref.id
        
        # Generate recommendations using Gemini Pro
        try:
            gemini_service = GeminiService()
            recommendations_result = gemini_service.generate_course_recommendations(answers)
            
            # Save recommendations to database
            recommendations_doc = {
                "user_id": current_user["id"],
                "assessment_response_id": doc_ref.id,
                "recommendations": recommendations_result.get("recommendations", {}),
                "generated_at": datetime.utcnow(),
                "ai_model": "gemini-pro",
                "status": "completed" if recommendations_result.get("success") else "failed"
            }
            
            rec_doc_ref = db.collection(COLLECTIONS["RECOMMENDATIONS"]).add(recommendations_doc)[1]
            
            return {
                "success": True,
                "message": "Assessment submitted and recommendations generated successfully",
                "data": {
                    "response_id": doc_ref.id,
                    "recommendations_id": rec_doc_ref.id,
                    "recommendations": recommendations_result.get("recommendations", {})
                }
            }
            
        except Exception as gemini_error:
            # If Gemini fails, still save the response but note the failure
            print(f"Gemini API error: {str(gemini_error)}")
            
            return {
                "success": True,
                "message": "Assessment submitted successfully. Recommendations will be generated shortly.",
                "data": {
                    "response_id": doc_ref.id,
                    "recommendations": None,
                    "note": "AI recommendations are being processed"
                }
            }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit answers: {str(e)}"
        )

@router.get("/recommendations", response_model=Dict[str, Any])
async def get_user_recommendations(
    current_user: dict = Depends(get_current_active_user),
    db: Client = Depends(get_db)
):
    """Get user's course recommendations"""
    try:
        # Get user's latest recommendations
        recommendations_query = db.collection(COLLECTIONS["RECOMMENDATIONS"])\
            .where("user_id", "==", current_user["id"])\
            .order_by("generated_at", direction="DESCENDING")\
            .limit(1)\
            .get()
        
        if not recommendations_query:
            return {
                "success": False,
                "message": "No recommendations found. Please complete the assessment first.",
                "data": None
            }
        
        latest_recommendation = recommendations_query[0]
        recommendation_data = latest_recommendation.to_dict()
        recommendation_data["id"] = latest_recommendation.id
        
        return {
            "success": True,
            "data": {
                "recommendation": recommendation_data
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get recommendations: {str(e)}"
        )

@router.post("/{assessment_id}/responses", response_model=Dict[str, Any])
async def submit_response(
    assessment_id: str,
    response_data: AssessmentResponse,
    current_user: dict = Depends(get_current_active_user),
    db: Client = Depends(get_db)
):
    """Submit assessment response"""
    try:
        assessment_ref = db.collection(COLLECTIONS["ASSESSMENTS"]).document(assessment_id)
        assessment_doc = assessment_ref.get()
        
        if not assessment_doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assessment not found"
            )
        
        assessment_data = assessment_doc.to_dict()
        
        # Check if user owns the assessment
        if assessment_data["user_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: You can only submit responses to your own assessments"
            )
        
        # Check if assessment is in progress
        if assessment_data["status"] != "in_progress":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Assessment is not in progress"
            )
        
        # Add response
        response = {
            "question_id": response_data.question_id,
            "answer": response_data.answer,
            "time_spent": response_data.time_spent or 0,
            "timestamp": datetime.utcnow()
        }
        
        # Update responses array
        responses = assessment_data.get("responses", [])
        # Remove existing response for this question if any
        responses = [r for r in responses if r["question_id"] != response_data.question_id]
        responses.append(response)
        
        # Check if assessment is complete
        is_complete = len(responses) >= assessment_data["total_questions"]
        
        update_data = {
            "responses": responses,
            "updated_at": datetime.utcnow()
        }
        
        if is_complete:
            update_data["status"] = "completed"
            update_data["completed_at"] = datetime.utcnow()
        
        assessment_ref.update(update_data)
        
        return {
            "success": True,
            "message": "Response submitted successfully" if not is_complete else "Assessment completed successfully",
            "data": {
                "assessment_id": assessment_id,
                "is_complete": is_complete,
                "progress": int((len(responses) / assessment_data["total_questions"]) * 100)
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit response: {str(e)}"
        )

