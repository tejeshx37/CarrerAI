from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import os
import json
import random
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini AI
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        genai.configure(api_key=api_key)
        gemini_model = genai.GenerativeModel('gemini-pro')
        GEMINI_AVAILABLE = True
    else:
        GEMINI_AVAILABLE = False
        print("Warning: GEMINI_API_KEY not found. AI features will use mock data.")
except Exception as e:
    GEMINI_AVAILABLE = False
    print(f"Warning: Gemini AI not available: {e}")

# Mock data storage
users = {}
user_counter = 1
assessments = {}
personality_tests = {}
market_data = {}

# Personality test questions
PERSONALITY_QUESTIONS = [
    {
        "id": 1,
        "question": "In a group project, you prefer to:",
        "type": "single",
        "category": "leadership",
        "options": [
            {"text": "Take charge and lead the team", "score": {"leadership": 3, "extroversion": 2}},
            {"text": "Collaborate equally with everyone", "score": {"teamwork": 3, "communication": 2}},
            {"text": "Focus on your specific tasks", "score": {"focus": 3, "independence": 2}},
            {"text": "Support others and help where needed", "score": {"support": 3, "empathy": 2}}
        ]
    },
    {
        "id": 2,
        "question": "When facing a difficult problem, you:",
        "type": "single",
        "category": "problem_solving",
        "options": [
            {"text": "Analyze it step by step", "score": {"analytical": 3, "methodical": 2}},
            {"text": "Brainstorm creative solutions", "score": {"creativity": 3, "innovation": 2}},
            {"text": "Ask for help from others", "score": {"collaboration": 3, "communication": 2}},
            {"text": "Research similar problems", "score": {"research": 3, "learning": 2}}
        ]
    },
    {
        "id": 3,
        "question": "Your ideal work environment is:",
        "type": "single",
        "category": "work_style",
        "options": [
            {"text": "Quiet and focused", "score": {"introversion": 3, "focus": 2}},
            {"text": "Dynamic and interactive", "score": {"extroversion": 3, "energy": 2}},
            {"text": "Structured and organized", "score": {"organization": 3, "planning": 2}},
            {"text": "Flexible and adaptable", "score": {"adaptability": 3, "flexibility": 2}}
        ]
    },
    {
        "id": 4,
        "question": "When learning something new, you prefer to:",
        "type": "single",
        "category": "learning_style",
        "options": [
            {"text": "Read and study independently", "score": {"independence": 3, "reading": 2}},
            {"text": "Watch videos and demonstrations", "score": {"visual": 3, "observation": 2}},
            {"text": "Practice hands-on immediately", "score": {"kinesthetic": 3, "practical": 2}},
            {"text": "Discuss with others", "score": {"social": 3, "communication": 2}}
        ]
    },
    {
        "id": 5,
        "question": "In stressful situations, you:",
        "type": "single",
        "category": "stress_management",
        "options": [
            {"text": "Stay calm and think logically", "score": {"calmness": 3, "logic": 2}},
            {"text": "Take action quickly", "score": {"action": 3, "decisiveness": 2}},
            {"text": "Seek support from others", "score": {"support_seeking": 3, "social": 2}},
            {"text": "Take breaks to recharge", "score": {"self_care": 3, "balance": 2}}
        ]
    },
    {
        "id": 6,
        "question": "Your communication style is:",
        "type": "single",
        "category": "communication",
        "options": [
            {"text": "Direct and to the point", "score": {"directness": 3, "efficiency": 2}},
            {"text": "Detailed and comprehensive", "score": {"thoroughness": 3, "detail": 2}},
            {"text": "Encouraging and supportive", "score": {"encouragement": 3, "empathy": 2}},
            {"text": "Collaborative and inclusive", "score": {"collaboration": 3, "inclusivity": 2}}
        ]
    },
    {
        "id": 7,
        "question": "When making decisions, you rely most on:",
        "type": "single",
        "category": "decision_making",
        "options": [
            {"text": "Data and facts", "score": {"analytical": 3, "evidence": 2}},
            {"text": "Intuition and gut feeling", "score": {"intuition": 3, "instinct": 2}},
            {"text": "Others' opinions and advice", "score": {"collaboration": 3, "social": 2}},
            {"text": "Past experiences", "score": {"experience": 3, "wisdom": 2}}
        ]
    },
    {
        "id": 8,
        "question": "Your motivation comes from:",
        "type": "single",
        "category": "motivation",
        "options": [
            {"text": "Achieving personal goals", "score": {"achievement": 3, "personal": 2}},
            {"text": "Helping others succeed", "score": {"altruism": 3, "service": 2}},
            {"text": "Learning and growing", "score": {"growth": 3, "learning": 2}},
            {"text": "Recognition and rewards", "score": {"recognition": 3, "external": 2}}
        ]
    }
]

