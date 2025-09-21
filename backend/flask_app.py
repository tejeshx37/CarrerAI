from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Mock data storage
users = {
    "user_1": {
        "id": "user_1",
        "name": "Test User",
        "email": "test@example.com",
        "created_at": "2024-01-01T00:00:00Z",
        "is_active": True
    }
}
user_counter = 2

@app.route('/')
def root():
    return {
        "message": "CareerBridgeAI API",
        "version": "1.0.0",
        "status": "running"
    }

@app.route('/health')
def health_check():
    return {
        "success": True,
        "message": "CareerBridgeAI Backend is running",
        "status": "healthy"
    }

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
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
        
        # Create new user
        global user_counter
        user_id = f"user_{user_counter}"
        user_counter += 1
        
        new_user = {
            "id": user_id,
            "name": data['name'],
            "email": data['email'],
            "created_at": datetime.now().isoformat(),
            "is_active": True
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
        
        # Mock password verification (in real app, verify hashed password)
        if data['password'] != "password":  # Simple mock
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

@app.route('/api/career/recommendations', methods=['GET'])
def get_career_recommendations():
    """Get career recommendations"""
    try:
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
        
        return jsonify({
            "success": True,
            "data": {
                "recommendations": recommendations,
                "user_profile": {
                    "career_stage": "Entry Level",
                    "experience_level": "Entry Level",
                    "profile_completion": 20
                },
                "market_insights": {
                    "total_opportunities": len(recommendations),
                    "average_salary": "₹9,00,000",
                    "top_skills": ["Python", "JavaScript", "React", "Machine Learning"]
                }
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to get career recommendations: {str(e)}"
        }), 500

@app.route('/api/assessments/questions', methods=['GET'])
def get_career_questions():
    """Get career assessment questions"""
    try:
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
        
        return jsonify({
            "success": True,
            "data": {"questions": questions}
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to get questions: {str(e)}"
        }), 500

@app.route('/api/assessments/submit-answers', methods=['POST'])
def submit_career_answers():
    """Submit career assessment answers"""
    try:
        data = request.get_json()
        answers = data.get('answers', {})
        
        # Analyze answers to generate personalized recommendations
        recommendations = generate_personalized_recommendations(answers)
        
        return jsonify({
            "success": True,
            "message": "Assessment submitted and recommendations generated successfully",
            "data": {
                "response_id": "response_" + str(int(datetime.now().timestamp())),
                "recommendations_id": "rec_" + str(int(datetime.now().timestamp())),
                "recommendations": recommendations
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to submit answers: {str(e)}"
        }), 500

def generate_personalized_recommendations(answers):
    """Generate personalized recommendations based on student answers"""
    
    # Analyze education level
    education_level = answers.get('1', '')
    experience_level = answers.get('3', '')
    career_interests = answers.get('2', [])
    work_environment = answers.get('4', '')
    skills = answers.get('5', [])
    
    # Determine career stage and appropriate recommendations
    career_stage = determine_career_stage(education_level, experience_level)
    primary_interests = analyze_career_interests(career_interests)
    skill_analysis = analyze_skills(skills)
    
    # Generate dynamic recommendations
    recommendations = {
        "career_path": f"Personalized {primary_interests['primary']} Career Path",
        "career_stage": career_stage,
        "match_score": calculate_match_score(answers),
        "skill_gaps": identify_skill_gaps(skill_analysis, primary_interests),
        "courses": generate_course_recommendations(primary_interests, skill_analysis, career_stage),
        "learning_path": generate_learning_path(career_stage, primary_interests),
        "next_steps": generate_next_steps(career_stage, primary_interests),
        "personality_insights": generate_personality_insights(answers),
        "market_opportunities": get_market_opportunities(primary_interests),
        "timeline": generate_career_timeline(career_stage, primary_interests)
    }
    
    return recommendations

def determine_career_stage(education, experience):
    """Determine career stage based on education and experience"""
    if experience in ['0-1 years (Entry level)']:
        return "Entry Level"
    elif experience in ['2-3 years (Junior)']:
        return "Junior Professional"
    elif experience in ['4-6 years (Mid-level)']:
        return "Mid-Level Professional"
    elif experience in ['7-10 years (Senior)']:
        return "Senior Professional"
    else:
        return "Expert Level"

def analyze_career_interests(interests):
    """Analyze career interests to determine primary focus"""
    tech_skills = ['Technology/Software Development', 'Engineering']
    business_skills = ['Business/Management', 'Finance/Banking', 'Marketing/Advertising']
    creative_skills = ['Arts/Design']
    service_skills = ['Healthcare', 'Education']
    
    tech_count = sum(1 for interest in interests if interest in tech_skills)
    business_count = sum(1 for interest in interests if interest in business_skills)
    creative_count = sum(1 for interest in interests if interest in creative_skills)
    service_count = sum(1 for interest in interests if interest in service_skills)
    
    if tech_count >= business_count and tech_count >= creative_count and tech_count >= service_count:
        return {"primary": "Technology", "secondary": "Innovation", "focus": "Technical Excellence"}
    elif business_count >= tech_count and business_count >= creative_count and business_count >= service_count:
        return {"primary": "Business", "secondary": "Leadership", "focus": "Strategic Thinking"}
    elif creative_count >= tech_count and creative_count >= business_count and creative_count >= service_count:
        return {"primary": "Creative", "secondary": "Design", "focus": "Innovation"}
    else:
        return {"primary": "Service", "secondary": "Impact", "focus": "Social Good"}

def analyze_skills(skills):
    """Analyze current skills to identify strengths and gaps"""
    technical_skills = ['Programming/Coding', 'Data Analysis']
    soft_skills = ['Communication', 'Leadership', 'Problem Solving', 'Creative Thinking']
    management_skills = ['Project Management', 'Technical Writing']
    
    return {
        "technical": [s for s in skills if s in technical_skills],
        "soft": [s for s in skills if s in soft_skills],
        "management": [s for s in skills if s in management_skills],
        "total_count": len(skills)
    }

def calculate_match_score(answers):
    """Calculate how well the assessment matches the student's profile"""
    base_score = 70
    education_bonus = 10 if answers.get('1') in ['Bachelor\'s Degree', 'Master\'s Degree', 'PhD/Doctorate'] else 5
    experience_bonus = 15 if answers.get('3') not in ['0-1 years (Entry level)'] else 5
    skills_bonus = min(15, len(answers.get('5', [])) * 3)
    
    return min(95, base_score + education_bonus + experience_bonus + skills_bonus)

def identify_skill_gaps(skill_analysis, interests):
    """Identify skill gaps based on current skills and career interests"""
    gaps = []
    
    if interests['primary'] == 'Technology' and not skill_analysis['technical']:
        gaps.extend(['Programming Fundamentals', 'Data Analysis', 'System Design'])
    
    if interests['primary'] == 'Business' and not skill_analysis['management']:
        gaps.extend(['Project Management', 'Strategic Planning', 'Financial Analysis'])
    
    if not skill_analysis['soft']:
        gaps.extend(['Communication', 'Leadership', 'Problem Solving'])
    
    return gaps[:5]  # Return top 5 gaps

def generate_course_recommendations(interests, skills, career_stage):
    """Generate personalized course recommendations"""
    courses = []
    
    # Technology-focused courses
    if interests['primary'] == 'Technology':
        courses.extend([
            {
                "title": "Full-Stack Development Bootcamp",
                "description": "Master modern web development with React, Node.js, and cloud technologies",
                "category": "Technical",
                "difficulty": "Intermediate" if career_stage != "Entry Level" else "Beginner",
                "duration": "12 weeks",
                "platform": "CareerBridgeAI Academy",
                    "priority": "High",
                "reason": "Essential for technology career path",
                "rating": 4.8,
                "students_enrolled": 15420,
                "price": "₹45,000",
                "skills_covered": ["JavaScript", "React", "Node.js", "Database Design", "Cloud Computing"]
            },
            {
                "title": "AI & Machine Learning Fundamentals",
                "description": "Learn the basics of artificial intelligence and machine learning applications",
                "category": "Emerging Tech",
                    "difficulty": "Intermediate",
                    "duration": "8 weeks",
                "platform": "TechFuture Learning",
                    "priority": "High",
                "reason": "High-demand skill in current market",
                "rating": 4.9,
                "students_enrolled": 8930,
                "price": "₹35,000",
                "skills_covered": ["Python", "TensorFlow", "Data Science", "Neural Networks"]
            }
        ])
    
    # Business-focused courses
    if interests['primary'] == 'Business':
        courses.extend([
            {
                "title": "Digital Marketing & Analytics",
                "description": "Master digital marketing strategies and data-driven decision making",
                "category": "Business",
                "difficulty": "Beginner",
                "duration": "6 weeks",
                "platform": "Business Academy",
                "priority": "High",
                "reason": "Critical for modern business success",
                "rating": 4.7,
                "students_enrolled": 12300,
                "price": "₹25,000",
                "skills_covered": ["SEO", "Social Media Marketing", "Google Analytics", "Content Strategy"]
            }
        ])
    
    # Soft skills courses (always recommended)
    courses.extend([
        {
            "title": "Leadership & Team Management",
            "description": "Develop essential leadership skills for career advancement",
                    "category": "Soft Skills",
                    "difficulty": "Intermediate",
                    "duration": "4 weeks",
            "platform": "Leadership Institute",
                    "priority": "Medium",
            "reason": "Essential for career progression",
            "rating": 4.6,
            "students_enrolled": 8750,
            "price": "₹15,000",
            "skills_covered": ["Team Building", "Conflict Resolution", "Strategic Thinking", "Communication"]
        }
    ])
    
    return courses[:4]  # Return top 4 courses

def generate_learning_path(career_stage, interests):
    """Generate a personalized learning path"""
    if career_stage == "Entry Level":
        return f"Start with foundational skills in {interests['primary'].lower()}, then progress to specialized certifications and practical projects"
    elif career_stage == "Junior Professional":
        return f"Focus on advanced {interests['primary'].lower()} skills and leadership development to prepare for senior roles"
    else:
        return f"Concentrate on strategic thinking and industry expertise in {interests['primary'].lower()} to become a thought leader"

def generate_next_steps(career_stage, interests):
    """Generate actionable next steps"""
    steps = [
        "Complete your first recommended course within 30 days",
        "Build a portfolio project showcasing your new skills",
        "Join professional communities and networking groups"
    ]
    
    if career_stage == "Entry Level":
        steps.extend([
            "Apply for internships or entry-level positions",
            "Create a strong LinkedIn profile"
        ])
    elif career_stage in ["Junior Professional", "Mid-Level Professional"]:
        steps.extend([
            "Seek mentorship opportunities",
            "Take on leadership roles in current projects"
        ])
    
    return steps

def generate_personality_insights(answers):
    """Generate personality-based insights"""
    work_style = answers.get('4', '')
    
    insights = {
        "work_style": work_style,
        "strengths": [],
        "recommendations": []
    }
    
    if work_style == "Remote work":
        insights["strengths"].append("Self-motivated and independent")
        insights["recommendations"].append("Consider remote-first companies and digital nomad opportunities")
    elif work_style == "Office-based":
        insights["strengths"].append("Collaborative and team-oriented")
        insights["recommendations"].append("Look for companies with strong office culture and team collaboration")
    elif work_style == "Hybrid (mix of remote and office)":
        insights["strengths"].append("Flexible and adaptable")
        insights["recommendations"].append("Target companies offering hybrid work arrangements")
    
    return insights

def get_market_opportunities(interests):
    """Get market opportunities based on interests"""
    opportunities = {
        "Technology": {
            "growth_rate": "+23%",
            "avg_salary": "₹8,50,000",
            "job_openings": "45,000+",
            "top_skills": ["AI/ML", "Cloud Computing", "Cybersecurity", "Full-Stack Development"]
        },
        "Business": {
            "growth_rate": "+18%",
            "avg_salary": "₹7,20,000",
            "job_openings": "32,000+",
            "top_skills": ["Digital Marketing", "Data Analysis", "Project Management", "Strategic Planning"]
        },
        "Creative": {
            "growth_rate": "+15%",
            "avg_salary": "₹6,50,000",
            "job_openings": "28,000+",
            "top_skills": ["UI/UX Design", "Graphic Design", "Content Creation", "Brand Strategy"]
        },
        "Service": {
            "growth_rate": "+12%",
            "avg_salary": "₹5,80,000",
            "job_openings": "38,000+",
            "top_skills": ["Patient Care", "Education Technology", "Healthcare Analytics", "Digital Health"]
        }
    }
    
    return opportunities.get(interests['primary'], opportunities["Technology"])

def generate_career_timeline(career_stage, interests):
    """Generate a career timeline based on current stage"""
    timelines = {
        "Entry Level": {
            "6_months": "Complete foundational courses and build first project",
            "1_year": "Land first job or internship in your field",
            "2_years": "Gain 1-2 years of professional experience",
            "3_years": "Consider specialization or advanced certifications"
        },
        "Junior Professional": {
            "6_months": "Take on more responsibility in current role",
            "1_year": "Seek promotion or new opportunities",
            "2_years": "Become a subject matter expert in your area",
            "3_years": "Consider leadership roles or advanced degrees"
        },
        "Mid-Level Professional": {
            "6_months": "Lead a significant project or initiative",
            "1_year": "Mentor junior professionals",
            "2_years": "Consider management or senior individual contributor roles",
            "3_years": "Become a thought leader in your industry"
        }
    }
    
    return timelines.get(career_stage, timelines["Entry Level"])

@app.route('/api/assessments/recommendations', methods=['GET'])
def get_user_recommendations():
    """Get user's course recommendations"""
    try:
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
                },
                {
                    "title": "Leadership and Management",
                    "description": "Develop leadership skills for career advancement",
                    "category": "Soft Skills",
                    "difficulty": "Intermediate",
                    "duration": "4 weeks",
                    "platform": "Leadership Academy",
                    "priority": "Medium",
                    "reason": "Important for career progression"
                }
            ],
            "learning_path": "Begin with foundational courses, then progress to specialized skills",
            "next_steps": ["Review your career goals", "Start with high-priority courses", "Track your progress"]
        }
        
        return jsonify({
            "success": True,
            "data": {
                "recommendation": {
                    "recommendations": mock_recommendations,
                    "generated_at": datetime.now().isoformat(),
                    "ai_model": "mock-model"
                }
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to get recommendations: {str(e)}"
        }), 500

# Personality Assessment Endpoints
@app.route('/api/personality/questions', methods=['GET'])
def get_personality_questions():
    """Get personality assessment questions"""
    try:
        questions = [
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
            }
        ]
        
        return jsonify({
            "success": True,
            "data": {
                "questions": questions,
                "total_questions": len(questions),
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
        
        # Mock personality analysis
        mock_results = {
            "personality_type": "The Collaborator",
            "top_traits": [
                { "trait": "Teamwork", "score": 8.5 },
                { "trait": "Communication", "score": 8.2 },
                { "trait": "Empathy", "score": 7.9 },
                { "trait": "Leadership", "score": 7.5 },
                { "trait": "Creativity", "score": 7.2 }
            ],
            "strengths": ["Teamwork", "Communication", "Empathy"],
            "development_areas": ["Technical Skills", "Analytical Thinking"],
            "career_recommendations": ["Project Manager", "Team Lead", "Consultant"],
            "ideal_environments": ["Collaborative", "Dynamic", "Supportive"],
            "leadership_style": "Collaborative and supportive",
            "communication_preferences": "Direct and encouraging",
            "learning_recommendations": ["Hands-on projects", "Group learning", "Mentorship"]
        }
        
        return jsonify({
            "success": True,
            "message": "Personality assessment completed successfully",
            "data": {
                "test_id": "personality_test_123",
                "profile": mock_results,
                "ai_insights": mock_results,
                "recommendations": mock_results.get("career_recommendations", [])
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
        
        mock_trends = {
            "trends": {
                "technology": {
                    "growth_rate": 15.2,
                    "demand_skills": ["AI/ML", "Cloud Computing", "Cybersecurity", "Data Science"],
                    "salary_trends": {"entry": 600000, "mid": 1200000, "senior": 2000000},
                    "job_openings": 45000,
                    "remote_percentage": 65,
                    "market_sentiment": "Very Positive",
                    "skill_demand_change": "+23%",
                    "salary_growth": "+12%"
                },
                "healthcare": {
                    "growth_rate": 12.8,
                    "demand_skills": ["Digital Health", "Telemedicine", "Data Analytics", "Patient Care"],
                    "salary_trends": {"entry": 500000, "mid": 1000000, "senior": 1800000},
                    "job_openings": 32000,
                    "remote_percentage": 25,
                    "market_sentiment": "Positive",
                    "skill_demand_change": "+18%",
                    "salary_growth": "+8%"
                }
            },
            "ai_analysis": {
                "market_summary": "Strong growth across all sectors with technology leading the way. Remote work continues to be a major trend.",
                "emerging_opportunities": ["AI/ML Engineering", "Cybersecurity", "Digital Health", "EdTech", "Fintech"],
                "skill_predictions": ["Cloud Computing", "Data Science", "Remote Work Skills", "AI/ML", "Cybersecurity"],
                "salary_analysis": "Competitive salaries with remote work flexibility becoming a key differentiator.",
                "growth_recommendations": [
                    "Upskill in emerging technologies",
                    "Develop remote work capabilities", 
                    "Focus on AI/ML and data science",
                    "Build cross-functional skills"
                ]
            },
            "last_updated": datetime.now().isoformat(),
            "data_source": "CareerBridgeAI Market Intelligence"
        }
        
        return jsonify({
            "success": True,
            "data": mock_trends
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
        
        mock_roadmap = {
            "short_term": {
                "duration": "6 months",
                "goals": [
                    "Complete foundational courses in your chosen field",
                    "Build 3-5 portfolio projects demonstrating your skills",
                    "Network with 20+ professionals in your industry",
                    "Get certified in 1-2 relevant technologies"
                ],
                "skills": [
                    "Technical fundamentals",
                    "Communication and presentation",
                    "Project management basics",
                    "Industry-specific knowledge"
                ],
                "milestones": [
                    {
                        "id": 1,
                        "title": "Complete Online Course",
                        "description": "Finish a comprehensive course in your chosen technology",
                        "deadline": "Month 2",
                        "status": "pending",
                        "priority": "high",
                        "resources": ["Coursera", "Udemy", "edX"]
                    },
                    {
                        "id": 2,
                        "title": "Build First Project",
                        "description": "Create a portfolio project showcasing your skills",
                        "deadline": "Month 3",
                        "status": "pending",
                        "priority": "high",
                        "resources": ["GitHub", "Portfolio Website"]
                    }
                ]
            },
            "medium_term": {
                "duration": "1 year",
                "goals": [
                    "Gain 6+ months of practical work experience",
                    "Specialize in 2-3 specific areas within your field",
                    "Build a strong professional network (100+ connections)",
                    "Lead or contribute to a significant project"
                ],
                "skills": [
                    "Advanced technical skills",
                    "Leadership and team management",
                    "Industry expertise",
                    "Mentoring and knowledge sharing"
                ],
                "milestones": [
                    {
                        "id": 3,
                        "title": "Land First Job/Internship",
                        "description": "Secure employment or internship in your target field",
                        "deadline": "Month 8",
                        "status": "pending",
                        "priority": "high",
                        "resources": ["LinkedIn", "Job Boards", "Company Websites"]
                    }
                ]
            },
            "long_term": {
                "duration": "3 years",
                "goals": [
                    "Become a recognized expert in your domain",
                    "Take on senior or leadership positions",
                    "Mentor junior professionals and give back to community",
                    "Consider entrepreneurship or consulting opportunities"
                ],
                "skills": [
                    "Domain expertise and thought leadership",
                    "Strategic thinking and planning",
                    "Team leadership and management",
                    "Business acumen and entrepreneurship"
                ],
                "milestones": [
                    {
                        "id": 4,
                        "title": "Become Industry Expert",
                        "description": "Gain recognition as a subject matter expert",
                        "deadline": "Year 2",
                        "status": "pending",
                        "priority": "high",
                        "resources": ["Speaking Engagements", "Publications", "Industry Recognition"]
                    }
                ]
            },
            "learning_resources": [
                {
                    "name": "Online Learning Platforms",
                    "platforms": ["Coursera", "Udemy", "edX", "Pluralsight"],
                    "focus": "Technical Skills and Certifications",
                    "cost": "₹2,000 - ₹15,000 per course"
                },
                {
                    "name": "Industry Certifications",
                    "platforms": ["AWS", "Google Cloud", "Microsoft", "Industry Bodies"],
                    "focus": "Professional Credibility and Recognition",
                    "cost": "₹5,000 - ₹50,000 per certification"
                }
            ],
            "generated_at": datetime.now().isoformat()
        }
        
        return jsonify({
            "success": True,
            "data": {
                "roadmap": mock_roadmap,
                "generated_at": datetime.now().isoformat()
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to generate career roadmap: {str(e)}"
        }), 500

# Auth Profile Endpoint (for current user)
@app.route('/api/auth/profile', methods=['GET'])
def get_current_user_profile():
    """Get current user profile (for authentication context)"""
    try:
        # Get the first user as mock current user
        # In a real app, this would get the user from the JWT token
        user_id = list(users.keys())[0] if users else None
        
        if not user_id:
            return jsonify({
                "success": False,
                "message": "No users found"
            }), 404
        
        user = users[user_id]
        
        return jsonify({
            "success": True,
            "data": {
                "user": user
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to get profile: {str(e)}"
        }), 500

# Profile Endpoints
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
        
        # Mock profile data
        mock_profile = {
            "user": user,
            "profile_completion": 75,
            "assessments": [
                {
                    "id": "assessment_1",
                    "type": "Career Assessment",
                    "completed_at": "2024-01-15T10:30:00Z",
                    "score": 85,
                    "status": "completed"
                }
            ],
            "personality_tests": [
                {
                    "id": "personality_1",
                    "personality_type": "The Collaborator",
                    "top_traits": [
                        { "trait": "Teamwork", "score": 8.5 },
                        { "trait": "Communication", "score": 8.2 },
                        { "trait": "Empathy", "score": 7.9 }
                    ],
                    "strengths": ["Teamwork", "Communication", "Empathy"],
                    "development_areas": ["Technical Skills", "Analytical Thinking"]
                }
            ],
            "career_insights": {
                "recommended_roles": ["Project Manager", "Team Lead", "Consultant"],
                "skill_gaps": ["Data Analysis", "Technical Writing", "Strategic Planning"],
                "learning_path": "Focus on technical skills while leveraging your strong interpersonal abilities",
                "next_milestones": [
                    "Complete data analysis course",
                    "Lead a cross-functional project",
                    "Get industry certification"
                ]
            }
        }
        
        return jsonify({
            "success": True,
            "data": mock_profile
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to get user profile: {str(e)}"
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)

