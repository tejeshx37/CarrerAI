const express = require('express');
const router = express.Router();
const CareerController = require('../controllers/careerController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Public routes (market data accessible without authentication)
router.get('/trends', optionalAuth, CareerController.getJobMarketTrends);
router.get('/skills', optionalAuth, CareerController.getSkillDemandAnalysis);
router.get('/salary', optionalAuth, CareerController.getSalaryInsights);
router.get('/emerging-roles', optionalAuth, CareerController.getEmergingJobRoles);

// Protected routes (require authentication)
router.get('/recommendations', authenticateToken, CareerController.getCareerRecommendations);
router.get('/skill-gaps', authenticateToken, CareerController.getSkillGapAnalysis);
router.post('/roadmap', authenticateToken, CareerController.generateCareerRoadmap);

module.exports = router;
