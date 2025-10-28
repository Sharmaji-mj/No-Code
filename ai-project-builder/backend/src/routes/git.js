// // // const express = require('express');
// // // const router = express.Router();
// // // const auth = require('../middleware/auth');
// // // const { execSync } = require('child_process');
// // // const fs = require('fs');
// // // const path = require('path');

// // // router.post('/clone', auth, async (req, res) => {
// // //   try {
// // //     const { url, projectId } = req.body;
    
// // //     if (!url) {
// // //       return res.status(400).json({ error: 'Git URL is required' });
// // //     }

// // //     // Create a temporary directory for cloning
// // //     const tempDir = path.join(__dirname, '../../temp', projectId);
    
// // //     // Remove existing directory if it exists
// // //     if (fs.existsSync(tempDir)) {
// // //       fs.rmSync(tempDir, { recursive: true });
// // //     }
    
// // //     // Create directory
// // //     fs.mkdirSync(tempDir, { recursive: true });
    
// // //     // Clone the repository
// // //     try {
// // //       execSync(`git clone ${url} ${tempDir}`, { stdio: 'pipe' });
// // //     } catch (error) {
// // //       console.error('Git clone error:', error);
// // //       return res.status(500).json({ error: 'Failed to clone repository' });
// // //     }
    
// // //     // Read all files
// // //     const files = [];
// // //     const readDirectory = (dir, basePath = '') => {
// // //       const items = fs.readdirSync(dir);
      
// // //       for (const item of items) {
// // //         const fullPath = path.join(dir, item);
// // //         const relativePath = path.join(basePath, item);
// // //         const stat = fs.statSync(fullPath);
        
// // //         if (stat.isDirectory()) {
// // //           readDirectory(fullPath, relativePath);
// // //         } else {
// // //           const content = fs.readFileSync(fullPath, 'utf8');
// // //           const ext = item.split('.').pop()?.toLowerCase();
          
// // //           let type = 'plaintext';
// // //           switch (ext) {
// // //             case 'js':
// // //             case 'jsx':
// // //               type = 'javascript';
// // //               break;
// // //             case 'ts':
// // //             case 'tsx':
// // //               type = 'typescript';
// // //               break;
// // //             case 'css':
// // //               type = 'css';
// // //               break;
// // //             case 'html':
// // //               type = 'html';
// // //               break;
// // //             case 'json':
// // //               type = 'json';
// // //               break;
// // //             case 'md':
// // //               type = 'markdown';
// // //               break;
// // //           }
          
// // //           files.push({
// // //             name: relativePath,
// // //             content,
// // //             type
// // //           });
// // //         }
// // //       }
// // //     };
    
// // //     readDirectory(tempDir);
    
// // //     // Clean up temporary directory
// // //     fs.rmSync(tempDir, { recursive: true });
    
// // //     res.json({ files });
// // //   } catch (error) {
// // //     console.error('Clone error:', error);
// // //     res.status(500).json({ error: 'Failed to clone repository' });
// // //   }
// // // });

// // // module.exports = router;


// // // backend/src/routes/git.js
// // const express = require('express');
// // const auth = require('../middleware/auth');
// // const simpleGit = require('simple-git');
// // const Project = require('../models/Project');
// // const gitService = require('../services/gitService');

// // const router = express.Router();

// // // Clone repository
// // router.post('/clone', auth, async (req, res) => {
// //   try {
// //     const { projectId, repoUrl } = req.body;
    
// //     // Get project details
// //     const project = await Project.findById(projectId);
// //     if (!project) {
// //       return res.status(404).json({ error: 'Project not found' });
// //     }
    
// //     // Check if user owns the project
// //     if (project.userId.toString() !== req.user.id) {
// //       return res.status(401).json({ message: 'Not authorized' });
// //     }
    
// //     // Clone the repository
// //     const files = await gitService.cloneRepository(repoUrl);
    
// //     // Update project with cloned files
// //     project.files = files;
// //     await project.save();
    
// //     res.json({ files });
// //   } catch (error) {
// //     console.error('Error cloning repository:', error);
// //     res.status(500).json({ error: 'Failed to clone repository' });
// //   }
// // });

// // // Get repository info
// // router.post('/info', auth, async (req, res) => {
// //   try {
// //     const { repoUrl } = req.body;
    
// //     // Get repository info
// //     const info = await gitService.getRepositoryInfo(repoUrl);
    
// //     res.json(info);
// //   } catch (error) {
// //     console.error('Error getting repository info:', error);
// //     res.status(500).json({ error: 'Failed to get repository info' });
// //   }
// // });

// // module.exports = router;


// // backend/src/routes/git.js
// const express = require('express');
// const auth = require('../middleware/auth');
// const simpleGit = require('simple-git');
// const Project = require('../models/Project');
// const gitService = require('../services/gitService');

// const router = express.Router();

// // Clone repository
// router.post('/clone', auth, async (req, res) => {
//   try {
//     const { projectId, repoUrl } = req.body;
    
//     // Get project details
//     const project = await Project.findById(projectId);
//     if (!project) {
//       return res.status(404).json({ error: 'Project not found' });
//     }
    
//     // Check if user owns the project
//     if (project.userId.toString() !== req.user.id) {
//       return res.status(401).json({ message: 'Not authorized' });
//     }
    
//     // Clone the repository
//     const files = await gitService.cloneRepository(repoUrl);
    
//     // Update project with cloned files
//     project.files = files;
//     await project.save();
    
//     res.json({ files });
//   } catch (error) {
//     console.error('Error cloning repository:', error);
//     res.status(500).json({ error: 'Failed to clone repository' });
//   }
// });

// // Get repository info
// router.post('/info', auth, async (req, res) => {
//   try {
//     const { repoUrl } = req.body;
    
//     // Get repository info
//     const info = await gitService.getRepositoryInfo(repoUrl);
    
//     res.json(info);
//   } catch (error) {
//     console.error('Error getting repository info:', error);
//     res.status(500).json({ error: 'Failed to get repository info' });
//   }
// });

// module.exports = router;


// backend/src/routes/git.js
const express = require('express');
const auth = require('../middleware/auth');
const { Project } = require('../models');
const gitService = require('../services/gitService');

const router = express.Router();

// Clone repository
router.post('/clone', auth, async (req, res) => {
  try {
    const { projectId, repoUrl } = req.body;
    
    // Get project details
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Check if user owns the project
    if (project.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Clone the repository
    const files = await gitService.cloneRepository(repoUrl);
    
    // Update project with cloned files
    await project.update({ files });
    
    res.json({ files });
  } catch (error) {
    console.error('Error cloning repository:', error);
    res.status(500).json({ error: 'Failed to clone repository' });
  }
});

// Get repository info
router.post('/info', auth, async (req, res) => {
  try {
    const { repoUrl } = req.body;
    
    // Get repository info
    const info = await gitService.getRepositoryInfo(repoUrl);
    
    res.json(info);
  } catch (error) {
    console.error('Error getting repository info:', error);
    res.status(500).json({ error: 'Failed to get repository info' });
  }
});

module.exports = router;