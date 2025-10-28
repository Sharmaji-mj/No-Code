// // backend/src/routes/projects.js

// const express = require('express');
// const jwt = require('jsonwebtoken');
// const Project = require('../models/Project'); // IMPORT THE MODEL

// const router = express.Router();

// // Middleware to verify token
// const authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
    
//     if (!token) {
//       return res.status(401).json({ message: 'Access denied. No token provided.' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key');
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// // Get all projects for a user
// router.get('/', authMiddleware, async (req, res) => {
//   try {
//     const projects = await Project.findAll({
//       where: { user_id: req.user.id }, // Use snake_case
//       order: [['created_at', 'DESC']]
//     });
//     res.json(projects);
//   } catch (error) {
//     console.error('Get projects error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Create a new project
// router.post('/', authMiddleware, async (req, res) => {
//   try {
//     const { name, description, type } = req.body;
    
//     const project = await Project.create({
//       name,
//       description,
//       type,
//       user_id: req.user.id, // Use snake_case
//     });
    
//     res.status(201).json(project);
//   } catch (error) {
//     console.error('Create project error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get project by ID
// router.get('/:id', authMiddleware, async (req, res) => {
//   try {
//     const project = await Project.findByPk(req.params.id);
    
//     if (!project || project.user_id !== req.user.id) {
//       return res.status(404).json({ message: 'Project not found or not authorized' });
//     }
    
//     res.json(project);
//   } catch (error) {
//     console.error('Get project error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Update a project
// router.put('/:id', authMiddleware, async (req, res) => {
//   try {
//     const project = await Project.findByPk(req.params.id);
    
//     if (!project || project.user_id !== req.user.id) {
//       return res.status(404).json({ message: 'Project not found or not authorized' });
//     }
    
//     await project.update(req.body);
//     res.json(project);
//   } catch (error) {
//     console.error('Update project error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Delete a project
// router.delete('/:id', authMiddleware, async (req, res) => {
//   try {
//     const project = await Project.findByPk(req.params.id);
    
//     if (!project || project.user_id !== req.user.id) {
//       return res.status(404).json({ message: 'Project not found or not authorized' });
//     }
    
//     await project.destroy();
//     res.json({ message: 'Project deleted' });
//   } catch (error) {
//     console.error('Delete project error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get file content
// router.get('/:id/files/:fileName', authMiddleware, async (req, res) => {
//   try {
//     const project = await Project.findByPk(req.params.id);
    
//     if (!project || project.user_id !== req.user.id) {
//       return res.status(404).json({ message: 'Project not found or not authorized' });
//     }
    
//     const fileName = req.params.fileName;
//     const files = project.files || {};
//     const content = files[fileName] || '';
    
//     res.json({ fileName, content });
//   } catch (error) {
//     console.error('Get file content error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Save file content
// router.post('/:id/files', authMiddleware, async (req, res) => {
//   try {
//     const { fileName, content } = req.body;
    
//     const project = await Project.findByPk(req.params.id);
    
//     if (!project || project.user_id !== req.user.id) {
//       return res.status(404).json({ message: 'Project not found or not authorized' });
//     }
    
//     const files = project.files || {};
//     files[fileName] = content;
    
//     await project.update({ files });
    
//     res.json({ message: 'File saved successfully' });
//   } catch (error) {
//     console.error('Save file error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // --- NEW ROUTE TO CREATE A PROJECT FROM THE AI CHAT ---
// router.post('/from-chat', authMiddleware, async (req, res) => {
//   try {
//     const { name, files } = req.body; // Expecting name and files from the AI

//     if (!name || !files) {
//       return res.status(400).json({ message: 'Project name and files are required.' });
//     }

//     const project = await Project.create({
//       name,
//       files,
//       user_id: req.user.id,
//       type: 'mejuvante',
//     });

//     res.status(201).json(project);
//   } catch (error) {
//     console.error('Create project from chat error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;


// backend/src/routes/projects.js

const express = require('express');
const jwt = require('jsonwebtoken');
const { Project } = require('../models'); // Make sure to destructure Project
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Middleware to verify token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Helper function to format project data for frontend
const formatProjectForFrontend = (project) => {
  const projectData = project.toJSON();
  
  // Convert snake_case to camelCase for frontend
  return {
    id: projectData.id,
    name: projectData.name,
    description: projectData.description,
    type: projectData.type,
    status: projectData.status,
    files: projectData.files ? (typeof projectData.files === 'string' ? JSON.parse(projectData.files) : projectData.files) : [],
    chatHistory: projectData.chatHistory ? (typeof projectData.chatHistory === 'string' ? JSON.parse(projectData.chatHistory) : projectData.chatHistory) : [],
    userId: projectData.user_id,
    createdAt: projectData.created_at,
    updatedAt: projectData.updated_at
  };
};

