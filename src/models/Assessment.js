const Joi = require('joi');

// Assessment schema validation
const assessmentSchema = Joi.object({
  // Basic Information
  userId: Joi.string().required(),
  assessmentType: Joi.string().valid(
    'psychometric', 'skills', 'aptitude', 'personality', 'career_interest', 'comprehensive'
  ).required(),
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().max(1000).optional(),
  
  // Assessment Configuration
  totalQuestions: Joi.number().integer().min(1).required(),
  timeLimit: Joi.number().integer().min(60).optional(), // in seconds
  difficulty: Joi.string().valid('easy', 'medium', 'hard', 'mixed').default('mixed'),
  
  // Questions and Answers
  questions: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    type: Joi.string().valid('multiple_choice', 'likert_scale', 'text', 'ranking', 'boolean').required(),
    question: Joi.string().required(),
    options: Joi.array().items(Joi.string()).when('type', {
      is: Joi.string().valid('multiple_choice', 'likert_scale', 'ranking'),
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    correctAnswer: Joi.alternatives().try(
      Joi.string(),
      Joi.number(),
      Joi.array().items(Joi.string())
    ).optional(),
    weight: Joi.number().min(0).max(1).default(1),
    category: Joi.string().optional(),
    subcategory: Joi.string().optional()
  })).min(1).required(),
  
  // User Responses
  responses: Joi.array().items(Joi.object({
    questionId: Joi.string().required(),
    answer: Joi.alternatives().try(
      Joi.string(),
      Joi.number(),
      Joi.array().items(Joi.string()),
      Joi.boolean()
    ).required(),
    timeSpent: Joi.number().min(0).optional(), // in seconds
    timestamp: Joi.date().default(Date.now)
  })).default([]),
  
  // Assessment Status
  status: Joi.string().valid('draft', 'in_progress', 'completed', 'abandoned').default('draft'),
  startedAt: Joi.date().optional(),
  completedAt: Joi.date().optional(),
  timeSpent: Joi.number().min(0).optional(), // total time in seconds
  
  // Results and Scoring
  results: Joi.object({
    totalScore: Joi.number().min(0).optional(),
    percentage: Joi.number().min(0).max(100).optional(),
    grade: Joi.string().valid('A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F').optional(),
    
    // Psychometric Results
    personalityTraits: Joi.object({
      openness: Joi.number().min(0).max(100).optional(),
      conscientiousness: Joi.number().min(0).max(100).optional(),
      extraversion: Joi.number().min(0).max(100).optional(),
      agreeableness: Joi.number().min(0).max(100).optional(),
      neuroticism: Joi.number().min(0).max(100).optional()
    }).optional(),
    
    // Skills Assessment Results
    skillScores: Joi.object().pattern(
      Joi.string(),
      Joi.number().min(0).max(100)
    ).optional(),
    
    // Career Interest Results
    careerInterests: Joi.array().items(Joi.object({
      category: Joi.string().required(),
      score: Joi.number().min(0).max(100).required(),
      description: Joi.string().optional()
    })).optional(),
    
    // Cognitive Abilities
    cognitiveAbilities: Joi.object({
      analytical: Joi.number().min(0).max(100).optional(),
      creative: Joi.number().min(0).max(100).optional(),
      logical: Joi.number().min(0).max(100).optional(),
      verbal: Joi.number().min(0).max(100).optional(),
      numerical: Joi.number().min(0).max(100).optional(),
      spatial: Joi.number().min(0).max(100).optional()
    }).optional(),
    
    // Recommendations
    recommendations: Joi.array().items(Joi.object({
      type: Joi.string().valid('career_path', 'skill_development', 'course', 'job_role').required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      priority: Joi.string().valid('high', 'medium', 'low').default('medium'),
      confidence: Joi.number().min(0).max(100).optional()
    })).optional(),
    
    // Insights
    insights: Joi.array().items(Joi.string()).optional(),
    strengths: Joi.array().items(Joi.string()).optional(),
    areasForImprovement: Joi.array().items(Joi.string()).optional()
  }).optional(),
  
  // Metadata
  version: Joi.string().default('1.0'),
  language: Joi.string().valid('en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa').default('en'),
  tags: Joi.array().items(Joi.string()).default([]),
  
  // AI Analysis
  aiAnalysis: Joi.object({
    personalityType: Joi.string().optional(),
    careerFit: Joi.number().min(0).max(100).optional(),
    learningStyle: Joi.string().optional(),
    workStyle: Joi.string().optional(),
    communicationStyle: Joi.string().optional(),
    leadershipPotential: Joi.number().min(0).max(100).optional(),
    riskTolerance: Joi.string().valid('low', 'medium', 'high').optional()
  }).optional()
});

