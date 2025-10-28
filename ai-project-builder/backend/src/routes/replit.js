const express = require('express');
const router = express.Router();
const { exec, spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Store running processes and project data
const runningServers = new Map();
const projectStorage = new Map();

// Temporary directory for project execution
const PROJECTS_DIR = path.join(__dirname, '../../temp_projects');

// Ensure projects directory exists
(async () => {
  try {
    await fs.mkdir(PROJECTS_DIR, { recursive: true });
    console.log('📁 Projects directory initialized:', PROJECTS_DIR);
  } catch (error) {
    console.error('Failed to create projects directory:', error);
  }
})();

// =====================================================
// 🚀 CODE EXECUTION ENDPOINT
// =====================================================
router.post('/execute', async (req, res) => {
  try {
    const { projectId, command, files } = req.body;

    if (!command) {
      return res.status(400).json({ error: 'Command is required' });
    }

    console.log(`⚡ Executing: ${command} for project ${projectId}`);

    const startTime = Date.now();
    let output = '';
    let error = '';

    // Create project directory if files provided
    if (files && files.length > 0) {
      await createProjectFiles(projectId, files);
    }

    const projectPath = path.join(PROJECTS_DIR, projectId);

    try {
      // Execute command in project directory
      const { stdout, stderr } = await execAsync(command, {
        cwd: projectPath,
        timeout: 30000, // 30 second timeout
        maxBuffer: 1024 * 1024 // 1MB buffer
      });

      output = stdout;
      if (stderr) error = stderr;

    } catch (execError) {
      error = execError.message || execError.stderr || 'Execution failed';
      output = execError.stdout || '';
    }

    const executionTime = Date.now() - startTime;

    const result = {
      success: !error,
      execution: {
        output: output || 'No output',
        error: error || null,
        exitCode: error ? 1 : 0,
        executionTime
      },
      timestamp: new Date().toISOString()
    };

    console.log(`✅ Execution completed in ${executionTime}ms`);

    res.json(result);

  } catch (error) {
    console.error('❌ Execution error:', error);
    res.status(500).json({
      error: 'Code execution failed',
      message: error.message
    });
  }
});

// =====================================================
// 📦 INSTALL NPM PACKAGES
// =====================================================
router.post('/install', async (req, res) => {
  try {
    const { projectId, packages } = req.body;

    if (!packages || !Array.isArray(packages) || packages.length === 0) {
      return res.status(400).json({ error: 'Packages array is required' });
    }

    console.log(`📦 Installing packages for ${projectId}:`, packages);

    const projectPath = path.join(PROJECTS_DIR, projectId);
    
    // Ensure project directory exists
    await fs.mkdir(projectPath, { recursive: true });

    const packageList = packages.join(' ');
    const command = `npm install ${packageList} --save`;

    const { stdout, stderr } = await execAsync(command, {
      cwd: projectPath,
      timeout: 120000 // 2 minute timeout for installations
    });

    console.log('✅ Packages installed successfully');

    res.json({
      success: true,
      message: `Installed: ${packageList}`,
      output: stdout,
      packages
    });

  } catch (error) {
    console.error('❌ Package installation error:', error);
    res.status(500).json({
      error: 'Package installation failed',
      message: error.message
    });
  }
});

// =====================================================
// 🌐 START DEVELOPMENT SERVER
// =====================================================
router.post('/dev-server/start', async (req, res) => {
  try {
    const { projectId, files, framework = 'static', port = 3000 } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    // Check if server already running
    if (runningServers.has(projectId)) {
      const existing = runningServers.get(projectId);
      return res.json({
        success: true,
        message: 'Server already running',
        running: true,
        port: existing.port,
        url: `http://localhost:${existing.port}`,
        logs: existing.logs || []
      });
    }

    console.log(`🚀 Starting dev server for ${projectId} (${framework})`);

    // Create project files
    if (files && files.length > 0) {
      await createProjectFiles(projectId, files);
    }

    const projectPath = path.join(PROJECTS_DIR, projectId);

    // Determine start command based on framework
    let startCommand;
    let args = [];

    switch (framework) {
      case 'react':
        // Check if package.json exists, if not create it
        await ensurePackageJson(projectPath, 'react');
        startCommand = 'npm';
        args = ['run', 'dev'];
        break;
      
      case 'vue':
        await ensurePackageJson(projectPath, 'vue');
        startCommand = 'npm';
        args = ['run', 'dev'];
        break;
      
      case 'express':
        startCommand = 'node';
        args = ['server.js']; // Assuming main file is server.js
        break;
      
      case 'static':
      default:
        // Use simple HTTP server for static files
        startCommand = 'npx';
        args = ['http-server', '-p', port.toString(), '-c-1'];
        break;
    }

    // Spawn the process
    const serverProcess = spawn(startCommand, args, {
      cwd: projectPath,
      stdio: 'pipe',
      shell: true
    });

    const logs = [];

    serverProcess.stdout.on('data', (data) => {
      const log = data.toString();
      logs.push(log);
      console.log(`[${projectId}] ${log}`);
    });

    serverProcess.stderr.on('data', (data) => {
      const log = data.toString();
      logs.push(log);
      console.error(`[${projectId}] ${log}`);
    });

    serverProcess.on('error', (error) => {
      console.error(`❌ Server process error for ${projectId}:`, error);
      runningServers.delete(projectId);
    });

    serverProcess.on('close', (code) => {
      console.log(`🛑 Server closed for ${projectId} with code ${code}`);
      runningServers.delete(projectId);
    });

    // Store server info
    runningServers.set(projectId, {
      process: serverProcess,
      port,
      framework,
      logs,
      startedAt: new Date().toISOString()
    });

    // Wait a bit for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));

    res.json({
      success: true,
      message: 'Dev server started',
      running: true,
      port,
      url: `http://localhost:${port}`,
      framework,
      logs: logs.slice(-10) // Last 10 log lines
    });

  } catch (error) {
    console.error('❌ Dev server start error:', error);
    res.status(500).json({
      error: 'Failed to start dev server',
      message: error.message
    });
  }
});

// =====================================================
// 🛑 STOP DEVELOPMENT SERVER
// =====================================================
router.post('/dev-server/stop', async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    const server = runningServers.get(projectId);

    if (!server) {
      return res.json({
        success: true,
        message: 'Server not running'
      });
    }

    console.log(`🛑 Stopping dev server for ${projectId}`);

    // Kill the process
    server.process.kill('SIGTERM');
    runningServers.delete(projectId);

    res.json({
      success: true,
      message: 'Dev server stopped'
    });

  } catch (error) {
    console.error('❌ Dev server stop error:', error);
    res.status(500).json({
      error: 'Failed to stop dev server',
      message: error.message
    });
  }
});