# Market trends data
MARKET_TRENDS = {
    "technology": {
        "growth_rate": 15.2,
        "demand_skills": ["AI/ML", "Cloud Computing", "Cybersecurity", "Data Science"],
        "salary_trends": {"entry": 600000, "mid": 1200000, "senior": 2000000},
        "job_openings": 45000,
        "remote_percentage": 65
    },
    "healthcare": {
        "growth_rate": 12.8,
        "demand_skills": ["Digital Health", "Telemedicine", "Data Analytics", "Patient Care"],
        "salary_trends": {"entry": 500000, "mid": 1000000, "senior": 1800000},
        "job_openings": 32000,
        "remote_percentage": 25
    },
    "finance": {
        "growth_rate": 8.5,
        "demand_skills": ["Fintech", "Blockchain", "Risk Management", "Data Analysis"],
        "salary_trends": {"entry": 700000, "mid": 1400000, "senior": 2500000},
        "job_openings": 28000,
        "remote_percentage": 40
    },
    "education": {
        "growth_rate": 6.3,
        "demand_skills": ["EdTech", "Online Learning", "Curriculum Design", "Student Assessment"],
        "salary_trends": {"entry": 400000, "mid": 800000, "senior": 1500000},
        "job_openings": 18000,
        "remote_percentage": 70
    }
}

def generate_ai_insights(prompt, fallback_data):
    """Generate AI insights using Gemini or return fallback data"""
    if not GEMINI_AVAILABLE:
        return fallback_data
    
    try:
        response = gemini_model.generate_content(prompt)
        return json.loads(response.text)
    except Exception as e:
        print(f"AI generation failed: {e}")
        return fallback_data

def calculate_personality_scores(answers):
    """Calculate personality scores from test answers"""
    scores = {
        "leadership": 0, "extroversion": 0, "teamwork": 0, "communication": 0,
        "focus": 0, "independence": 0, "support": 0, "empathy": 0,
        "analytical": 0, "methodical": 0, "creativity": 0, "innovation": 0,
        "collaboration": 0, "research": 0, "learning": 0, "introversion": 0,
        "energy": 0, "organization": 0, "planning": 0, "adaptability": 0,
        "flexibility": 0, "reading": 0, "visual": 0, "observation": 0,
        "kinesthetic": 0, "practical": 0, "social": 0, "calmness": 0,
        "logic": 0, "action": 0, "decisiveness": 0, "support_seeking": 0,
        "self_care": 0, "balance": 0, "directness": 0, "efficiency": 0,
        "thoroughness": 0, "detail": 0, "encouragement": 0, "inclusivity": 0,
        "intuition": 0, "instinct": 0, "experience": 0, "wisdom": 0,
        "achievement": 0, "personal": 0, "altruism": 0, "service": 0,
        "growth": 0, "recognition": 0, "external": 0
    }
    
    for question_id, answer in answers.items():
        question = next((q for q in PERSONALITY_QUESTIONS if q["id"] == int(question_id)), None)
        if question and answer in question["options"]:
            option = question["options"][answer]
            for trait, value in option["score"].items():
                scores[trait] += value
    
    return scores

def generate_personality_profile(scores):
    """Generate personality profile from scores"""
    top_traits = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:5]
    
    personality_types = {
        "The Leader": ["leadership", "decisiveness", "action", "achievement"],
        "The Collaborator": ["teamwork", "communication", "collaboration", "empathy"],
        "The Analyst": ["analytical", "methodical", "research", "logic"],
        "The Creator": ["creativity", "innovation", "visual", "intuition"],
        "The Supporter": ["support", "empathy", "encouragement", "altruism"]
    }
    
    best_match = "The Collaborator"
    best_score = 0
    
    for personality_type, traits in personality_types.items():
        score = sum(scores.get(trait, 0) for trait in traits)
        if score > best_score:
            best_score = score
            best_match = personality_type
    
    return {
        "personality_type": best_match,
        "top_traits": [{"trait": trait, "score": score} for trait, score in top_traits],
        "strengths": [trait for trait, score in top_traits if score > 5],
        "development_areas": [trait for trait, score in scores.items() if score < 3]
    }