// Assessment update schema
const assessmentUpdateSchema = assessmentSchema.fork(
  Object.keys(assessmentSchema.describe().keys),
  (schema) => schema.optional()
);

// Assessment class
class Assessment {
  constructor(data) {
    this.data = data;
  }

  // Validate assessment data
  static validate(data) {
    const { error, value } = assessmentSchema.validate(data, { abortEarly: false });
    if (error) {
      throw new Error(`Validation error: ${error.details.map(d => d.message).join(', ')}`);
    }
    return value;
  }

  // Validate assessment update data
  static validateUpdate(data) {
    const { error, value } = assessmentUpdateSchema.validate(data, { abortEarly: false });
    if (error) {
      throw new Error(`Validation error: ${error.details.map(d => d.message).join(', ')}`);
    }
    return value;
  }

  // Start assessment
  start() {
    this.data.status = 'in_progress';
    this.data.startedAt = new Date();
    return this.data;
  }

  // Complete assessment
  complete() {
    this.data.status = 'completed';
    this.data.completedAt = new Date();
    
    if (this.data.startedAt) {
      this.data.timeSpent = Math.floor((this.data.completedAt - this.data.startedAt) / 1000);
    }
    
    return this.data;
  }

  // Add response
  addResponse(questionId, answer, timeSpent = 0) {
    if (this.data.status !== 'in_progress') {
      throw new Error('Cannot add response to non-active assessment');
    }

    // Remove existing response for this question if any
    this.data.responses = this.data.responses.filter(r => r.questionId !== questionId);
    
    // Add new response
    this.data.responses.push({
      questionId,
      answer,
      timeSpent,
      timestamp: new Date()
    });

    return this.data;
  }

  // Calculate progress percentage
  getProgressPercentage() {
    if (this.data.totalQuestions === 0) return 0;
    return Math.round((this.data.responses.length / this.data.totalQuestions) * 100);
  }

  // Check if assessment is complete
  isComplete() {
    return this.data.responses.length >= this.data.totalQuestions;
  }

  // Get time remaining
  getTimeRemaining() {
    if (!this.data.timeLimit || !this.data.startedAt) return null;
    
    const elapsed = Math.floor((new Date() - this.data.startedAt) / 1000);
    const remaining = this.data.timeLimit - elapsed;
    
    return Math.max(0, remaining);
  }

  // Check if time limit exceeded
  isTimeExceeded() {
    const timeRemaining = this.getTimeRemaining();
    return timeRemaining !== null && timeRemaining <= 0;
  }

  // Calculate score based on responses
  calculateScore() {
    if (!this.data.results) {
      this.data.results = {};
    }

    let totalScore = 0;
    let maxScore = 0;

    this.data.questions.forEach(question => {
      const response = this.data.responses.find(r => r.questionId === question.id);
      if (response) {
        const questionScore = this.calculateQuestionScore(question, response.answer);
        totalScore += questionScore * question.weight;
        maxScore += question.weight;
      }
    });

    this.data.results.totalScore = totalScore;
    this.data.results.percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    this.data.results.grade = this.calculateGrade(this.data.results.percentage);

    return this.data.results;
  }

  // Calculate score for individual question
  calculateQuestionScore(question, answer) {
    if (!question.correctAnswer) return 0;

    switch (question.type) {
      case 'multiple_choice':
        return answer === question.correctAnswer ? 1 : 0;
      
      case 'boolean':
        return answer === question.correctAnswer ? 1 : 0;
      
      case 'likert_scale':
        // For likert scale, score based on proximity to correct answer
        const diff = Math.abs(answer - question.correctAnswer);
        return Math.max(0, 1 - (diff / 4)); // Assuming 5-point scale
      
      case 'ranking':
        // For ranking, score based on order similarity
        if (Array.isArray(answer) && Array.isArray(question.correctAnswer)) {
          let matches = 0;
          const minLength = Math.min(answer.length, question.correctAnswer.length);
          for (let i = 0; i < minLength; i++) {
            if (answer[i] === question.correctAnswer[i]) matches++;
          }
          return matches / question.correctAnswer.length;
        }
        return 0;
      
      default:
        return 0;
    }
  }

  // Calculate grade based on percentage
  calculateGrade(percentage) {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    if (percentage >= 30) return 'D';
    return 'F';
  }

  // Get assessment summary
  getSummary() {
    return {
      id: this.data.id,
      title: this.data.title,
      type: this.data.assessmentType,
      status: this.data.status,
      progress: this.getProgressPercentage(),
      score: this.data.results?.percentage || 0,
      grade: this.data.results?.grade || 'N/A',
      timeSpent: this.data.timeSpent || 0,
      completedAt: this.data.completedAt
    };
  }
}

module.exports = {
  Assessment,
  assessmentSchema,
  assessmentUpdateSchema
};
