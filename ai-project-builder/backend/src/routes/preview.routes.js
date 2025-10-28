// router.get('/:projectId', async (req, res, next) => {
//   try {
//     const { projectId } = req.params;
//     const projectPath = path.join(
//       process.env.GENERATED_PROJECTS_PATH || './generated',
//       projectId
//     );

//     // Try multiple locations
//     const possiblePaths = [
//       path.join(projectPath, 'frontend', 'dist', 'index.html'),
//       path.join(projectPath, 'frontend', 'index.html'),
//       path.join(projectPath, 'index.html')
//     ];

//     for (const indexPath of possiblePaths) {
//       if (await fs.pathExists(indexPath)) {
//         return res.sendFile(indexPath);
//       }
//     }

//     return res.status(404).send(`
//       <html>
//         <body style="font-family: sans-serif; padding: 40px; text-align: center;">
//           <h1>⚠️ Preview Not Found</h1>
//           <p>The preview for this project is not ready yet.</p>
//           <p>Project ID: ${projectId}</p>
//         </body>
//       </html>
//     `);
//   } catch (error) {
//     next(error);
//   }
// });

// // Serve any assets
// router.get('/:projectId/*', async (req, res, next) => {
//   try {
//     const { projectId } = req.params;
//     const filePath = req.params[0];
    
//     const projectPath = path.join(
//       process.env.GENERATED_PROJECTS_PATH || './generated',
//       projectId
//     );

//     const possiblePaths = [
//       path.join(projectPath, 'frontend', 'dist', filePath),
//       path.join(projectPath, 'frontend', filePath),
//       path.join(projectPath, filePath)
//     ];

//     for (const fullPath of possiblePaths) {
//       if (await fs.pathExists(fullPath)) {
//         return res.sendFile(fullPath);
//       }
//     }

//     res.status(404).send('Asset not found');
//   } catch (error) {
//     next(error);
//   }
// });
// router.post('/create', async (req, res, next) => {
//   try {
//     const { projectId, files } = req.body;
    
//     if (!projectId) {
//       return res.status(400).json({ error: 'projectId required' });
//     }

//     const projectPath = path.join(
//       process.env.GENERATED_PROJECTS_PATH || './generated',
//       projectId
//     );

//     // If files provided, write them
//     if (files && files.length > 0) {
//       for (const file of files) {
//         const filePath = path.join(projectPath, file.path);
//         await fs.ensureDir(path.dirname(filePath));
//         await fs.writeFile(filePath, file.content, 'utf8');
//       }
//     }

//     // Build preview
//     const codeGenService = require('../services/codeGeneration.service');
//     await codeGenService.buildProject(projectPath, { frontend: 'react' });

//     res.json({
//       success: true,
//       previewUrl: `/api/preview/${projectId}`
//     });
//   } catch (error) {
//     next(error);
//   }
// });

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');

// Create preview
router.post('/create', async (req, res, next) => {
  try {
    const { projectId, files } = req.body;
    
    if (!projectId) {
      return res.status(400).json({ error: 'projectId required' });
    }

    const projectPath = path.join(
      process.env.GENERATED_PROJECTS_PATH || './generated',
      projectId
    );

    // If files provided, save them
    if (files && files.length > 0) {
      for (const file of files) {
        const filePath = path.join(projectPath, file.path);
        await fs.ensureDir(path.dirname(filePath));
        await fs.writeFile(filePath, file.content, 'utf8');
      }
    }

    // Build preview
    // const codeGenService = require('../services/enhancedCodeGeneration.service');
    await codeGenService.buildAdvancedPreview(projectPath, { frontend: 'react' }, files || []);

    res.json({
      success: true,
      previewUrl: `/api/preview/${projectId}`
    });
  } catch (error) {
    next(error);
  }
});

// Serve preview
router.get('/:projectId', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const projectPath = path.join(
      process.env.GENERATED_PROJECTS_PATH || './generated',
      projectId
    );

    // Try multiple locations
    const possiblePaths = [
      path.join(projectPath, 'frontend', 'dist', 'index.html'),
      path.join(projectPath, 'frontend', 'index.html'),
      path.join(projectPath, 'index.html')
    ];

    for (const indexPath of possiblePaths) {
      if (await fs.pathExists(indexPath)) {
        return res.sendFile(indexPath);
      }
    }

    // Return 404 with helpful message
    res.status(404).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Preview Not Found</title>
          <style>
            body {
              font-family: system-ui;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: #f5f5f5;
            }
            .error {
              text-align: center;
              padding: 40px;
              background: white;
              border-radius: 12px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
          </style>
        </head>
        <body>
          <div class="error">
            <h1>⚠️ Preview Not Found</h1>
            <p>Project ID: ${projectId}</p>
            <p>Try clicking "Create Preview" again</p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    next(error);
  }
});

module.exports = router;