from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any, Optional, List
from pydantic import BaseModel

from auth.dependencies import get_current_active_user
from config.database import get_db, COLLECTIONS
from config.bigquery import get_bigquery_client
from google.cloud.firestore import Client

router = APIRouter()

class CareerRoadmapRequest(BaseModel):
    target_role: str
    timeframe: str = "2Y"

@router.get("/recommendations", response_model=Dict[str, Any])
async def get_career_recommendations(
    limit: int = 10,
    include_salary: bool = True,
    include_skills: bool = True,
    current_user: dict = Depends(get_current_active_user),
    db: Client = Depends(get_db)
):
    """Get personalized career recommendations"""
    try:
        # Mock recommendations for now (replace with AI logic)
        recommendations = [
            {
                "job_title": "Software Engineer",
                "industry": "Technology",
                "match_score": 85,
                "reason": "Based on your technical skills and interests",
                "required_skills": ["Python", "JavaScript", "React", "Node.js"],
                "salary_range": "₹6,00,000 - ₹12,00,000",
                "career_path": ["Junior Developer", "Senior Developer", "Tech Lead"],
                "action_steps": [
                    "Complete Python certification",
                    "Build portfolio projects",
                    "Apply for entry-level positions"
                ]
            },
            {
                "job_title": "Data Scientist",
                "industry": "Technology",
                "match_score": 78,
                "reason": "Your analytical skills align with data science",
                "required_skills": ["Python", "Machine Learning", "Statistics", "SQL"],
                "salary_range": "₹8,00,000 - ₹15,00,000",
                "career_path": ["Data Analyst", "Data Scientist", "Senior Data Scientist"],
                "action_steps": [
                    "Learn machine learning fundamentals",
                    "Complete data science projects",
                    "Get relevant certifications"
                ]
            }
        ]
        
        return {
            "success": True,
            "data": {
                "recommendations": recommendations[:limit],
                "user_profile": {
                    "career_stage": current_user.get("current_education_level", "Not Set"),
                    "experience_level": "Entry Level",
                    "profile_completion": current_user.get("profile_completion_percentage", 0)
                },
                "market_insights": {
                    "total_opportunities": len(recommendations),
                    "average_salary": "₹9,00,000",
                    "top_skills": ["Python", "JavaScript", "React", "Machine Learning"]
                }
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get career recommendations: {str(e)}"
        )

@router.get("/trends", response_model=Dict[str, Any])
async def get_job_market_trends(
    timeframe: str = "1Y",
    location: str = "India",
    industry: Optional[str] = None
):
    """Get job market trends"""
    try:
        # Mock trends data (replace with BigQuery integration)
        trends = [
            {
                "job_title": "Software Engineer",
                "industry": "Technology",
                "demand_score": 0.85,
                "growth_rate": 15.2,
                "average_salary": 900000,
                "skill_requirements": ["Python", "JavaScript", "React", "Node.js"],
                "date": "2024-01-01"
            },
            {
                "job_title": "Data Scientist",
                "industry": "Technology", 
                "demand_score": 0.78,
                "growth_rate": 22.1,
                "average_salary": 1200000,
                "skill_requirements": ["Python", "Machine Learning", "Statistics"],
                "date": "2024-01-01"
            }
        ]
        
        # Filter by industry if specified
        if industry:
            trends = [t for t in trends if industry.lower() in t["industry"].lower()]
        
        return {
            "success": True,
            "data": {
                "trends": trends,
                "timeframe": timeframe,
                "location": location,
                "industry": industry
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get job market trends: {str(e)}"
        )

@router.get("/skills", response_model=Dict[str, Any])
async def get_skill_demand_analysis(
    skills: Optional[str] = None,
    location: str = "India"
):
    """Get skill demand analysis"""
    try:
        skill_list = skills.split(",") if skills else []
        
        # Mock skill data (replace with BigQuery integration)
        skill_data = [
            {
                "skill_name": "Python",
                "demand_score": 0.92,
                "growth_rate": 18.5,
                "average_salary_impact": 150000,
                "job_titles": ["Software Engineer", "Data Scientist", "Backend Developer"],
                "industries": ["Technology", "Finance", "Healthcare"],
                "date": "2024-01-01"
            },
            {
                "skill_name": "JavaScript",
                "demand_score": 0.88,
                "growth_rate": 12.3,
                "average_salary_impact": 120000,
                "job_titles": ["Frontend Developer", "Full Stack Developer", "Web Developer"],
                "industries": ["Technology", "E-commerce", "Media"],
                "date": "2024-01-01"
            }
        ]
        
        # Filter by requested skills if specified
        if skill_list:
            skill_data = [s for s in skill_data if s["skill_name"].lower() in [sk.lower() for sk in skill_list]]
        
        return {
            "success": True,
            "data": {
                "skills": skill_data,
                "location": location,
                "requested_skills": skill_list
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get skill demand analysis: {str(e)}"
        )

@router.get("/salary", response_model=Dict[str, Any])
async def get_salary_insights(
    job_title: str,
    location: str = "India",
    experience: str = "0-2"
):
    """Get salary insights"""
    try:
        if not job_title:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Job title is required"
            )
        
        # Mock salary data (replace with BigQuery integration)
        salary_data = [
            {
                "job_title": job_title,
                "location": location,
                "experience_level": experience,
                "min_salary": 400000,
                "max_salary": 800000,
                "average_salary": 600000,
                "median_salary": 580000,
                "percentile_25": 450000,
                "percentile_75": 700000,
                "percentile_90": 750000,
                "sample_size": 150,
                "date": "2024-01-01"
            }
        ]
        
        return {
            "success": True,
            "data": {
                "salary_data": salary_data,
                "job_title": job_title,
                "location": location,
                "experience": experience
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get salary insights: {str(e)}"
        )

@router.get("/emerging-roles", response_model=Dict[str, Any])
async def get_emerging_job_roles(
    timeframe: str = "6M"
):
    """Get emerging job roles"""
    try:
        # Mock emerging roles data (replace with BigQuery integration)
        emerging_roles = [
            {
                "job_title": "AI Engineer",
                "industry": "Technology",
                "emergence_score": 0.85,
                "growth_rate": 45.2,
                "skill_requirements": ["Python", "Machine Learning", "TensorFlow", "PyTorch"],
                "education_requirements": "Bachelor's in Computer Science or related field",
                "salary_range": "₹10,00,000 - ₹20,00,000",
                "location_distribution": ["Bangalore", "Mumbai", "Delhi", "Hyderabad"],
                "date": "2024-01-01"
            },
            {
                "job_title": "DevOps Engineer",
                "industry": "Technology",
                "emergence_score": 0.78,
                "growth_rate": 32.1,
                "skill_requirements": ["Docker", "Kubernetes", "AWS", "CI/CD"],
                "education_requirements": "Bachelor's in Computer Science or related field",
                "salary_range": "₹8,00,000 - ₹16,00,000",
                "location_distribution": ["Bangalore", "Pune", "Mumbai", "Chennai"],
                "date": "2024-01-01"
            }
        ]
        
        return {
            "success": True,
            "data": {
                "emerging_roles": emerging_roles,
                "timeframe": timeframe
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get emerging job roles: {str(e)}"
        )

@router.get("/skill-gaps", response_model=Dict[str, Any])
async def get_skill_gap_analysis(
    current_user: dict = Depends(get_current_active_user)
):
    """Get skill gap analysis for user"""
    try:
        current_skills = current_user.get("technical_skills", []) + current_user.get("soft_skills", [])
        target_roles = current_user.get("career_interests", [])
        
        # Mock skill gap data (replace with AI analysis)
        skill_gaps = [
            {
                "skill_name": "Python",
                "demand_score": 0.92,
                "average_salary_impact": 150000,
                "learning_difficulty": "Medium",
                "time_to_learn": "3-6 months",
                "related_skills": ["Django", "Flask", "Pandas", "NumPy"],
                "job_titles": ["Software Engineer", "Data Scientist"],
                "industries": ["Technology", "Finance"],
                "date": "2024-01-01"
            },
            {
                "skill_name": "Machine Learning",
                "demand_score": 0.88,
                "average_salary_impact": 200000,
                "learning_difficulty": "Hard",
                "time_to_learn": "6-12 months",
                "related_skills": ["Python", "Statistics", "Linear Algebra"],
                "job_titles": ["Data Scientist", "ML Engineer"],
                "industries": ["Technology", "Healthcare", "Finance"],
                "date": "2024-01-01"
            }
        ]
        
        return {
            "success": True,
            "data": {
                "current_skills": current_skills,
                "skill_gaps": skill_gaps[:10],
                "target_roles": target_roles
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get skill gap analysis: {str(e)}"
        )

@router.post("/roadmap", response_model=Dict[str, Any])
async def generate_career_roadmap(
    roadmap_request: CareerRoadmapRequest,
    current_user: dict = Depends(get_current_active_user)
):
    """Generate career roadmap"""
    try:
        # Mock roadmap data (replace with AI generation)
        roadmap = {
            "phases": [
                {
                    "phase": 1,
                    "duration": "0-6 months",
                    "title": "Foundation Building",
                    "goals": [
                        "Learn core programming concepts",
                        "Build fundamental projects",
                        "Understand industry basics"
                    ],
                    "skills": ["Python basics", "Git version control", "Problem solving"],
                    "certifications": ["Python Programming Certificate"],
                    "projects": ["Portfolio website", "Calculator app", "Data analysis project"],
                    "networking": ["Join coding communities", "Attend tech meetups"],
                    "timeline": "6 months",
                    "success_metrics": [
                        "Complete 3 projects",
                        "Obtain 1 certification",
                        "Build professional network"
                    ]
                },
                {
                    "phase": 2,
                    "duration": "6-12 months",
                    "title": "Skill Development",
                    "goals": [
                        "Master advanced concepts",
                        "Specialize in chosen domain",
                        "Build professional portfolio"
                    ],
                    "skills": ["Advanced Python", "Framework expertise", "Database management"],
                    "certifications": ["Advanced Python Certificate", "Framework Certification"],
                    "projects": ["Full-stack application", "Open source contribution", "Complex data project"],
                    "networking": ["Present at conferences", "Mentor junior developers"],
                    "timeline": "6 months",
                    "success_metrics": [
                        "Complete 5 advanced projects",
                        "Obtain 2 certifications",
                        "Contribute to open source"
                    ]
                }
            ]
        }
        
        return {
            "success": True,
            "data": {
                "roadmap": roadmap,
                "target_role": roadmap_request.target_role,
                "timeframe": roadmap_request.timeframe,
                "user_profile": {
                    "current_level": current_user.get("current_education_level", "Not Set"),
                    "current_skills": current_user.get("technical_skills", []),
                    "education_level": current_user.get("current_education_level", "Not Set")
                }
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate career roadmap: {str(e)}"
        )