// =====================================================
// 📋 GET SERVER LOGS
// =====================================================
router.get('/dev-server/logs/:projectId', (req, res) => {
  try {
    const { projectId } = req.params;
    const server = runningServers.get(projectId);

    if (!server) {
      return res.status(404).json({
        error: 'Server not found',
        running: false
      });
    }

    res.json({
      success: true,
      running: true,
      logs: server.logs || [],
      startedAt: server.startedAt
    });

  } catch (error) {
    console.error('❌ Logs fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch logs',
      message: error.message
    });
  }
});

// =====================================================
// 🔥 HOT RELOAD FILES
// =====================================================
router.post('/hot-reload', async (req, res) => {
  try {
    const { projectId, files } = req.body;

    if (!projectId || !files) {
      return res.status(400).json({ error: 'Project ID and files are required' });
    }

    console.log(`🔥 Hot reloading ${files.length} files for ${projectId}`);

    await createProjectFiles(projectId, files);

    res.json({
      success: true,
      message: `Hot reloaded ${files.length} files`,
      filesUpdated: files.length
    });

  } catch (error) {
    console.error('❌ Hot reload error:', error);
    res.status(500).json({
      error: 'Hot reload failed',
      message: error.message
    });
  }
});

// =====================================================
// 📁 GET FILE TREE
// =====================================================
router.get('/files/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const projectPath = path.join(PROJECTS_DIR, projectId);

    const fileTree = await buildFileTree(projectPath);

    res.json({
      success: true,
      projectId,
      files: fileTree
    });

  } catch (error) {
    console.error('❌ File tree error:', error);
    res.status(500).json({
      error: 'Failed to fetch file tree',
      message: error.message
    });
  }
});

// =====================================================
// 📝 UPDATE FILE
// =====================================================
router.post('/files/update', async (req, res) => {
  try {
    const { projectId, path: filePath, content } = req.body;

    if (!projectId || !filePath || content === undefined) {
      return res.status(400).json({ error: 'Project ID, path, and content are required' });
    }

    const fullPath = path.join(PROJECTS_DIR, projectId, filePath);
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    
    // Write file
    await fs.writeFile(fullPath, content, 'utf8');

    console.log(`✅ Updated file: ${filePath}`);

    res.json({
      success: true,
      message: 'File updated',
      path: filePath
    });

  } catch (error) {
    console.error('❌ File update error:', error);
    res.status(500).json({
      error: 'Failed to update file',
      message: error.message
    });
  }
});

