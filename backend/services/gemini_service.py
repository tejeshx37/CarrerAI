import google.generativeai as genai
import os
import json
from typing import Dict, List, Any
from datetime import datetime

class GeminiService:
    def __init__(self):
        """Initialize Gemini Pro API"""
        self.api_key = os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-pro')
    
    def generate_course_recommendations(self, student_responses: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate personalized course recommendations based on student responses
        """
        try:
            # Create a structured prompt for Gemini
            prompt = self._create_recommendation_prompt(student_responses)
            
            # Generate response from Gemini
            response = self.model.generate_content(prompt)
            
            # Parse the response
            recommendations = self._parse_gemini_response(response.text)
            
            return {
                "success": True,
                "recommendations": recommendations,
                "generated_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to generate recommendations: {str(e)}",
                "recommendations": self._get_fallback_recommendations(student_responses)
            }
    
    def _create_recommendation_prompt(self, responses: Dict[str, Any]) -> str:
        """Create a structured prompt for Gemini Pro"""
        
        # Extract key information from responses
        education_level = responses.get('1', 'Not specified')
        career_interests = responses.get('2', [])
        work_experience = responses.get('3', 'Not specified')
        work_environment = responses.get('4', 'Not specified')
        skills = responses.get('5', [])
        
        prompt = f"""
You are a career guidance expert AI assistant. Based on the following student assessment responses, provide personalized course recommendations.

STUDENT PROFILE:
- Education Level: {education_level}
- Career Interests: {', '.join(career_interests) if isinstance(career_interests, list) else career_interests}
- Work Experience: {work_experience}
- Preferred Work Environment: {work_environment}
- Current Skills: {', '.join(skills) if isinstance(skills, list) else skills}

Please provide course recommendations in the following JSON format:
{{
    "career_path": "Recommended career path based on interests and skills",
    "skill_gaps": ["List of skills the student should develop"],
    "courses": [
        {{
            "title": "Course Title",
            "description": "Brief course description",
            "category": "Technical/Soft Skills/Business/etc",
            "difficulty": "Beginner/Intermediate/Advanced",
            "duration": "Estimated duration (e.g., 3 months, 6 weeks)",
            "platform": "Suggested learning platform",
            "priority": "High/Medium/Low",
            "reason": "Why this course is recommended"
        }}
    ],
    "learning_path": "Step-by-step learning progression",
    "next_steps": ["Immediate actions the student should take"]
}}

Focus on:
1. Courses that align with their career interests
2. Skills that bridge their current level to their goals
3. Practical, industry-relevant recommendations
4. Mix of technical and soft skills
5. Consider their experience level and preferred work environment

Provide 5-8 specific course recommendations with detailed information.
"""
        return prompt
    
    def _parse_gemini_response(self, response_text: str) -> Dict[str, Any]:
        """Parse Gemini's response and extract structured data"""
        try:
            # Try to extract JSON from the response
            import re
            
            # Look for JSON in the response
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                return json.loads(json_str)
            else:
                # If no JSON found, create a structured response from the text
                return self._parse_text_response(response_text)
                
        except json.JSONDecodeError:
            # If JSON parsing fails, parse as text
            return self._parse_text_response(response_text)
    
    def _parse_text_response(self, text: str) -> Dict[str, Any]:
        """Parse text response when JSON parsing fails"""
        return {
            "career_path": "AI-Generated Career Path",
            "skill_gaps": ["Communication", "Technical Skills", "Leadership"],
            "courses": [
                {
                    "title": "Introduction to Career Development",
                    "description": "Comprehensive course covering career planning and development",
                    "category": "Career Development",
                    "difficulty": "Beginner",
                    "duration": "4 weeks",
                    "platform": "Online Learning Platform",
                    "priority": "High",
                    "reason": "Essential for career growth"
                }
            ],
            "learning_path": "Start with foundational skills, then progress to advanced topics",
            "next_steps": ["Complete the assessment", "Review recommendations", "Start with high-priority courses"],
            "raw_response": text
        }
    
    def _get_fallback_recommendations(self, responses: Dict[str, Any]) -> Dict[str, Any]:
        """Provide fallback recommendations when Gemini API fails"""
        education_level = responses.get('1', 'Bachelor\'s Degree')
        career_interests = responses.get('2', ['Technology'])
        
        return {
            "career_path": f"Career development path for {education_level} graduate",
            "skill_gaps": ["Technical Skills", "Communication", "Project Management"],
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
                    "description": f"Skills relevant to {', '.join(career_interests) if isinstance(career_interests, list) else career_interests}",
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
