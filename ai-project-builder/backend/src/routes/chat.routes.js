const express = require('express');
const router = express.Router();
const enhancedCodeGen = require('../services/enhancedCodeGeneration.service');

router.post('/generate', async (req, res, next) => {
  try {
    const { prompt, projectId, stack, conversationHistory } = req.body;
    
    // Parse stack if it's a string
    let stackObj = stack;
    if (typeof stack === 'string') {
      try {
        stackObj = JSON.parse(stack);
      } catch {
        stackObj = { frontend: 'react', backend: 'node' };
      }
    }

    // Extract project name from projectId or use default
    const projectName = projectId ? projectId.split('-')[0] : 'my-app';

    // Generate project
    const result = await enhancedCodeGen.generateProjectAdvanced({
      prompt,
      stack: stackObj,
      projectName,
      options: {}
    });

    // Return in format expected by ChatPage
    res.json({
      success: true,
      projectData: {
        projectId: result.projectId,
        files: result.files,
        applicationType: 'web',
        description: 'Project generated successfully'
      }
    });

  } catch (error) {
    console.error('Generation error:', error);
    next(error);
  }
});

module.exports = router;