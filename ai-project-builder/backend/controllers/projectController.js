// backend/controllers/projectController.js
const { Project } = require('../models');

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    console.log('Fetching all projects...');
    
    const projects = await Project.findAll({
      order: [['updated_at', 'DESC']]
    });
    
    console.log(`Found ${projects.length} projects`);
    
    // Convert to JSON to trigger getters
    const projectsData = projects.map(p => p.toJSON());
    
    res.json(projectsData);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ 
      error: 'Failed to fetch projects',
      message: error.message
    });
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Fetching project:', id);
    
    const project = await Project.findByPk(id);
    
    if (!project) {
      console.log('Project not found:', id);
      return res.status(404).json({ 
        error: 'Project not found',
        message: `No project found with ID: ${id}` 
      });
    }
    
    // Convert to JSON to trigger getters (parses JSON strings)
    const projectData = project.toJSON();
    
    console.log('Project fetched successfully:', projectData.name);
    
    res.json(projectData);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ 
      error: 'Failed to fetch project',
      message: error.message
    });
  }
};

// Create project
exports.createProject = async (req, res) => {
  try {
    const { name, description, type, status, chatHistory, files } = req.body;
    
    console.log('Creating project:', name);
    console.log('Request body:', req.body);
    
    // Create project with provided data
    const project = await Project.create({
      name: name || 'Untitled Project',
      description: description || '',
      type: type || 'mejuvante',
      status: status || 'active',
      chatHistory: chatHistory || '[]',
      files: files || '[]'
    });
    
    console.log('Project created successfully:', project.id);
    
    // Return JSON to trigger getters
    res.status(201).json(project.toJSON());
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ 
      error: 'Failed to create project',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    console.log('Updating project:', id);
    console.log('Updates:', Object.keys(updates));
    
    const project = await Project.findByPk(id);
    
    if (!project) {
      console.log('Project not found:', id);
      return res.status(404).json({ 
        error: 'Project not found',
        message: `No project found with ID: ${id}` 
      });
    }
    
    // Update project with provided data
    // The model setters will handle JSON stringification
    await project.update(updates);
    
    console.log('Project updated successfully');
    
    // Return JSON to trigger getters
    res.json(project.toJSON());
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ 
      error: 'Failed to update project',
      message: error.message
    });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Deleting project:', id);
    
    const project = await Project.findByPk(id);
    
    if (!project) {
      console.log('Project not found:', id);
      return res.status(404).json({ 
        error: 'Project not found',
        message: `No project found with ID: ${id}` 
      });
    }
    
    await project.destroy();
    
    console.log('Project deleted successfully');
    
    res.json({ 
      success: true,
      message: 'Project deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ 
      error: 'Failed to delete project',
      message: error.message
    });
  }
};