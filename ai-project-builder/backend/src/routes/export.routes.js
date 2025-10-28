const express = require('express');
const router = express.Router();
const archiver = require('archiver');
const path = require('path');
const fs = require('fs-extra');

// Prepare export (for ChatPage)
router.post('/prepare', async (req, res, next) => {
  try {
    const { files, projectName } = req.body;
    
    // Just return download URL
    res.json({
      success: true,
      downloadUrl: `/api/export/zip/${projectName || 'project'}`
    });
  } catch (error) {
    next(error);
  }
});

// Export as ZIP
router.get('/zip/:projectId', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const projectPath = path.join(
      process.env.GENERATED_PROJECTS_PATH || './generated',
      projectId
    );

    if (!await fs.pathExists(projectPath)) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${projectId}.zip"`);

    const archive = archiver('zip', { zlib: { level: 9 } });
    
    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(res);
    archive.directory(projectPath, projectId);
    await archive.finalize();

  } catch (error) {
    next(error);
  }
});

module.exports = router;