// Get all projects for a user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { user_id: req.user.userId }, // Use userId from decoded token
      order: [['created_at', 'DESC']]
    });
    
    // Format all projects for frontend
    const formattedProjects = projects.map(formatProjectForFrontend);
    
    res.json(formattedProjects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new project
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, type, status, files, chatHistory } = req.body;
    
    // Prepare files data
    let filesData = null;
    if (files) {
      filesData = typeof files === 'string' ? files : JSON.stringify(files);
    }
    
    // Prepare chat history data
    let chatHistoryData = null;
    if (chatHistory) {
      chatHistoryData = typeof chatHistory === 'string' ? chatHistory : JSON.stringify(chatHistory);
    }
    
    const project = await Project.create({
      id: uuidv4(),
      name,
      description: description || '',
      type: type || 'mejuvante',
      status: status || 'active',
      files: filesData || JSON.stringify({}),
      chatHistory: chatHistoryData || JSON.stringify([]),
      user_id: req.user.userId, // Use userId from decoded token
    });
    
    res.status(201).json(formatProjectForFrontend(project));
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get project by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    
    if (!project || project.user_id !== req.user.userId) {
      return res.status(404).json({ message: 'Project not found or not authorized' });
    }
    
    res.json(formatProjectForFrontend(project));
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a project
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    
    if (!project || project.user_id !== req.user.userId) {
      return res.status(404).json({ message: 'Project not found or not authorized' });
    }
    
    const { name, description, type, status, files, chatHistory } = req.body;
    
    // Prepare update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (status !== undefined) updateData.status = status;
    
    if (files !== undefined) {
      updateData.files = typeof files === 'string' ? files : JSON.stringify(files);
    }
    
    if (chatHistory !== undefined) {
      updateData.chatHistory = typeof chatHistory === 'string' ? chatHistory : JSON.stringify(chatHistory);
    }
    
    await project.update(updateData);
    
    // Get the updated project
    const updatedProject = await Project.findByPk(req.params.id);
    res.json(formatProjectForFrontend(updatedProject));
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a project
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    
    if (!project || project.user_id !== req.user.userId) {
      return res.status(404).json({ message: 'Project not found or not authorized' });
    }
    
    await project.destroy();
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get file content
router.get('/:id/files/:fileName', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    
    if (!project || project.user_id !== req.user.userId) {
      return res.status(404).json({ message: 'Project not found or not authorized' });
    }
    
    const fileName = req.params.fileName;
    const files = project.files ? (typeof project.files === 'string' ? JSON.parse(project.files) : project.files) : {};
    const content = files[fileName] || '';
    
    res.json({ fileName, content });
  } catch (error) {
    console.error('Get file content error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Save file content
router.post('/:id/files', authMiddleware, async (req, res) => {
  try {
    const { fileName, content } = req.body;
    
    const project = await Project.findByPk(req.params.id);
    
    if (!project || project.user_id !== req.user.userId) {
      return res.status(404).json({ message: 'Project not found or not authorized' });
    }
    
    const files = project.files ? (typeof project.files === 'string' ? JSON.parse(project.files) : project.files) : {};
    files[fileName] = content;
    
    await project.update({ files: JSON.stringify(files) });
    
    res.json({ message: 'File saved successfully' });
  } catch (error) {
    console.error('Save file error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a project from the AI chat
router.post('/from-chat', authMiddleware, async (req, res) => {
  try {
    const { name, files, chatHistory, description, type, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Project name is required.' });
    }

    // Prepare files data
    let filesData = null;
    if (files) {
      filesData = typeof files === 'string' ? files : JSON.stringify(files);
    } else {
      filesData = JSON.stringify({});
    }
    
    // Prepare chat history data
    let chatHistoryData = null;
    if (chatHistory) {
      chatHistoryData = typeof chatHistory === 'string' ? chatHistory : JSON.stringify(chatHistory);
    } else {
      chatHistoryData = JSON.stringify([]);
    }

    const project = await Project.create({
      id: uuidv4(),
      name,
      description: description || '',
      type: type || 'mejuvante',
      status: status || 'active',
      files: filesData,
      chatHistory: chatHistoryData,
      user_id: req.user.userId,
    });

    res.status(201).json(formatProjectForFrontend(project));
  } catch (error) {
    console.error('Create project from chat error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;