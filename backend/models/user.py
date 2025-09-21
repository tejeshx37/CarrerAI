from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"
    PREFER_NOT_TO_SAY = "prefer_not_to_say"

class EducationLevel(str, Enum):
    TENTH = "10th"
    TWELFTH = "12th"
    DIPLOMA = "diploma"
    BACHELOR = "bachelor"
    MASTER = "master"
    PHD = "phd"
    OTHER = "other"

class JobType(str, Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    INTERNSHIP = "internship"
    FREELANCE = "freelance"
    CONTRACT = "contract"

class PsychometricProfile(BaseModel):
    personality_type: Optional[str] = None
    cognitive_abilities: Optional[Dict[str, float]] = None
    interests: List[str] = []
    strengths: List[str] = []
    areas_for_improvement: List[str] = []
    assessment_date: Optional[datetime] = None

class UserPreferences(BaseModel):
    notifications: Dict[str, bool] = {"email": True, "sms": False, "push": True}
    privacy: Dict[str, Any] = {"profile_visibility": "public", "show_contact_info": False}

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    phone: Optional[str] = Field(None, regex=r'^[6-9]\d{9}$')
    date_of_birth: Optional[datetime] = None
    gender: Gender = Gender.PREFER_NOT_TO_SAY
    state: Optional[str] = Field(None, min_length=2, max_length=50)
    city: Optional[str] = Field(None, min_length=2, max_length=50)
    pincode: Optional[str] = Field(None, regex=r'^[1-9][0-9]{5}$')
    current_education_level: EducationLevel = EducationLevel.TWELFTH
    career_interests: List[str] = []
    preferred_job_types: List[JobType] = [JobType.FULL_TIME]
    preferred_locations: List[str] = []
    technical_skills: List[str] = []
    soft_skills: List[str] = []

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, regex=r'^[6-9]\d{9}$')
    date_of_birth: Optional[datetime] = None
    gender: Optional[Gender] = None
    state: Optional[str] = Field(None, min_length=2, max_length=50)
    city: Optional[str] = Field(None, min_length=2, max_length=50)
    pincode: Optional[str] = Field(None, regex=r'^[1-9][0-9]{5}$')
    current_education_level: Optional[EducationLevel] = None
    career_interests: Optional[List[str]] = None
    preferred_job_types: Optional[List[JobType]] = None
    preferred_locations: Optional[List[str]] = None
    technical_skills: Optional[List[str]] = None
    soft_skills: Optional[List[str]] = None

class UserResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: str
    state: Optional[str] = None
    city: Optional[str] = None
    pincode: Optional[str] = None
    current_education_level: str
    career_interests: List[str] = []
    preferred_job_types: List[str] = []
    preferred_locations: List[str] = []
    technical_skills: List[str] = []
    soft_skills: List[str] = []
    psychometric_profile: Optional[PsychometricProfile] = None
    is_active: bool = True
    email_verified: bool = False
    profile_completion_percentage: int = 0
    created_at: datetime
    updated_at: datetime
    last_login_at: Optional[datetime] = None
    preferences: UserPreferences = UserPreferences()

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None