// =====================================================
// 🗑️ DELETE FILE
// =====================================================
router.delete('/files/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { path: filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }

    const fullPath = path.join(PROJECTS_DIR, projectId, filePath);
    await fs.unlink(fullPath);

    console.log(`🗑️ Deleted file: ${filePath}`);

    res.json({
      success: true,
      message: 'File deleted',
      path: filePath
    });

  } catch (error) {
    console.error('❌ File delete error:', error);
    res.status(500).json({
      error: 'Failed to delete file',
      message: error.message
    });
  }
});

// =====================================================
// 💻 RUN TERMINAL COMMAND
// =====================================================
router.post('/terminal/run', async (req, res) => {
  try {
    const { projectId, command, cwd } = req.body;

    if (!command) {
      return res.status(400).json({ error: 'Command is required' });
    }

    console.log(`💻 Running terminal command: ${command}`);

    const workingDir = cwd 
      ? path.join(PROJECTS_DIR, projectId, cwd)
      : path.join(PROJECTS_DIR, projectId);

    const { stdout, stderr } = await execAsync(command, {
      cwd: workingDir,
      timeout: 60000 // 1 minute timeout
    });

    res.json({
      success: true,
      output: stdout,
      error: stderr || null,
      command
    });

  } catch (error) {
    console.error('❌ Terminal command error:', error);
    res.status(500).json({
      error: 'Command execution failed',
      message: error.message,
      output: error.stdout || '',
      stderr: error.stderr || ''
    });
  }
});

// =====================================================
// 🎨 CREATE LIVE PREVIEW WITH HOT RELOAD
// =====================================================
router.post('/preview/create', async (req, res) => {
  try {
    const { projectId, files, autoReload = true } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'Files are required' });
    }

    console.log(`🎨 Creating live preview for ${projectId} with ${files.length} files`);

    // Store project files
    projectStorage.set(projectId, {
      files,
      autoReload,
      createdAt: new Date().toISOString(),
      lastAccessed: new Date().toISOString()
    });

    // Create physical files
    await createProjectFiles(projectId, files);

    const previewUrl = `/api/replit/preview/${projectId}`;

    res.json({
      success: true,
      projectId,
      previewUrl,
      autoReload,
      filesCount: files.length
    });

  } catch (error) {
    console.error('❌ Preview creation error:', error);
    res.status(500).json({
      error: 'Failed to create preview',
      message: error.message
    });
  }
});

// =====================================================
// 👁️ SERVE LIVE PREVIEW
// =====================================================
router.get('/preview/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = projectStorage.get(projectId);

    if (!project) {
      return res.status(404).send('<h1>Preview Not Found</h1><p>Generate files first</p>');
    }

    project.lastAccessed = new Date().toISOString();

    const files = project.files;
    
    // Find entry point
    let entryFile = files.find(f => 
      f.path === 'index.html' || 
      f.path === 'frontend/index.html' ||
      f.name === 'index.html'
    );

    if (!entryFile) {
      // Check for React/Vue components
      const reactFile = files.find(f => 
        f.name === 'App.jsx' || f.name === 'App.tsx' || f.name === 'App.js'
      );

      if (reactFile) {
        entryFile = {
          content: generateReactWrapper(files)
        };
      } else {
        return res.status(400).send('<h1>No Entry Point Found</h1><p>Add an index.html or App.jsx file</p>');
      }
    }

    let htmlContent = entryFile.content;

    // Inject CSS files
    const cssFiles = files.filter(f => f.language === 'css' || f.name.endsWith('.css'));
    if (cssFiles.length > 0) {
      const cssContent = cssFiles.map(f => `<style>\n${f.content}\n</style>`).join('\n');
      htmlContent = htmlContent.replace('</head>', `${cssContent}\n</head>`);
    }

    // Inject hot reload script if enabled
    if (project.autoReload) {
      const hotReloadScript = `
      <script>
        // Hot reload functionality
        let lastUpdate = Date.now();
        
        setInterval(async () => {
          try {
            const response = await fetch('/api/replit/preview/${projectId}/status');
            const data = await response.json();
            
            if (data.lastUpdate && data.lastUpdate > lastUpdate) {
              console.log('🔥 Hot reload detected, refreshing...');
              lastUpdate = data.lastUpdate;
              window.location.reload();
            }
          } catch (error) {
            console.error('Hot reload check failed:', error);
          }
        }, 2000); // Check every 2 seconds
      </script>
      `;
      
      htmlContent = htmlContent.replace('</body>', `${hotReloadScript}\n</body>`);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(htmlContent);

  } catch (error) {
    console.error('❌ Preview error:', error);
    res.status(500).send('<h1>Preview Error</h1><p>Failed to load preview</p>');
  }
});