@app.route('/')
def root():
    return {
        "message": "CareerBridgeAI Enhanced API",
        "version": "2.0.0",
        "status": "running",
        "features": ["Personality Assessment", "Market Trends", "Career Roadmap", "AI Recommendations"]
    }

@app.route('/health')
def health_check():
    return {
        "success": True,
        "message": "CareerBridgeAI Enhanced Backend is running",
        "status": "healthy",
        "ai_available": GEMINI_AVAILABLE
    }

# Enhanced Authentication
@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user with enhanced profile"""
    try:
        data = request.get_json()
        
        if not data or not data.get('name') or not data.get('email') or not data.get('password'):
            return jsonify({
                "success": False,
                "message": "Name, email, and password are required"
            }), 400
        
        # Check if user already exists
        for user in users.values():
            if user['email'] == data['email']:
                return jsonify({
                    "success": False,
                    "message": "User with this email already exists"
                }), 409
        
        # Create new user with enhanced profile
        global user_counter
        user_id = f"user_{user_counter}"
        user_counter += 1
        
        new_user = {
            "id": user_id,
            "name": data['name'],
            "email": data['email'],
            "created_at": datetime.now().isoformat(),
            "is_active": True,
            "profile": {
                "completion_percentage": 10,
                "assessments_completed": [],
                "personality_profile": None,
                "career_goals": [],
                "skills": [],
                "experience_level": "Entry Level",
                "preferred_industries": [],
                "learning_preferences": {}
            }
        }
        
        users[user_id] = new_user
        
        # Mock token
        token = f"mock_token_{user_id}"
        
        return jsonify({
            "success": True,
            "message": "User registered successfully",
            "data": {
                "user": new_user,
                "token": token
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Registration failed: {str(e)}"
        }), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({
                "success": False,
                "message": "Email and password are required"
            }), 400
        
        # Find user by email
        user = None
        for u in users.values():
            if u['email'] == data['email']:
                user = u
                break
        
        if not user:
            return jsonify({
                "success": False,
                "message": "Invalid email or password"
            }), 401
        
        # Mock password verification
        if data['password'] != "password":
            return jsonify({
                "success": False,
                "message": "Invalid email or password"
            }), 401
        
        # Mock token
        token = f"mock_token_{user['id']}"
        
        return jsonify({
            "success": True,
            "message": "Login successful",
            "data": {
                "user": user,
                "token": token
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Login failed: {str(e)}"
        }), 500

# Personality Assessment Endpoints
@app.route('/api/personality/questions', methods=['GET'])
def get_personality_questions():
    """Get personality assessment questions"""
    try:
        return jsonify({
            "success": True,
            "data": {
                "questions": PERSONALITY_QUESTIONS,
                "total_questions": len(PERSONALITY_QUESTIONS),
                "estimated_time": "10-15 minutes"
            }
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to get personality questions: {str(e)}"
        }), 500

@app.route('/api/personality/submit', methods=['POST'])
def submit_personality_test():
    """Submit personality test answers and get analysis"""
    try:
        data = request.get_json()
        answers = data.get('answers', {})
        user_id = data.get('user_id', 'anonymous')
        
        # Calculate personality scores
        scores = calculate_personality_scores(answers)
        profile = generate_personality_profile(scores)
        
        # Generate AI-powered insights
        prompt = f"""
        Based on this personality assessment data, provide detailed career insights:
        Personality Type: {profile['personality_type']}
        Top Traits: {[t['trait'] for t in profile['top_traits']]}
        Strengths: {profile['strengths']}
        Development Areas: {profile['development_areas']}
        
        Provide a JSON response with:
        1. Career recommendations based on personality
        2. Ideal work environments
        3. Leadership style analysis
        4. Communication preferences
        5. Learning style recommendations
        """
        
        ai_insights = generate_ai_insights(prompt, {
            "career_recommendations": ["Project Manager", "Team Lead", "Consultant"],
            "ideal_environments": ["Collaborative", "Dynamic", "Supportive"],
            "leadership_style": "Collaborative and supportive",
            "communication_preferences": "Direct and encouraging",
            "learning_recommendations": ["Hands-on projects", "Group learning", "Mentorship"]
        })
        
        # Store personality test results
        test_id = f"personality_{user_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        personality_tests[test_id] = {
            "user_id": user_id,
            "answers": answers,
            "scores": scores,
            "profile": profile,
            "ai_insights": ai_insights,
            "completed_at": datetime.now().isoformat()
        }
        
        # Update user profile
        if user_id in users:
            users[user_id]["profile"]["personality_profile"] = profile
            users[user_id]["profile"]["assessments_completed"].append("personality")
            users[user_id]["profile"]["completion_percentage"] = min(100, users[user_id]["profile"]["completion_percentage"] + 20)
        
        return jsonify({
            "success": True,
            "message": "Personality assessment completed successfully",
            "data": {
                "test_id": test_id,
                "profile": profile,
                "ai_insights": ai_insights,
                "recommendations": ai_insights.get("career_recommendations", [])
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to process personality test: {str(e)}"
        }), 500

# Market Trends Endpoints
@app.route('/api/market/trends', methods=['GET'])
def get_market_trends():
    """Get real-time job market insights"""
    try:
        industry = request.args.get('industry', 'all')
        
        if industry == 'all':
            trends_data = MARKET_TRENDS
        else:
            trends_data = {industry: MARKET_TRENDS.get(industry, {})}
        
        # Generate AI-powered market analysis
        prompt = f"""
        Analyze these job market trends and provide insights:
        {json.dumps(trends_data, indent=2)}
        
        Provide a JSON response with:
        1. Market analysis summary
        2. Emerging opportunities
        3. Skill demand predictions
        4. Salary trend analysis
        5. Career growth recommendations
        """
        
        ai_analysis = generate_ai_insights(prompt, {
            "market_summary": "Strong growth across all sectors with technology leading",
            "emerging_opportunities": ["AI/ML Engineering", "Cybersecurity", "Digital Health"],
            "skill_predictions": ["Cloud Computing", "Data Science", "Remote Work Skills"],
            "salary_analysis": "Competitive salaries with remote work flexibility",
            "growth_recommendations": ["Upskill in emerging technologies", "Develop soft skills", "Build remote work capabilities"]
        })
        
        return jsonify({
            "success": True,
            "data": {
                "trends": trends_data,
                "ai_analysis": ai_analysis,
                "last_updated": datetime.now().isoformat(),
                "data_source": "CareerBridgeAI Market Intelligence"
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to get market trends: {str(e)}"
        }), 500

# Career Roadmap Endpoints
@app.route('/api/roadmap/generate', methods=['POST'])
def generate_career_roadmap():
    """Generate personalized career roadmap"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        career_goals = data.get('career_goals', [])
        current_skills = data.get('current_skills', [])
        experience_level = data.get('experience_level', 'Entry Level')
        
        # Get user's personality profile if available
        personality_profile = None
        if user_id and user_id in users:
            personality_profile = users[user_id]["profile"].get("personality_profile")
        
        # Generate AI-powered career roadmap
        prompt = f"""
        Create a comprehensive career roadmap based on:
        Career Goals: {career_goals}
        Current Skills: {current_skills}
        Experience Level: {experience_level}
        Personality Profile: {personality_profile}
        
        Provide a JSON response with:
        1. 6-month roadmap
        2. 1-year roadmap
        3. 3-year roadmap
        4. Skill development plan
        5. Learning resources
        6. Milestone tracking
        7. Career progression steps
        """
        
        roadmap = generate_ai_insights(prompt, {
            "short_term": {
                "duration": "6 months",
                "goals": ["Complete foundational courses", "Build portfolio projects", "Network in industry"],
                "skills": ["Technical fundamentals", "Communication", "Project management"],
                "milestones": ["Complete 2 online courses", "Build 3 portfolio projects", "Attend 5 networking events"]
            },
            "medium_term": {
                "duration": "1 year",
                "goals": ["Gain practical experience", "Specialize in chosen field", "Build professional network"],
                "skills": ["Advanced technical skills", "Leadership", "Industry knowledge"],
                "milestones": ["Complete certification", "Lead a project", "Get mentorship"]
            },
            "long_term": {
                "duration": "3 years",
                "goals": ["Become industry expert", "Take leadership role", "Mentor others"],
                "skills": ["Expertise in domain", "Strategic thinking", "Team leadership"],
                "milestones": ["Senior position", "Industry recognition", "Mentor junior professionals"]
            },
            "learning_resources": [
                {"name": "Online Courses", "platform": "Coursera", "focus": "Technical Skills"},
                {"name": "Industry Certifications", "platform": "Various", "focus": "Credibility"},
                {"name": "Networking Events", "platform": "Meetup", "focus": "Professional Network"}
            ]
        })
        
        return jsonify({
            "success": True,
            "data": {
                "roadmap": roadmap,
                "generated_at": datetime.now().isoformat(),
                "user_id": user_id
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to generate career roadmap: {str(e)}"
        }), 500

# Enhanced Assessment Endpoints
@app.route('/api/assessments/questions', methods=['GET'])
def get_career_questions():
    """Get comprehensive career assessment questions"""
    try:
        questions = [
            {
                "id": 1,
                "question": "What is your current education level?",
                "type": "single",
                "category": "education",
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
                "category": "interests",
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
                "category": "experience",
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
                "category": "work_environment",
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
                "category": "skills",
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
            },
            {
                "id": 6,
                "question": "What are your primary career goals?",
                "type": "multiple",
                "category": "goals",
                "options": [
                    "Career advancement",
                    "Skill development",
                    "Work-life balance",
                    "Financial growth",
                    "Job security",
                    "Creative fulfillment",
                    "Leadership opportunities",
                    "Industry expertise"
                ]
            },
            {
                "id": 7,
                "question": "How do you prefer to learn new skills?",
                "type": "single",
                "category": "learning_style",
                "options": [
                    "Online courses and tutorials",
                    "Hands-on projects",
                    "Mentorship and coaching",
                    "Formal education",
                    "Self-study and research",
                    "Group learning and workshops"
                ]
            },
            {
                "id": 8,
                "question": "What motivates you most in your career?",
                "type": "single",
                "category": "motivation",
                "options": [
                    "Financial rewards",
                    "Personal growth",
                    "Making an impact",
                    "Recognition and status",
                    "Work-life balance",
                    "Creative expression",
                    "Helping others",
                    "Continuous learning"
                ]
            }
        ]
        
        return jsonify({
            "success": True,
            "data": {
                "questions": questions,
                "total_questions": len(questions),
                "estimated_time": "15-20 minutes"
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to get questions: {str(e)}"
        }), 500

@app.route('/api/assessments/submit-answers', methods=['POST'])
def submit_career_answers():
    """Submit career assessment answers with AI-powered analysis"""
    try:
        data = request.get_json()
        answers = data.get('answers', {})
        user_id = data.get('user_id', 'anonymous')
        
        # Generate comprehensive AI recommendations
        prompt = f"""
        Based on this career assessment data, provide comprehensive career guidance:
        Answers: {json.dumps(answers, indent=2)}
        
        Provide a JSON response with:
        1. Career path recommendations
        2. Skill gap analysis
        3. Course recommendations (5-8 courses)
        4. Learning path strategy
        5. Industry insights
        6. Salary expectations
        7. Next steps
        8. Market opportunities
        """
        
        recommendations = generate_ai_insights(prompt, {
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
                    "reason": "Foundation for career growth",
                    "price": "Free",
                    "rating": 4.8
                },
                {
                    "title": "Industry-Specific Skills",
                    "description": "Skills relevant to your career interests",
                    "category": "Technical",
                    "difficulty": "Intermediate",
                    "duration": "8 weeks",
                    "platform": "Specialized Learning Platform",
                    "priority": "High",
                    "reason": "Directly applicable to career interests",
                    "price": "$299",
                    "rating": 4.6
                },
                {
                    "title": "Leadership and Management",
                    "description": "Develop leadership skills for career advancement",
                    "category": "Soft Skills",
                    "difficulty": "Intermediate",
                    "duration": "4 weeks",
                    "platform": "Leadership Academy",
                    "priority": "Medium",
                    "reason": "Important for career progression",
                    "price": "$199",
                    "rating": 4.7
                }
            ],
            "learning_path": "Begin with foundational courses, then progress to specialized skills",
            "next_steps": ["Review your career goals", "Start with high-priority courses", "Track your progress"],
            "industry_insights": {
                "growth_rate": 12.5,
                "demand_skills": ["AI/ML", "Cloud Computing", "Data Science"],
                "salary_range": "₹6,00,000 - ₹15,00,000"
            },
            "market_opportunities": [
                "Remote work positions",
                "Startup opportunities",
                "Freelance consulting",
                "Industry certifications"
            ]
        })
        
        # Store assessment results
        assessment_id = f"assessment_{user_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        assessments[assessment_id] = {
            "user_id": user_id,
            "answers": answers,
            "recommendations": recommendations,
            "completed_at": datetime.now().isoformat()
        }
        
        # Update user profile
        if user_id in users:
            users[user_id]["profile"]["assessments_completed"].append("career")
            users[user_id]["profile"]["completion_percentage"] = min(100, users[user_id]["profile"]["completion_percentage"] + 30)
        
        return jsonify({
            "success": True,
            "message": "Assessment submitted and recommendations generated successfully",
            "data": {
                "assessment_id": assessment_id,
                "recommendations": recommendations
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to submit answers: {str(e)}"
        }), 500

@app.route('/api/assessments/recommendations', methods=['GET'])
def get_user_recommendations():
    """Get user's course recommendations"""
    try:
        user_id = request.args.get('user_id', 'anonymous')
        
        # Get latest assessment for user
        user_assessments = [a for a in assessments.values() if a.get('user_id') == user_id]
        if not user_assessments:
            return jsonify({
                "success": False,
                "message": "No assessments found. Please complete an assessment first.",
                "data": None
            })
        
        latest_assessment = max(user_assessments, key=lambda x: x['completed_at'])
        
        return jsonify({
            "success": True,
            "data": {
                "recommendation": {
                    "recommendations": latest_assessment['recommendations'],
                    "generated_at": latest_assessment['completed_at'],
                    "ai_model": "gemini-pro" if GEMINI_AVAILABLE else "mock-model"
                }
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to get recommendations: {str(e)}"
        }), 500

# User Profile Endpoints
@app.route('/api/profile/<user_id>', methods=['GET'])
def get_user_profile(user_id):
    """Get comprehensive user profile"""
    try:
        if user_id not in users:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404
        
        user = users[user_id]
        
        # Get user's assessments
        user_assessments = [a for a in assessments.values() if a.get('user_id') == user_id]
        user_personality_tests = [p for p in personality_tests.values() if p.get('user_id') == user_id]
        
        return jsonify({
            "success": True,
            "data": {
                "user": user,
                "assessments": user_assessments,
                "personality_tests": user_personality_tests,
                "profile_completion": user["profile"]["completion_percentage"]
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to get user profile: {str(e)}"
        }), 500

@app.route('/api/profile/<user_id>/update', methods=['PUT'])
def update_user_profile(user_id):
    """Update user profile"""
    try:
        if user_id not in users:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404
        
        data = request.get_json()
        
        # Update profile fields
        if 'career_goals' in data:
            users[user_id]["profile"]["career_goals"] = data['career_goals']
        if 'skills' in data:
            users[user_id]["profile"]["skills"] = data['skills']
        if 'preferred_industries' in data:
            users[user_id]["profile"]["preferred_industries"] = data['preferred_industries']
        if 'experience_level' in data:
            users[user_id]["profile"]["experience_level"] = data['experience_level']
        
        # Recalculate completion percentage
        profile = users[user_id]["profile"]
        completion = 10  # Base completion
        if profile["personality_profile"]:
            completion += 20
        if profile["assessments_completed"]:
            completion += len(profile["assessments_completed"]) * 15
        if profile["career_goals"]:
            completion += 10
        if profile["skills"]:
            completion += 10
        
        users[user_id]["profile"]["completion_percentage"] = min(100, completion)
        
        return jsonify({
            "success": True,
            "message": "Profile updated successfully",
            "data": {
                "user": users[user_id],
                "completion_percentage": users[user_id]["profile"]["completion_percentage"]
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to update profile: {str(e)}"
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
