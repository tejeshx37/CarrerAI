from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from datetime import datetime, timedelta
from typing import Dict, Any

from models.user import UserCreate, UserLogin, UserResponse, Token, PasswordChange
from auth.jwt_handler import verify_password, get_password_hash, create_access_token
from auth.dependencies import get_current_active_user
from config.database import get_db, COLLECTIONS
from google.cloud.firestore import Client

router = APIRouter()
security = HTTPBearer()

@router.post("/register", response_model=Dict[str, Any])
async def register(user_data: UserCreate, db: Client = Depends(get_db)):
    """Register a new user"""
    try:
        # Check if user already exists
        users_ref = db.collection(COLLECTIONS["USERS"])
        existing_user = users_ref.where("email", "==", user_data.email).limit(1).get()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this email already exists"
            )
        
        # Split name into first and last name
        name_parts = user_data.name.strip().split(" ", 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ""
        
        # Hash password
        hashed_password = get_password_hash(user_data.password)
        
        # Create user document
        user_doc = {
            "first_name": first_name,
            "last_name": last_name,
            "email": user_data.email,
            "password": hashed_password,
            "phone": user_data.phone or "",
            "date_of_birth": user_data.date_of_birth or datetime(2000, 1, 1),
            "gender": user_data.gender.value,
            "state": user_data.state or "",
            "city": user_data.city or "",
            "pincode": user_data.pincode or "",
            "current_education_level": user_data.current_education_level.value,
            "career_interests": user_data.career_interests,
            "preferred_job_types": [job_type.value for job_type in user_data.preferred_job_types],
            "preferred_locations": user_data.preferred_locations,
            "technical_skills": user_data.technical_skills,
            "soft_skills": user_data.soft_skills,
            "is_active": True,
            "email_verified": False,
            "profile_completion_percentage": 20,  # Basic info completed
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "last_login_at": None,
            "preferences": {
                "notifications": {"email": True, "sms": False, "push": True},
                "privacy": {"profile_visibility": "public", "show_contact_info": False}
            }
        }
        
        # Save to Firestore
        doc_ref = users_ref.add(user_doc)[1]
        user_id = doc_ref.id
        
        # Create access token
        access_token = create_access_token(
            data={"user_id": user_id, "email": user_data.email}
        )
        
        # Remove password from response
        user_doc.pop("password", None)
        user_doc["id"] = user_id
        
        return {
            "success": True,
            "message": "User registered successfully",
            "data": {
                "user": user_doc,
                "token": access_token
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=Dict[str, Any])
async def login(credentials: UserLogin, db: Client = Depends(get_db)):
    """Login user"""
    try:
        # Find user by email
        users_ref = db.collection(COLLECTIONS["USERS"])
        user_query = users_ref.where("email", "==", credentials.email).limit(1).get()
        
        if not user_query:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        user_doc = user_query[0]
        user_data = user_doc.to_dict()
        
        # Check if user is active
        if not user_data.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is deactivated"
            )
        
        # Verify password
        if not verify_password(credentials.password, user_data["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Update last login
        user_doc.reference.update({
            "last_login_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        })
        
        # Create access token
        access_token = create_access_token(
            data={"user_id": user_doc.id, "email": credentials.email}
        )
        
        # Remove password from response
        user_data.pop("password", None)
        user_data["id"] = user_doc.id
        
        return {
            "success": True,
            "message": "Login successful",
            "data": {
                "user": user_data,
                "token": access_token
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.get("/profile", response_model=Dict[str, Any])
async def get_profile(current_user: dict = Depends(get_current_active_user)):
    """Get current user profile"""
    return {
        "success": True,
        "data": {"user": current_user}
    }

@router.put("/profile", response_model=Dict[str, Any])
async def update_profile(
    user_update: dict,
    current_user: dict = Depends(get_current_active_user),
    db: Client = Depends(get_db)
):
    """Update user profile"""
    try:
        # Remove fields that shouldn't be updated
        update_data = {k: v for k, v in user_update.items() 
                      if k not in ["id", "email", "password", "created_at"]}
        
        if update_data:
            update_data["updated_at"] = datetime.utcnow()
            
            # Update in Firestore
            user_ref = db.collection(COLLECTIONS["USERS"]).document(current_user["id"])
            user_ref.update(update_data)
            
            # Update current_user dict
            current_user.update(update_data)
        
        return {
            "success": True,
            "message": "Profile updated successfully",
            "data": {"user": current_user}
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Profile update failed: {str(e)}"
        )

@router.put("/change-password", response_model=Dict[str, Any])
async def change_password(
    password_data: PasswordChange,
    current_user: dict = Depends(get_current_active_user),
    db: Client = Depends(get_db)
):
    """Change user password"""
    try:
        # Verify current password
        if not verify_password(password_data.current_password, current_user["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Current password is incorrect"
            )
        
        # Hash new password
        new_hashed_password = get_password_hash(password_data.new_password)
        
        # Update password in database
        user_ref = db.collection(COLLECTIONS["USERS"]).document(current_user["id"])
        user_ref.update({
            "password": new_hashed_password,
            "updated_at": datetime.utcnow()
        })
        
        return {
            "success": True,
            "message": "Password changed successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Password change failed: {str(e)}"
        )

@router.post("/logout", response_model=Dict[str, Any])
async def logout():
    """Logout user (client-side token invalidation)"""
    return {
        "success": True,
        "message": "Logged out successfully"
    }

