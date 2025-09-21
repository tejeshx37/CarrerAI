from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import uvicorn
import os
from dotenv import load_dotenv

from routers import auth, assessments, career
from config.database import initialize_firebase
from config.bigquery import initialize_bigquery

# Load environment variables
load_dotenv()

# Security scheme
security = HTTPBearer()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting CareerBridgeAI FastAPI Backend...")
    initialize_firebase()
    initialize_bigquery()
    print("✅ Backend initialized successfully!")
    yield
    # Shutdown
    print("🛑 Shutting down CareerBridgeAI Backend...")

# Create FastAPI app
app = FastAPI(
    title="CareerBridgeAI API",
    description="AI-powered career guidance platform for Indian students",
    version="1.0.0",
    lifespan=lifespan
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

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(assessments.router, prefix="/api/assessments", tags=["Assessments"])
app.include_router(career.router, prefix="/api/career", tags=["Career Guidance"])

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

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

