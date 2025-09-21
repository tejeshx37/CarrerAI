# 📚 API Documentation

## Overview

CareerBridgeAI provides a RESTful API for career guidance, assessments, and recommendations. All endpoints return JSON responses.

## Base URL
```
http://localhost:8000/api
```

## Authentication

Most endpoints require authentication via JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 🔐 Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt-token-here"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt-token-here"
  }
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 📝 Assessments

#### Get Assessment Questions
```http
GET /api/assessments/questions
```

**Response:**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "1",
        "question": "What is your current education level?",
        "type": "single_choice",
        "options": [
          "High School",
          "Bachelor's Degree",
          "Master's Degree",
          "PhD"
        ]
      }
    ]
  }
}
```

#### Submit Assessment Answers
```http
POST /api/assessments/submit-answers
Content-Type: application/json

{
  "answers": {
    "1": "Bachelor's Degree",
    "2": ["Technology", "Healthcare"],
    "3": "2-5 years",
    "4": "Remote work",
    "5": ["Python", "JavaScript", "React"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Assessment submitted and recommendations generated successfully",
  "data": {
    "response_id": "response_123",
    "recommendations_id": "rec_123",
    "recommendations": {
      "career_path": "Software Development Career Path",
      "career_stage": "Early Career",
      "match_score": 85,
      "skill_gaps": ["Machine Learning", "Cloud Computing"],
      "courses": [
        {
          "title": "Advanced Python Programming",
          "provider": "Coursera",
          "duration": "8 weeks",
          "rating": 4.8
        }
      ],
      "learning_path": [
        "Complete Python fundamentals",
        "Learn web development",
        "Practice with projects"
      ],
      "next_steps": [
        "Build a portfolio project",
        "Apply for internships",
        "Network with professionals"
      ],
      "personality_insights": {
        "work_style": "Analytical and detail-oriented",
        "strengths": ["Problem-solving", "Technical skills"],
        "preferences": "Remote work environment"
      },
      "market_opportunities": [
        {
          "role": "Software Developer",
          "demand": "High",
          "salary_range": "$60,000 - $100,000",
          "growth_rate": "22%"
        }
      ],
      "timeline": {
        "short_term": "3-6 months: Learn fundamentals",
        "medium_term": "6-12 months: Build projects",
        "long_term": "1-2 years: Land first job"
      }
    }
  }
}
```

#### Get Recommendations
```http
GET /api/assessments/recommendations
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": {
      "career_path": "Data Science Career Path",
      "match_score": 92,
      "courses": [...],
      "learning_path": [...],
      "next_steps": [...]
    }
  }
}
```

### 🎯 Career Guidance

#### Get Market Trends
```http
GET /api/career/trends?industry=technology&location=india
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trends": [
      {
        "skill": "Python",
        "demand": "Very High",
        "growth": "+25%",
        "salary_range": "$50,000 - $120,000"
      }
    ]
  }
}
```

#### Get Career Opportunities
```http
GET /api/career/opportunities?role=software_developer&experience=entry_level
```

**Response:**
```json
{
  "success": true,
  "data": {
    "opportunities": [
      {
        "title": "Junior Software Developer",
        "company": "Tech Corp",
        "location": "Remote",
        "salary": "$60,000 - $80,000",
        "requirements": ["Python", "React", "Git"]
      }
    ]
  }
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE"
}
```

### Common Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API requests are rate-limited to prevent abuse:
- **Authentication endpoints**: 5 requests per minute
- **Assessment endpoints**: 10 requests per minute
- **General endpoints**: 100 requests per minute

## SDKs and Libraries

### JavaScript/Node.js
```javascript
const CareerBridgeAPI = require('careerbridge-ai-sdk');

const client = new CareerBridgeAPI({
  baseURL: 'http://localhost:8000/api',
  token: 'your-jwt-token'
});

// Get recommendations
const recommendations = await client.getRecommendations();
```

### Python
```python
from careerbridge_ai import CareerBridgeClient

client = CareerBridgeClient(
    base_url='http://localhost:8000/api',
    token='your-jwt-token'
)

# Submit assessment
response = client.submit_assessment({
    '1': 'Bachelor\'s Degree',
    '2': ['Technology', 'Healthcare']
})
```

## Webhooks

CareerBridgeAI supports webhooks for real-time notifications:

### Available Events
- `assessment.completed` - Assessment submission completed
- `recommendations.generated` - New recommendations available
- `user.registered` - New user registration

### Webhook Payload
```json
{
  "event": "assessment.completed",
  "data": {
    "user_id": "user_123",
    "assessment_id": "assessment_456",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

