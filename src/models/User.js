const Joi = require('joi');

// User schema validation
const userSchema = Joi.object({
  // Basic Information
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).allow('').optional(), // Indian mobile number format
  dateOfBirth: Joi.date().max('now').required(),
  gender: Joi.string().valid('male', 'female', 'other', 'prefer_not_to_say').required(),
  
  // Location Information
  state: Joi.string().min(2).max(50).allow('').required(),
  city: Joi.string().min(2).max(50).allow('').required(),
  pincode: Joi.string().pattern(/^[1-9][0-9]{5}$/).allow('').required(), // Indian pincode format
  
  // Educational Background
  currentEducationLevel: Joi.string().valid(
    '10th', '12th', 'diploma', 'bachelor', 'master', 'phd', 'other'
  ).required(),
  currentStream: Joi.string().min(2).max(100).optional(),
  currentInstitution: Joi.string().min(2).max(200).optional(),
  expectedGraduationYear: Joi.number().integer().min(2024).max(2030).optional(),
  
  // Career Preferences
  careerInterests: Joi.array().items(Joi.string()).min(0).max(10).default([]),
  preferredJobTypes: Joi.array().items(Joi.string().valid(
    'full_time', 'part_time', 'internship', 'freelance', 'contract'
  )).min(0).default(['full_time']),
  preferredLocations: Joi.array().items(Joi.string()).min(0).max(5).default([]),
  salaryExpectation: Joi.object({
    min: Joi.number().min(0).required(),
    max: Joi.number().min(Joi.ref('min')).required(),
    currency: Joi.string().valid('INR', 'USD').default('INR')
  }).optional(),
  
  // Skills and Experience
  technicalSkills: Joi.array().items(Joi.string()).default([]),
  softSkills: Joi.array().items(Joi.string()).default([]),
  workExperience: Joi.array().items(Joi.object({
    company: Joi.string().required(),
    position: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().min(Joi.ref('startDate')).optional(),
    description: Joi.string().optional(),
    isCurrent: Joi.boolean().default(false)
  })).default([]),
  
  // Assessment Results
  psychometricProfile: Joi.object({
    personalityType: Joi.string().optional(),
    cognitiveAbilities: Joi.object({
      analytical: Joi.number().min(0).max(100).optional(),
      creative: Joi.number().min(0).max(100).optional(),
      logical: Joi.number().min(0).max(100).optional(),
      verbal: Joi.number().min(0).max(100).optional()
    }).optional(),
    interests: Joi.array().items(Joi.string()).default([]),
    strengths: Joi.array().items(Joi.string()).default([]),
    areasForImprovement: Joi.array().items(Joi.string()).default([]),
    assessmentDate: Joi.date().optional()
  }).optional(),
  
  // System Fields
  isActive: Joi.boolean().default(true),
  emailVerified: Joi.boolean().default(false),
  profileCompletionPercentage: Joi.number().min(0).max(100).default(0),
  lastLoginAt: Joi.date().optional(),
  preferences: Joi.object({
    notifications: Joi.object({
      email: Joi.boolean().default(true),
      sms: Joi.boolean().default(false),
      push: Joi.boolean().default(true)
    }).default({}),
    privacy: Joi.object({
      profileVisibility: Joi.string().valid('public', 'private', 'connections').default('public'),
      showContactInfo: Joi.boolean().default(false)
    }).default({})
  }).default({})
});

// User update schema (all fields optional)
const userUpdateSchema = userSchema.fork(
  Object.keys(userSchema.describe().keys),
  (schema) => schema.optional()
);

// User class with methods
class User {
  constructor(data) {
    this.data = data;
  }

  // Validate user data
  static validate(data) {
    const { error, value } = userSchema.validate(data, { abortEarly: false });
    if (error) {
      throw new Error(`Validation error: ${error.details.map(d => d.message).join(', ')}`);
    }
    return value;
  }

  // Validate user update data
  static validateUpdate(data) {
    const { error, value } = userUpdateSchema.validate(data, { abortEarly: false });
    if (error) {
      throw new Error(`Validation error: ${error.details.map(d => d.message).join(', ')}`);
    }
    return value;
  }

  // Calculate profile completion percentage
  calculateProfileCompletion() {
    const fields = [
      'firstName', 'lastName', 'email', 'dateOfBirth', 'gender',
      'state', 'city', 'pincode', 'currentEducationLevel',
      'careerInterests', 'preferredJobTypes', 'preferredLocations'
    ];
    
    const completedFields = fields.filter(field => 
      this.data[field] !== undefined && 
      this.data[field] !== null && 
      this.data[field] !== ''
    ).length;
    
    const percentage = Math.round((completedFields / fields.length) * 100);
    return percentage;
  }

  // Get user's career stage
  getCareerStage() {
    const educationLevel = this.data.currentEducationLevel;
    const workExperience = this.data.workExperience?.length || 0;
    
    if (educationLevel === '10th' || educationLevel === '12th') {
      return 'exploration';
    } else if (educationLevel === 'diploma' || educationLevel === 'bachelor') {
      return workExperience === 0 ? 'entry_level' : 'early_career';
    } else if (educationLevel === 'master') {
      return workExperience < 3 ? 'early_career' : 'mid_career';
    } else if (educationLevel === 'phd') {
      return 'advanced';
    }
    
    return 'transition';
  }

  // Get user's primary skills
  getPrimarySkills() {
    return {
      technical: this.data.technicalSkills || [],
      soft: this.data.softSkills || [],
      total: (this.data.technicalSkills?.length || 0) + (this.data.softSkills?.length || 0)
    };
  }

  // Check if user has completed psychometric assessment
  hasCompletedAssessment() {
    return this.data.psychometricProfile && 
           this.data.psychometricProfile.assessmentDate;
  }

  // Get user's location string
  getLocationString() {
    return `${this.data.city}, ${this.data.state}`;
  }

  // Get user's full name
  getFullName() {
    return `${this.data.firstName} ${this.data.lastName}`;
  }

  // Check if user is eligible for job recommendations
  isEligibleForRecommendations() {
    return this.data.profileCompletionPercentage >= 60 && 
           this.data.careerInterests?.length > 0;
  }

  // Get user's experience level
  getExperienceLevel() {
    const totalExperience = this.data.workExperience?.reduce((total, exp) => {
      const start = new Date(exp.startDate);
      const end = exp.isCurrent ? new Date() : new Date(exp.endDate);
      const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                    (end.getMonth() - start.getMonth());
      return total + months;
    }, 0) || 0;

    if (totalExperience === 0) return 'fresher';
    if (totalExperience < 12) return 'entry_level';
    if (totalExperience < 36) return 'early_career';
    if (totalExperience < 84) return 'mid_career';
    return 'senior';
  }
}

module.exports = {
  User,
  userSchema,
  userUpdateSchema
};
