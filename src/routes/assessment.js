const express = require('express');
const router = express.Router();
const AssessmentController = require('../controllers/assessmentController');
const { authenticateToken, checkOwnership } = require('../middleware/auth');

// All assessment routes require authentication
router.use(authenticateToken);

// Assessment CRUD operations
router.post('/', AssessmentController.createAssessment);
router.get('/', AssessmentController.getUserAssessments);
router.get('/:assessmentId', AssessmentController.getAssessment);

// Assessment execution
router.post('/:assessmentId/start', AssessmentController.startAssessment);
router.post('/:assessmentId/responses', AssessmentController.submitResponse);
router.post('/:assessmentId/complete', AssessmentController.completeAssessment);

module.exports = router;