// =====================================================
// 🔄 PREVIEW STATUS (for hot reload)
// =====================================================
router.get('/preview/:projectId/status', (req, res) => {
  try {
    const { projectId } = req.params;
    const project = projectStorage.get(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      success: true,
      lastUpdate: new Date(project.lastAccessed).getTime(),
      filesCount: project.files.length,
      autoReload: project.autoReload
    });

  } catch (error) {
    res.status(500).json({ error: 'Status check failed' });
  }
});

// =====================================================
// 🛠️ HELPER FUNCTIONS
// =====================================================

async function createProjectFiles(projectId, files) {
  const projectPath = path.join(PROJECTS_DIR, projectId);
  
  await fs.mkdir(projectPath, { recursive: true });
  
  for (const file of files) {
    const filePath = path.join(projectPath, file.path || file.name);
    const fileDir = path.dirname(filePath);
    
    await fs.mkdir(fileDir, { recursive: true });
    await fs.writeFile(filePath, file.content || '', 'utf8');
  }
  
  console.log(`✅ Created ${files.length} files in ${projectPath}`);
}

async function buildFileTree(dir, basePath = '') {
  const files = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.join(basePath, entry.name);
      
      if (entry.isDirectory()) {
        const children = await buildFileTree(fullPath, relativePath);
        files.push(...children);
      } else {
        const content = await fs.readFile(fullPath, 'utf8');
        files.push({
          name: entry.name,
          path: relativePath,
          content,
          language: getLanguageFromExtension(entry.name)
        });
      }
    }
  } catch (error) {
    console.error('Error building file tree:', error);
  }
  
  return files;
}

function getLanguageFromExtension(filename) {
  const ext = path.extname(filename).toLowerCase();
  const langMap = {
    '.js': 'javascript',
    '.jsx': 'jsx',
    '.ts': 'typescript',
    '.tsx': 'tsx',
    '.json': 'json',
    '.html': 'html',
    '.css': 'css',
    '.scss': 'scss',
    '.md': 'markdown',
    '.py': 'python',
    '.java': 'java'
  };
  return langMap[ext] || 'text';
}

async function ensurePackageJson(projectPath, framework) {
  const packageJsonPath = path.join(projectPath, 'package.json');
  
  try {
    await fs.access(packageJsonPath);
    console.log('✅ package.json exists');
  } catch {
    console.log('📦 Creating package.json...');
    
    const packageJson = {
      name: `codealchemy-${framework}-project`,
      version: '1.0.0',
      private: true,
      scripts: {},
      dependencies: {},
      devDependencies: {}
    };
    
    if (framework === 'react') {
      packageJson.scripts = {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview'
      };
      packageJson.dependencies = {
        'react': '^18.2.0',
        'react-dom': '^18.2.0'
      };
      packageJson.devDependencies = {
        'vite': '^5.0.0',
        '@vitejs/plugin-react': '^4.2.0'
      };
    } else if (framework === 'vue') {
      packageJson.scripts = {
        dev: 'vite',
        build: 'vite build'
      };
      packageJson.dependencies = {
        'vue': '^3.3.0'
      };
      packageJson.devDependencies = {
        'vite': '^5.0.0',
        '@vitejs/plugin-vue': '^4.5.0'
      };
    }
    
    await fs.writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      'utf8'
    );
    
    console.log('✅ package.json created');
  }
}

function generateReactWrapper(files) {
  const appFile = files.find(f => 
    f.name === 'App.jsx' || f.name === 'App.tsx' || f.name === 'App.js'
  );
  const cssFiles = files.filter(f => f.language === 'css' || f.name.endsWith('.css'));
  const cssContent = cssFiles.map(f => f.content).join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodeAlchemy Live Preview</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: #f7fafc;
    }
    #root { width: 100%; min-height: 100vh; }
    ${cssContent}
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${appFile ? appFile.content : 'function App() { return <div style={{padding: "20px"}}>No App component found</div>; }'}
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`;
}

// =====================================================
// 🧹 CLEANUP OLD PROJECTS
// =====================================================
setInterval(async () => {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  
  for (const [id, project] of projectStorage.entries()) {
    const age = now - new Date(project.lastAccessed).getTime();
    if (age > maxAge) {
      projectStorage.delete(id);
      
      // Delete physical files
      const projectPath = path.join(PROJECTS_DIR, id);
      try {
        await fs.rm(projectPath, { recursive: true, force: true });
        console.log('🧹 Cleaned up old project:', id);
      } catch (error) {
        console.error('Failed to delete project directory:', error);
      }
    }
  }
}, 60 * 60 * 1000); // Run every hour

// Cleanup on exit
process.on('exit', () => {
  for (const [projectId, server] of runningServers.entries()) {
    server.process.kill('SIGTERM');
    console.log(`🛑 Stopped server: ${projectId}`);
  }
});

module.exports = router;