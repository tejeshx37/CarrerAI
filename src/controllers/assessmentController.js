const { dbHelpers, COLLECTIONS } = require('../config/database');
const { Assessment } = require('../models/Assessment');
const OpenAI = require('openai');

// Initialize OpenAI (only if API key is provided)
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

class AssessmentController {
  // Create a new assessment
  static async createAssessment(req, res) {
    try {
      const userId = req.user.id;
      const {
        assessmentType,
        title,
        description,
        questions,
        timeLimit,
        difficulty
      } = req.body;

      if (!assessmentType || !title || !questions || !Array.isArray(questions)) {
        return res.status(400).json({
          success: false,
          message: 'Assessment type, title, and questions are required'
        });
      }

      const assessmentData = {
        userId,
        assessmentType,
        title,
        description: description || '',
        totalQuestions: questions.length,
        timeLimit: timeLimit || null,
        difficulty: difficulty || 'mixed',
        questions,
        status: 'draft',
        responses: [],
        version: '1.0',
        language: 'en',
        tags: []
      };

      // Validate assessment data
      const validatedData = Assessment.validate(assessmentData);

      // Create assessment in Firestore
      const newAssessment = await dbHelpers.createDocument(COLLECTIONS.ASSESSMENTS, validatedData);

      res.status(201).json({
        success: true,
        message: 'Assessment created successfully',
        data: { assessment: newAssessment }
      });

    } catch (error) {
      console.error('Create assessment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create assessment',
        error: error.message
      });
    }
  }

  // Start an assessment
  static async startAssessment(req, res) {
    try {
      const { assessmentId } = req.params;
      const userId = req.user.id;

      // Get assessment
      const assessment = await dbHelpers.getDocument(COLLECTIONS.ASSESSMENTS, assessmentId);

      // Check if user owns the assessment
      if (assessment.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only start your own assessments'
        });
      }

      // Check if assessment is already completed
      if (assessment.status === 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Assessment is already completed'
        });
      }

      // Start assessment
      const assessmentObj = new Assessment(assessment);
      const startedAssessment = assessmentObj.start();

      // Update assessment in Firestore
      const updatedAssessment = await dbHelpers.updateDocument(
        COLLECTIONS.ASSESSMENTS,
        assessmentId,
        {
          status: startedAssessment.status,
          startedAt: startedAssessment.startedAt
        }
      );

      res.json({
        success: true,
        message: 'Assessment started successfully',
        data: { assessment: updatedAssessment }
      });

    } catch (error) {
      console.error('Start assessment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start assessment',
        error: error.message
      });
    }
  }

  // Submit assessment response
  static async submitResponse(req, res) {
    try {
      const { assessmentId } = req.params;
      const { questionId, answer, timeSpent } = req.body;
      const userId = req.user.id;

      if (!questionId || answer === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Question ID and answer are required'
        });
      }

      // Get assessment
      const assessment = await dbHelpers.getDocument(COLLECTIONS.ASSESSMENTS, assessmentId);

      // Check if user owns the assessment
      if (assessment.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only submit responses to your own assessments'
        });
      }

      // Check if assessment is in progress
      if (assessment.status !== 'in_progress') {
        return res.status(400).json({
          success: false,
          message: 'Assessment is not in progress'
        });
      }

      // Add response
      const assessmentObj = new Assessment(assessment);
      assessmentObj.addResponse(questionId, answer, timeSpent);

      // Check if assessment is complete
      const isComplete = assessmentObj.isComplete();
      if (isComplete) {
        assessmentObj.complete();
      }

      // Update assessment in Firestore
      const updateData = {
        responses: assessmentObj.data.responses,
        status: assessmentObj.data.status
      };

      if (isComplete) {
        updateData.completedAt = assessmentObj.data.completedAt;
        updateData.timeSpent = assessmentObj.data.timeSpent;
      }

      const updatedAssessment = await dbHelpers.updateDocument(
        COLLECTIONS.ASSESSMENTS,
        assessmentId,
        updateData
      );

      res.json({
        success: true,
        message: isComplete ? 'Assessment completed successfully' : 'Response submitted successfully',
        data: { 
          assessment: updatedAssessment,
          isComplete,
          progress: assessmentObj.getProgressPercentage()
        }
      });

    } catch (error) {
      console.error('Submit response error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit response',
        error: error.message
      });
    }
  }

  // Complete assessment and generate results
  static async completeAssessment(req, res) {
    try {
      const { assessmentId } = req.params;
      const userId = req.user.id;

      // Get assessment
      const assessment = await dbHelpers.getDocument(COLLECTIONS.ASSESSMENTS, assessmentId);

      // Check if user owns the assessment
      if (assessment.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only complete your own assessments'
        });
      }

      // Check if assessment is in progress
      if (assessment.status !== 'in_progress') {
        return res.status(400).json({
          success: false,
          message: 'Assessment is not in progress'
        });
      }

      // Complete assessment
      const assessmentObj = new Assessment(assessment);
      assessmentObj.complete();

      // Calculate basic scores
      const results = assessmentObj.calculateScore();

      // Generate AI-powered insights based on assessment type
      let aiAnalysis = {};
      if (assessment.assessmentType === 'psychometric' || assessment.assessmentType === 'comprehensive') {
        aiAnalysis = await AssessmentController.generatePsychometricAnalysis(assessment, results);
      } else if (assessment.assessmentType === 'skills') {
        aiAnalysis = await AssessmentController.generateSkillsAnalysis(assessment, results);
      } else if (assessment.assessmentType === 'career_interest') {
        aiAnalysis = await AssessmentController.generateCareerInterestAnalysis(assessment, results);
      }

      // Update assessment with results
      const updateData = {
        status: assessmentObj.data.status,
        completedAt: assessmentObj.data.completedAt,
        timeSpent: assessmentObj.data.timeSpent,
        results: {
          ...results,
          ...aiAnalysis
        }
      };

      const updatedAssessment = await dbHelpers.updateDocument(
        COLLECTIONS.ASSESSMENTS,
        assessmentId,
        updateData
      );

      // Update user's psychometric profile if applicable
      if (assessment.assessmentType === 'psychometric' || assessment.assessmentType === 'comprehensive') {
        await AssessmentController.updateUserPsychometricProfile(userId, aiAnalysis);
      }

      res.json({
        success: true,
        message: 'Assessment completed successfully',
        data: { assessment: updatedAssessment }
      });

    } catch (error) {
      console.error('Complete assessment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to complete assessment',
        error: error.message
      });
    }
  }

  // Get assessment details
  static async getAssessment(req, res) {
    try {
      const { assessmentId } = req.params;
      const userId = req.user.id;

      // Get assessment
      const assessment = await dbHelpers.getDocument(COLLECTIONS.ASSESSMENTS, assessmentId);

      // Check if user owns the assessment
      if (assessment.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only view your own assessments'
        });
      }

      res.json({
        success: true,
        data: { assessment }
      });

    } catch (error) {
      console.error('Get assessment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get assessment',
        error: error.message
      });
    }
  }

  // Get user's assessments
  static async getUserAssessments(req, res) {
    try {
      const userId = req.user.id;
      const { type, status, limit = 20, offset = 0 } = req.query;

      // Build filters
      const filters = [
        { field: 'userId', operator: '==', value: userId }
      ];

      if (type) {
        filters.push({ field: 'assessmentType', operator: '==', value: type });
      }

      if (status) {
        filters.push({ field: 'status', operator: '==', value: status });
      }

      // Get assessments
      const assessments = await dbHelpers.queryDocuments(
        COLLECTIONS.ASSESSMENTS,
        filters,
        { field: 'createdAt', direction: 'desc' },
        parseInt(limit) + parseInt(offset)
      );

      // Apply pagination
      const paginatedAssessments = assessments.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

      // Get summaries
      const summaries = paginatedAssessments.map(assessment => {
        const assessmentObj = new Assessment(assessment);
        return assessmentObj.getSummary();
      });

      res.json({
        success: true,
        data: {
          assessments: summaries,
          total: assessments.length,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });

    } catch (error) {
      console.error('Get user assessments error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get assessments',
        error: error.message
      });
    }
  }

  // Generate psychometric analysis using AI
  static async generatePsychometricAnalysis(assessment, results) {
    try {
      const prompt = `
        Analyze the following psychometric assessment results and provide insights:
        
        Assessment Type: ${assessment.assessmentType}
        Total Score: ${results.totalScore || 0}
        Percentage: ${results.percentage || 0}%
        Grade: ${results.grade || 'N/A'}
        
        Questions and Responses:
        ${assessment.questions.map((q, index) => {
          const response = assessment.responses.find(r => r.questionId === q.id);
          return `Q${index + 1}: ${q.question}\nAnswer: ${response?.answer || 'No response'}\nCategory: ${q.category || 'General'}`;
        }).join('\n\n')}
        
        Please provide:
        1. Personality type assessment (e.g., INTJ, ENFP, etc.)
        2. Career fit score (0-100)
        3. Learning style (Visual, Auditory, Kinesthetic, Reading/Writing)
        4. Work style (Collaborative, Independent, Leadership, etc.)
        5. Communication style (Direct, Diplomatic, Analytical, etc.)
        6. Leadership potential (0-100)
        7. Risk tolerance (Low, Medium, High)
        8. Top 3 strengths
        9. Top 3 areas for improvement
        10. Career recommendations (3-5 specific roles)
        
        Format the response as a JSON object with the following structure:
        {
          "personalityType": "string",
          "careerFit": number,
          "learningStyle": "string",
          "workStyle": "string",
          "communicationStyle": "string",
          "leadershipPotential": number,
          "riskTolerance": "string",
          "strengths": ["string", "string", "string"],
          "areasForImprovement": ["string", "string", "string"],
          "recommendations": [
            {
              "type": "career_path",
              "title": "string",
              "description": "string",
              "priority": "high|medium|low",
              "confidence": number
            }
          ]
        }
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1500
      });

      const aiResponse = completion.choices[0].message.content;
      
      try {
        return JSON.parse(aiResponse);
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        return {
          personalityType: 'Unknown',
          careerFit: results.percentage || 0,
          learningStyle: 'Mixed',
          workStyle: 'Adaptive',
          communicationStyle: 'Balanced',
          leadershipPotential: 50,
          riskTolerance: 'Medium',
          strengths: ['Analytical thinking', 'Problem solving', 'Adaptability'],
          areasForImprovement: ['Communication', 'Time management', 'Leadership'],
          recommendations: []
        };
      }

    } catch (error) {
      console.error('AI analysis error:', error);
      return {
        personalityType: 'Unknown',
        careerFit: results.percentage || 0,
        learningStyle: 'Mixed',
        workStyle: 'Adaptive',
        communicationStyle: 'Balanced',
        leadershipPotential: 50,
        riskTolerance: 'Medium',
        strengths: ['Analytical thinking', 'Problem solving', 'Adaptability'],
        areasForImprovement: ['Communication', 'Time management', 'Leadership'],
        recommendations: []
      };
    }
  }

  // Generate skills analysis using AI
  static async generateSkillsAnalysis(assessment, results) {
    try {
      const prompt = `
        Analyze the following skills assessment results:
        
        Assessment Type: ${assessment.assessmentType}
        Total Score: ${results.totalScore || 0}
        Percentage: ${results.percentage || 0}%
        
        Questions and Responses:
        ${assessment.questions.map((q, index) => {
          const response = assessment.responses.find(r => r.questionId === q.id);
          return `Q${index + 1}: ${q.question}\nAnswer: ${response?.answer || 'No response'}\nCategory: ${q.category || 'General'}`;
        }).join('\n\n')}
        
        Provide skill scores for different categories and recommendations for skill development.
        Format as JSON with skillScores object and recommendations array.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      });

      const aiResponse = completion.choices[0].message.content;
      
      try {
        return JSON.parse(aiResponse);
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        return {
          skillScores: {},
          recommendations: []
        };
      }

    } catch (error) {
      console.error('Skills analysis error:', error);
      return {
        skillScores: {},
        recommendations: []
      };
    }
  }

  // Generate career interest analysis using AI
  static async generateCareerInterestAnalysis(assessment, results) {
    try {
      const prompt = `
        Analyze the following career interest assessment results:
        
        Assessment Type: ${assessment.assessmentType}
        Total Score: ${results.totalScore || 0}
        Percentage: ${results.percentage || 0}%
        
        Questions and Responses:
        ${assessment.questions.map((q, index) => {
          const response = assessment.responses.find(r => r.questionId === q.id);
          return `Q${index + 1}: ${q.question}\nAnswer: ${response?.answer || 'No response'}\nCategory: ${q.category || 'General'}`;
        }).join('\n\n')}
        
        Provide career interest categories with scores and specific career recommendations.
        Format as JSON with careerInterests array and recommendations array.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      });

      const aiResponse = completion.choices[0].message.content;
      
      try {
        return JSON.parse(aiResponse);
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        return {
          careerInterests: [],
          recommendations: []
        };
      }

    } catch (error) {
      console.error('Career interest analysis error:', error);
      return {
        careerInterests: [],
        recommendations: []
      };
    }
  }

  // Update user's psychometric profile
  static async updateUserPsychometricProfile(userId, aiAnalysis) {
    try {
      const psychometricProfile = {
        personalityType: aiAnalysis.personalityType,
        cognitiveAbilities: {
          analytical: aiAnalysis.careerFit || 0,
          creative: aiAnalysis.leadershipPotential || 0,
          logical: aiAnalysis.careerFit || 0,
          verbal: aiAnalysis.careerFit || 0
        },
        interests: aiAnalysis.recommendations?.map(r => r.title) || [],
        strengths: aiAnalysis.strengths || [],
        areasForImprovement: aiAnalysis.areasForImprovement || [],
        assessmentDate: new Date()
      };

      await dbHelpers.updateDocument(COLLECTIONS.USERS, userId, {
        psychometricProfile
      });

    } catch (error) {
      console.error('Update psychometric profile error:', error);
    }
  }
}

module.exports = AssessmentController;
