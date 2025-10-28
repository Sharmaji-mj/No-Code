const express = require('express');
const router = express.Router();
const validationService = require('../services/validation.service');

router.post('/', async (req, res, next) => {
  try {
    const { projectId, files } = req.body;
    
    const validation = await validationService.validateProject({
      projectId,
      files
    });

    // Transform to match ChatPage format
    const result = {
      score: validation.summary.score,
      status: validation.summary.status === 'passed' ? 'excellent' : 
              validation.summary.score > 80 ? 'good' :
              validation.summary.score > 60 ? 'needs-improvement' : 'critical',
      message: `Code quality: ${validation.summary.status}`,
      errors: validation.errors,
      warnings: validation.warnings,
      suggestions: validation.suggestions,
      security: [],
      missingDependencies: [],
      fixSuggestions: []
    };

    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;