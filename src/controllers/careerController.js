const { dbHelpers, COLLECTIONS } = require('../config/database');
const { bigQueryHelpers } = require('../config/bigquery');
const OpenAI = require('openai');

// Initialize OpenAI (only if API key is provided)
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

class CareerController {
  // Get personalized career recommendations
  static async getCareerRecommendations(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 10, includeSalary = true, includeSkills = true } = req.query;

      // Get user profile
      const user = await dbHelpers.getDocument(COLLECTIONS.USERS, userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User profile not found'
        });
      }

      // Get career recommendations from BigQuery
      const marketData = await bigQueryHelpers.getCareerPathRecommendations(user);

      // Get user's assessment results if available
      const assessments = await dbHelpers.queryDocuments(COLLECTIONS.ASSESSMENTS, [
        { field: 'userId', operator: '==', value: userId },
        { field: 'status', operator: '==', value: 'completed' }
      ], { field: 'completedAt', direction: 'desc' }, 5);

      // Generate AI-powered personalized recommendations
      const personalizedRecommendations = await CareerController.generatePersonalizedRecommendations(
        user, 
        marketData, 
        assessments
      );

      // Filter and limit results
      const recommendations = personalizedRecommendations.slice(0, parseInt(limit));

      res.json({
        success: true,
        data: {
          recommendations,
          userProfile: {
            careerStage: new (require('../models/User')).User(user).getCareerStage(),
            experienceLevel: new (require('../models/User')).User(user).getExperienceLevel(),
            profileCompletion: user.profileCompletionPercentage
          },
          marketInsights: {
            totalOpportunities: marketData.length,
            averageSalary: marketData.reduce((sum, job) => sum + (job.average_salary || 0), 0) / marketData.length,
            topSkills: CareerController.extractTopSkills(marketData)
          }
        }
      });

    } catch (error) {
      console.error('Get career recommendations error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get career recommendations',
        error: error.message
      });
    }
  }

  // Get job market trends
  static async getJobMarketTrends(req, res) {
    try {
      const { timeframe = '1Y', location = 'India', industry = null } = req.query;

      const trends = await bigQueryHelpers.getJobMarketTrends(timeframe, location);

      // Filter by industry if specified
      const filteredTrends = industry 
        ? trends.filter(trend => trend.industry?.toLowerCase().includes(industry.toLowerCase()))
        : trends;

      // Analyze trends
      const analysis = CareerController.analyzeJobTrends(filteredTrends);

      res.json({
        success: true,
        data: {
          trends: filteredTrends,
          analysis,
          timeframe,
          location,
          industry
        }
      });

    } catch (error) {
      console.error('Get job market trends error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get job market trends',
        error: error.message
      });
    }
  }

  // Get skill demand analysis
  static async getSkillDemandAnalysis(req, res) {
    try {
      const { skills = [], location = 'India' } = req.query;
      const skillArray = Array.isArray(skills) ? skills : skills.split(',');

      const skillData = await bigQueryHelpers.getSkillDemandAnalysis(skillArray, location);

      // Analyze skill trends
      const analysis = CareerController.analyzeSkillTrends(skillData);

      res.json({
        success: true,
        data: {
          skills: skillData,
          analysis,
          location,
          requestedSkills: skillArray
        }
      });

    } catch (error) {
      console.error('Get skill demand analysis error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get skill demand analysis',
        error: error.message
      });
    }
  }

  // Get salary insights
  static async getSalaryInsights(req, res) {
    try {
      const { jobTitle, location = 'India', experience = '0-2' } = req.query;

      if (!jobTitle) {
        return res.status(400).json({
          success: false,
          message: 'Job title is required'
        });
      }

      const salaryData = await bigQueryHelpers.getSalaryInsights(jobTitle, location, experience);

      if (salaryData.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No salary data found for the specified criteria'
        });
      }

      // Analyze salary data
      const analysis = CareerController.analyzeSalaryData(salaryData);

      res.json({
        success: true,
        data: {
          salaryData,
          analysis,
          jobTitle,
          location,
          experience
        }
      });

    } catch (error) {
      console.error('Get salary insights error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get salary insights',
        error: error.message
      });
    }
  }

  // Get emerging job roles
  static async getEmergingJobRoles(req, res) {
    try {
      const { timeframe = '6M' } = req.query;

      const emergingRoles = await bigQueryHelpers.getEmergingJobRoles(timeframe);

      // Analyze emerging roles
      const analysis = CareerController.analyzeEmergingRoles(emergingRoles);

      res.json({
        success: true,
        data: {
          emergingRoles,
          analysis,
          timeframe
        }
      });

    } catch (error) {
      console.error('Get emerging job roles error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get emerging job roles',
        error: error.message
      });
    }
  }

  // Get skill gap analysis for user
  static async getSkillGapAnalysis(req, res) {
    try {
      const userId = req.user.id;

      // Get user profile
      const user = await dbHelpers.getDocument(COLLECTIONS.USERS, userId);
      const currentSkills = user.technicalSkills || [];

      // Get user's career interests
      const targetRoles = user.careerInterests || [];

      // Get skill gap data
      const skillGaps = await bigQueryHelpers.getSkillGapAnalysis(currentSkills, targetRoles[0]);

      // Generate personalized learning recommendations
      const learningPlan = await CareerController.generateLearningPlan(user, skillGaps);

      res.json({
        success: true,
        data: {
          currentSkills,
          skillGaps,
          learningPlan,
          targetRoles
        }
      });

    } catch (error) {
      console.error('Get skill gap analysis error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get skill gap analysis',
        error: error.message
      });
    }
  }

  // Generate personalized career roadmap
  static async generateCareerRoadmap(req, res) {
    try {
      const userId = req.user.id;
      const { targetRole, timeframe = '2Y' } = req.body;

      if (!targetRole) {
        return res.status(400).json({
          success: false,
          message: 'Target role is required'
        });
      }

      // Get user profile
      const user = await dbHelpers.getDocument(COLLECTIONS.USERS, userId);

      // Get market data for target role
      const marketData = await bigQueryHelpers.getSalaryInsights(targetRole, user.state || 'India');
      const skillData = await bigQueryHelpers.getSkillDemandAnalysis([], user.state || 'India');

      // Generate AI-powered roadmap
      const roadmap = await CareerController.generateAICareerRoadmap(user, targetRole, marketData, skillData, timeframe);

      res.json({
        success: true,
        data: {
          roadmap,
          targetRole,
          timeframe,
          userProfile: {
            currentLevel: new (require('../models/User')).User(user).getExperienceLevel(),
            currentSkills: user.technicalSkills || [],
            educationLevel: user.currentEducationLevel
          }
        }
      });

    } catch (error) {
      console.error('Generate career roadmap error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate career roadmap',
        error: error.message
      });
    }
  }

  // Helper method to generate personalized recommendations using AI
  static async generatePersonalizedRecommendations(user, marketData, assessments) {
    try {
      const prompt = `
        Based on the following user profile and market data, generate personalized career recommendations:
        
        User Profile:
        - Education Level: ${user.currentEducationLevel}
        - Career Interests: ${user.careerInterests?.join(', ') || 'Not specified'}
        - Technical Skills: ${user.technicalSkills?.join(', ') || 'None'}
        - Soft Skills: ${user.softSkills?.join(', ') || 'None'}
        - Experience Level: ${new (require('../models/User')).User(user).getExperienceLevel()}
        - Location: ${user.city}, ${user.state}
        - Work Experience: ${user.workExperience?.length || 0} positions
        
        Assessment Results:
        ${assessments.map(assessment => `
          - ${assessment.assessmentType}: ${assessment.results?.percentage || 0}%
          - Strengths: ${assessment.results?.strengths?.join(', ') || 'Not available'}
          - Personality: ${assessment.results?.personalityType || 'Not assessed'}
        `).join('\n')}
        
        Market Data (Top 10 opportunities):
        ${marketData.slice(0, 10).map(job => `
          - ${job.job_title} in ${job.industry}
          - Salary: ${job.average_salary}
          - Growth Rate: ${job.growth_rate}%
          - Required Skills: ${job.skill_requirements}
        `).join('\n')}
        
        Provide 10 personalized career recommendations with:
        1. Job title and industry
        2. Match score (0-100)
        3. Why it's a good fit
        4. Required skills to develop
        5. Expected salary range
        6. Career progression path
        7. Action steps
        
        Format as JSON array with detailed recommendations.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      });

      const aiResponse = completion.choices[0].message.content;
      
      try {
        return JSON.parse(aiResponse);
      } catch (parseError) {
        console.error('Failed to parse AI recommendations:', parseError);
        return CareerController.generateFallbackRecommendations(user, marketData);
      }

    } catch (error) {
      console.error('AI recommendations error:', error);
      return CareerController.generateFallbackRecommendations(user, marketData);
    }
  }

  // Fallback recommendations when AI fails
  static generateFallbackRecommendations(user, marketData) {
    return marketData.slice(0, 10).map((job, index) => ({
      jobTitle: job.job_title,
      industry: job.industry,
      matchScore: Math.max(60, 100 - (index * 5)),
      reason: `Based on your ${user.currentEducationLevel} education and interest in ${user.careerInterests?.[0] || 'technology'}`,
      requiredSkills: job.skill_requirements?.split(',') || [],
      salaryRange: `${job.average_salary * 0.8} - ${job.average_salary * 1.2}`,
      careerPath: ['Entry Level', 'Mid Level', 'Senior Level'],
      actionSteps: [
        'Complete relevant certifications',
        'Build portfolio projects',
        'Network with industry professionals',
        'Apply for entry-level positions'
      ]
    }));
  }

  // Generate AI-powered career roadmap
  static async generateAICareerRoadmap(user, targetRole, marketData, skillData, timeframe) {
    try {
      const prompt = `
        Create a detailed career roadmap for achieving the role of "${targetRole}" in ${timeframe}:
        
        Current Profile:
        - Education: ${user.currentEducationLevel}
        - Skills: ${user.technicalSkills?.join(', ') || 'Basic'}
        - Experience: ${new (require('../models/User')).User(user).getExperienceLevel()}
        - Location: ${user.city}, ${user.state}
        
        Target Role Market Data:
        - Average Salary: ${marketData[0]?.average_salary || 'Not available'}
        - Required Skills: ${marketData[0]?.skill_requirements || 'Not specified'}
        - Experience Required: ${marketData[0]?.experience_required || 'Not specified'}
        
        Create a phased roadmap with:
        1. Phase 1 (0-6 months): Foundation building
        2. Phase 2 (6-12 months): Skill development
        3. Phase 3 (12-18 months): Experience building
        4. Phase 4 (18-24 months): Role transition
        
        Each phase should include:
        - Specific goals
        - Skills to learn
        - Certifications to obtain
        - Projects to complete
        - Networking activities
        - Timeline
        - Success metrics
        
        Format as JSON with detailed phases and actionable steps.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2500
      });

      const aiResponse = completion.choices[0].message.content;
      
      try {
        return JSON.parse(aiResponse);
      } catch (parseError) {
        console.error('Failed to parse AI roadmap:', parseError);
        return CareerController.generateFallbackRoadmap(user, targetRole, timeframe);
      }

    } catch (error) {
      console.error('AI roadmap error:', error);
      return CareerController.generateFallbackRoadmap(user, targetRole, timeframe);
    }
  }

  // Fallback roadmap when AI fails
  static generateFallbackRoadmap(user, targetRole, timeframe) {
    return {
      phases: [
        {
          phase: 1,
          duration: "0-6 months",
          title: "Foundation Building",
          goals: ["Learn basic concepts", "Build fundamental skills"],
          skills: ["Basic programming", "Industry knowledge"],
          certifications: ["Entry-level certification"],
          projects: ["Portfolio project 1"],
          networking: ["Join professional groups"],
          timeline: "6 months",
          successMetrics: ["Complete 2 projects", "Obtain 1 certification"]
        },
        {
          phase: 2,
          duration: "6-12 months",
          title: "Skill Development",
          goals: ["Advanced skill building", "Specialization"],
          skills: ["Advanced programming", "Domain expertise"],
          certifications: ["Intermediate certification"],
          projects: ["Portfolio project 2", "Open source contribution"],
          networking: ["Attend industry events"],
          timeline: "6 months",
          successMetrics: ["Complete 3 projects", "Build professional network"]
        }
      ]
    };
  }

  // Generate learning plan
  static async generateLearningPlan(user, skillGaps) {
    return {
      currentSkills: user.technicalSkills || [],
      skillGaps: skillGaps.slice(0, 10),
      learningPlan: {
        priority: skillGaps.slice(0, 5).map(skill => ({
          skill: skill.skill_name,
          priority: 'High',
          estimatedTime: skill.time_to_learn || '3-6 months',
          resources: ['Online courses', 'Practice projects', 'Certifications']
        })),
        timeline: '6-12 months',
        milestones: [
          'Complete 3 high-priority skills',
          'Build 2 projects using new skills',
          'Obtain relevant certifications'
        ]
      }
    };
  }

  // Analyze job trends
  static analyzeJobTrends(trends) {
    const industries = {};
    const skills = {};
    let totalSalary = 0;
    let salaryCount = 0;

    trends.forEach(trend => {
      // Industry analysis
      if (trend.industry) {
        industries[trend.industry] = (industries[trend.industry] || 0) + 1;
      }

      // Skills analysis
      if (trend.skill_requirements) {
        trend.skill_requirements.split(',').forEach(skill => {
          const cleanSkill = skill.trim();
          skills[cleanSkill] = (skills[cleanSkill] || 0) + 1;
        });
      }

      // Salary analysis
      if (trend.average_salary) {
        totalSalary += trend.average_salary;
        salaryCount++;
      }
    });

    return {
      topIndustries: Object.entries(industries)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([industry, count]) => ({ industry, count })),
      topSkills: Object.entries(skills)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([skill, count]) => ({ skill, count })),
      averageSalary: salaryCount > 0 ? Math.round(totalSalary / salaryCount) : 0,
      totalOpportunities: trends.length
    };
  }

  // Analyze skill trends
  static analyzeSkillTrends(skills) {
    const skillCategories = {};
    let totalDemand = 0;

    skills.forEach(skill => {
      totalDemand += skill.demand_score || 0;
      
      // Categorize skills (simplified)
      const category = skill.skill_name.toLowerCase().includes('programming') ? 'Programming' :
                      skill.skill_name.toLowerCase().includes('data') ? 'Data Science' :
                      skill.skill_name.toLowerCase().includes('design') ? 'Design' :
                      'Other';
      
      skillCategories[category] = (skillCategories[category] || 0) + 1;
    });

    return {
      averageDemand: skills.length > 0 ? totalDemand / skills.length : 0,
      skillCategories: Object.entries(skillCategories)
        .map(([category, count]) => ({ category, count })),
      totalSkills: skills.length
    };
  }

  // Analyze salary data
  static analyzeSalaryData(salaryData) {
    const salaries = salaryData.map(data => data.average_salary).filter(s => s);
    const sortedSalaries = salaries.sort((a, b) => a - b);

    return {
      average: Math.round(salaries.reduce((sum, s) => sum + s, 0) / salaries.length),
      median: sortedSalaries[Math.floor(sortedSalaries.length / 2)],
      min: Math.min(...salaries),
      max: Math.max(...salaries),
      range: Math.max(...salaries) - Math.min(...salaries),
      sampleSize: salaryData.length
    };
  }

  // Analyze emerging roles
  static analyzeEmergingRoles(roles) {
    const industries = {};
    const skills = {};

    roles.forEach(role => {
      if (role.industry) {
        industries[role.industry] = (industries[role.industry] || 0) + 1;
      }

      if (role.skill_requirements) {
        role.skill_requirements.split(',').forEach(skill => {
          const cleanSkill = skill.trim();
          skills[cleanSkill] = (skills[cleanSkill] || 0) + 1;
        });
      }
    });

    return {
      topIndustries: Object.entries(industries)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([industry, count]) => ({ industry, count })),
      topSkills: Object.entries(skills)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([skill, count]) => ({ skill, count })),
      totalRoles: roles.length
    };
  }

  // Extract top skills from market data
  static extractTopSkills(marketData) {
    const skills = {};
    
    marketData.forEach(job => {
      if (job.skill_requirements) {
        job.skill_requirements.split(',').forEach(skill => {
          const cleanSkill = skill.trim();
          skills[cleanSkill] = (skills[cleanSkill] || 0) + 1;
        });
      }
    });

    return Object.entries(skills)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }));
  }
}

module.exports = CareerController;
