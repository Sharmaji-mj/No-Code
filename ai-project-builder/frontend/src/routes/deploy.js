const express = require('express');
const router = express.Router();
const { execSync } = require('child_process');
const auth = require('../middleware/auth');

// Deploy to AWS
router.post('/aws', auth, async (req, res) => {
  try {
    const { projectId } = req.body;
    
    // Run the deployment script
    execSync('npm run deploy:aws', { stdio: 'inherit' });
    
    res.json({
      success: true,
      message: 'Deployment initiated successfully! Your project will be available on AWS shortly.'
    });
  } catch (error) {
    console.error('Deployment error:', error);
    res.status(500).json({
      error: 'Deployment failed. Please check the server logs for details.'
    });
  }
});

// General deploy endpoint
router.post('/', auth, async (req, res) => {
  try {
    const { platform } = req.body;
    
    if (platform === 'aws') {
      // Run the AWS deployment script
      execSync('npm run deploy:aws', { stdio: 'inherit' });
      
      res.json({
        success: true,
        message: 'AWS deployment initiated successfully! Your project will be available shortly.'
      });
    } else {
      res.status(400).json({
        error: `Deployment to ${platform} is not supported yet.`
      });
    }
  } catch (error) {
    console.error('Deployment error:', error);
    res.status(500).json({
      error: 'Deployment failed. Please check the server logs for details.'
    });
  }
});

module.exports = router;