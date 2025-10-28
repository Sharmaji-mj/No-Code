// ===== backend/src/services/enhancedCodeGeneration.service.js =====

const { OpenAI } = require('openai');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class EnhancedCodeGenerationService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.generatedPath = process.env.GENERATED_PROJECTS_PATH || './generated';
  }

  /**
   * Generate complete project with streaming support
   */
  async generateProjectAdvanced({ prompt, stack, projectName, options = {} }) {
    const projectId = `${projectName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const projectPath = path.join(this.generatedPath, projectId);

    try {
      await fs.ensureDir(projectPath);

      console.log(`🤖 Generating project: ${projectId}`);
      console.log(`📝 Prompt: ${prompt}`);
      console.log(`🔧 Stack:`, stack);

      // Build comprehensive system prompt
      const systemPrompt = this.buildAdvancedSystemPrompt(stack, options);
      const userPrompt = this.buildAdvancedUserPrompt(prompt, projectName, stack);

      // Call OpenAI with improved configuration
      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4096,
        top_p: 1,
        frequency_penalty: 0.2,
        presence_penalty: 0.1
      });

      const aiResponse = completion.choices[0].message.content;
      console.log(`✅ OpenAI response received (${aiResponse.length} chars)`);

      // Parse and create files
      const files = this.parseAIResponse(aiResponse, stack);
      console.log(`📁 Parsed ${files.length} files`);

      // Create project structure
      await this.createProjectStructure(projectPath, files, stack, projectName);

      // Build preview
      await this.buildAdvancedPreview(projectPath, stack, files);

      // Generate metadata
      const metadata = {
        projectId,
        projectName,
        stack,
        prompt,
        createdAt: new Date().toISOString(),
        fileCount: files.length
      };

      await fs.writeJson(path.join(projectPath, 'metadata.json'), metadata, { spaces: 2 });

      return {
        projectId,
        files: files.map(f => ({
          path: f.path,
          size: f.content.length,
          lines: f.content.split('\n').length
        })),
        structure: this.buildFileTree(files),
        commands: this.generateCommands(stack),
        metadata
      };

    } catch (error) {
      console.error('❌ Generation failed:', error);
      await fs.remove(projectPath).catch(() => {});
      throw new Error(`Code generation failed: ${error.message}`);
    }
  }

  /**
   * Build advanced system prompt for better results
   */
  buildAdvancedSystemPrompt(stack, options) {
    const frontend = stack?.frontend || 'React';
    const backend = stack?.backend || 'Node.js';
    const database = stack?.database || 'None';
    const styling = stack?.styling || 'Tailwind CSS';

    return `You are an expert full-stack software engineer. Generate a COMPLETE, PRODUCTION-READY project.

TECHNOLOGY STACK:
- Frontend: ${frontend}
- Backend: ${backend}
- Database: ${database}
- Styling: ${styling}

CRITICAL REQUIREMENTS:
1. Generate COMPLETE, RUNNABLE code - NO placeholders or "implement this" comments
2. Include ALL necessary imports and dependencies
3. Proper error handling in all async functions
4. Follow modern best practices and patterns
5. Write clean, well-commented code
6. Include proper TypeScript types if using TS
7. Set up proper project structure with separate folders
8. Include package.json with correct dependencies and scripts
9. Add .env.example with required environment variables
10. Create README.md with setup and usage instructions

FILE FORMAT:
Use this exact format for each file:

===FILE: path/to/filename.ext===
[complete file content with proper formatting]
===END FILE===

REQUIRED FILES:
${this.getRequiredFilesForStack(stack)}

CODE QUALITY:
- Use modern ES6+ syntax
- Implement proper validation
- Add meaningful error messages
- Follow DRY principles
- Write self-documenting code
- Include helpful comments for complex logic

IMPORTANT: Generate actual working code, not pseudocode or incomplete implementations.`;
  }

  /**
   * Get required files based on stack
   */
  getRequiredFilesForStack(stack) {
    const files = [];

    // Frontend files
    if (stack.frontend?.toLowerCase().includes('react')) {
      files.push(
        '- frontend/package.json',
        '- frontend/src/App.jsx or App.tsx',
        '- frontend/src/index.jsx or index.tsx',
        '- frontend/public/index.html',
        '- frontend/src/components/ (at least 2-3 components)',
        '- frontend/vite.config.js or similar'
      );
    } else if (stack.frontend?.toLowerCase().includes('vue')) {
      files.push(
        '- frontend/package.json',
        '- frontend/src/App.vue',
        '- frontend/src/main.js',
        '- frontend/public/index.html'
      );
    }

    // Backend files
    if (stack.backend?.toLowerCase().includes('node')) {
      files.push(
        '- backend/package.json',
        '- backend/server.js or src/index.js',
        '- backend/routes/ (API routes)',
        '- backend/.env.example',
        '- backend/controllers/ (if needed)'
      );
    } else if (stack.backend?.toLowerCase().includes('python')) {
      files.push(
        '- backend/requirements.txt',
        '- backend/app.py or main.py',
        '- backend/routes.py',
        '- backend/.env.example'
      );
    }

    // Root files
    files.push(
      '- README.md (comprehensive setup guide)',
      '- .gitignore'
    );

    return files.join('\n');
  }

  /**
   * Build advanced user prompt
   */
  buildAdvancedUserPrompt(prompt, projectName, stack) {
    return `Create a project called "${projectName}" with these requirements:

${prompt}

The application should be:
- Fully functional and ready to run
- Well-structured with clean code
- Include proper error handling
- Have a responsive, modern UI
- Follow ${stack.frontend || 'React'} best practices
- Include sample data or mock data where appropriate
- Be production-ready

Generate ALL necessary files to make this work, including configuration, components, routes, and documentation.`;
  }

  /**
   * Parse AI response into file objects
   */
  parseAIResponse(response, stack) {
    const files = [];
    const fileRegex = /===FILE:\s*(.+?)\s*===\n([\s\S]*?)===END FILE===/g;
    let match;

    while ((match = fileRegex.exec(response)) !== null) {
      const filePath = match[1].trim();
      const content = match[2].trim();
      
      files.push({
        path: filePath,
        content: content,
        language: this.detectLanguage(filePath)
      });
    }

    // If no files were parsed, try alternative parsing or create defaults
    if (files.length === 0) {
      console.warn('⚠️ No files parsed from AI response, creating defaults...');
      files.push(...this.createDefaultProject(response, stack));
    }

    return files;
  }

  /**
   * Create default project if parsing fails
   */
  createDefaultProject(aiResponse, stack) {
    const files = [];

    // Create a simple React + Node app
    files.push({
      path: 'README.md',
      content: `# Generated Project

${aiResponse.slice(0, 500)}...

## Setup

\`\`\`bash
# Install backend
cd backend && npm install

# Install frontend
cd frontend && npm install

# Run backend
cd backend && npm start

# Run frontend (new terminal)
cd frontend && npm start
\`\`\`
`,
      language: 'markdown'
    });

    // Frontend
    files.push({
      path: 'frontend/package.json',
      content: JSON.stringify({
        name: 'frontend',
        version: '1.0.0',
        private: true,
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0'
        },
        scripts: {
          start: 'react-scripts start',
          build: 'react-scripts build'
        }
      }, null, 2),
      language: 'json'
    });

    files.push({
      path: 'frontend/public/index.html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated App</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`,
      language: 'html'
    });

    files.push({
      path: 'frontend/src/App.jsx',
      content: `import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ 
      padding: '40px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#667eea' }}>🎉 Generated Application</h1>
      <p style={{ color: '#6b7280', marginBottom: '20px' }}>
        This application was generated by AI based on your prompt.
      </p>
      
      <div style={{ 
        background: '#f9fafb',
        padding: '30px',
        borderRadius: '12px',
        marginTop: '30px'
      }}>
        <h2>Interactive Counter Demo</h2>
        <p>Count: {count}</p>
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '15px'
          }}
        >
          Increment
        </button>
        <button 
          onClick={() => setCount(0)}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '15px',
            marginLeft: '10px'
          }}
        >
          Reset
        </button>
      </div>

      <div style={{ 
        marginTop: '40px',
        padding: '20px',
        background: '#ecfdf5',
        borderLeft: '4px solid #10b981',
        borderRadius: '8px'
      }}>
        <h3>✅ Next Steps</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li>Customize the UI in src/App.jsx</li>
          <li>Add more components in src/components/</li>
          <li>Connect to the backend API</li>
          <li>Add routing with React Router</li>
        </ul>
      </div>
    </div>
  );
}

export default App;`,
      language: 'javascript'
    });

    files.push({
      path: 'frontend/src/index.jsx',
      content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
      language: 'javascript'
    });

    // Backend
    files.push({
      path: 'backend/package.json',
      content: JSON.stringify({
        name: 'backend',
        version: '1.0.0',
        main: 'server.js',
        scripts: {
          start: 'node server.js',
          dev: 'nodemon server.js'
        },
        dependencies: {
          express: '^4.18.2',
          cors: '^2.8.5',
          dotenv: '^16.3.1'
        },
        devDependencies: {
          nodemon: '^3.0.2'
        }
      }, null, 2),
      language: 'json'
    });

    files.push({
      path: 'backend/server.js',
      content: `const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/data', (req, res) => {
  res.json({
    message: 'Hello from the backend!',
    data: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' }
    ]
  });
});

app.post('/api/items', (req, res) => {
  const { name } = req.body;
  res.json({
    success: true,
    item: { id: Date.now(), name }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
});`,
      language: 'javascript'
    });

    files.push({
      path: 'backend/.env.example',
      content: `PORT=5000
NODE_ENV=development`,
      language: 'text'
    });

    files.push({
      path: '.gitignore',
      content: `node_modules
.env
dist
build
*.log
.DS_Store`,
      language: 'text'
    });

    return files;
  }

  /**
   * Create project structure on disk
   */
  async createProjectStructure(projectPath, files, stack, projectName) {
    for (const file of files) {
      const filePath = path.join(projectPath, file.path);
      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, file.content, 'utf8');
      console.log(`  ✓ Created: ${file.path}`);
    }
  }

  /**
   * Build advanced preview with better HTML
   */
  async buildAdvancedPreview(projectPath, stack, files) {
    const frontendPath = path.join(projectPath, 'frontend');
    
    if (!await fs.pathExists(frontendPath)) {
      return;
    }

    const distPath = path.join(frontendPath, 'dist');
    await fs.ensureDir(distPath);

    // Get App component
    const appFile = files.find(f => 
      f.path.includes('App.jsx') || 
      f.path.includes('App.tsx') || 
      f.path.includes('App.js')
    );

    const appComponent = appFile ? appFile.content : this.getDefaultAppComponent();

    // Create comprehensive preview HTML
    const previewHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview - Generated Application</title>
  
  <!-- React & ReactDOM from CDN -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  
  <!-- Babel Standalone for JSX -->
  <script src="https://unpkg.com/@babel/standalone@7/babel.min.js"></script>
  
  <!-- Optional: Add Tailwind if specified -->
  ${stack.styling?.toLowerCase().includes('tailwind') ? 
    '<script src="https://cdn.tailwindcss.com"></script>' : ''}
  
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background: #f9fafb;
    }
    
    #root {
      min-height: 100vh;
    }
    
    /* Additional base styles */
    button {
      cursor: pointer;
      transition: all 0.2s;
    }
    
    button:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    
    input, textarea {
      font-family: inherit;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <script type="text/babel">
    ${appComponent}
    
    // Render the app
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  </script>
</body>
</html>`;

    // Write preview HTML
    await fs.writeFile(path.join(distPath, 'index.html'), previewHTML);
    await fs.writeFile(path.join(frontendPath, 'index.html'), previewHTML);
    
    console.log(`  ✓ Created preview HTML`);
  }

  /**
   * Default App component fallback
   */
  getDefaultAppComponent() {
    return `
function App() {
  const [activeTab, setActiveTab] = React.useState('home');
  
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>
          🚀 Generated Application
        </h1>
        <p style={{ fontSize: '18px', color: '#6b7280' }}>
          Your AI-generated app is ready to use!
        </p>
      </header>
      
      <nav style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '32px',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '12px'
      }}>
        {['home', 'features', 'about'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px',
              background: activeTab === tab ? '#667eea' : 'transparent',
              color: activeTab === tab ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </nav>
      
      <main>
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'features' && <FeaturesPage />}
        {activeTab === 'about' && <AboutPage />}
      </main>
    </div>
  );
}

function HomePage() {
  const [count, setCount] = React.useState(0);
  
  return (
    <div>
      <h2 style={{ fontSize: '28px', marginBottom: '20px', color: '#1f2937' }}>
        Welcome Home! 🏠
      </h2>
      <div style={{ 
        background: 'white', 
        padding: '32px', 
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '16px' }}>Interactive Counter</h3>
        <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#667eea', marginBottom: '20px' }}>
          {count}
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setCount(count + 1)}
            style={{
              padding: '12px 24px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Increment
          </button>
          <button 
            onClick={() => setCount(count - 1)}
            style={{
              padding: '12px 24px',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Decrement
          </button>
          <button 
            onClick={() => setCount(0)}
            style={{
              padding: '12px 24px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function FeaturesPage() {
  const features = [
    { icon: '⚡', title: 'Fast', desc: 'Lightning-fast performance' },
    { icon: '🎨', title: 'Beautiful', desc: 'Modern, clean design' },
    { icon: '🔒', title: 'Secure', desc: 'Built with security in mind' },
    { icon: '📱', title: 'Responsive', desc: 'Works on all devices' }
  ];
  
  return (
    <div>
      <h2 style={{ fontSize: '28px', marginBottom: '20px', color: '#1f2937' }}>
        Features ✨
      </h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {features.map(feature => (
          <div 
            key={feature.title}
            style={{
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>{feature.icon}</div>
            <h3 style={{ marginBottom: '8px', color: '#1f2937' }}>{feature.title}</h3>
            <p style={{ color: '#6b7280' }}>{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div>
      <h2 style={{ fontSize: '28px', marginBottom: '20px', color: '#1f2937' }}>
        About This App 📖
      </h2>
      <div style={{ 
        background: 'white', 
        padding: '32px', 
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        lineHeight: '1.8'
      }}>
        <p style={{ marginBottom: '16px', color: '#4b5563' }}>
          This application was generated using AI-powered code generation. 
          It demonstrates modern web development practices and includes:
        </p>
        <ul style={{ marginLeft: '24px', color: '#4b5563', marginBottom: '16px' }}>
          <li>Component-based architecture</li>
          <li>State management with React hooks</li>
          <li>Responsive design</li>
          <li>Clean, maintainable code</li>
        </ul>
        <p style={{ color: '#4b5563' }}>
          You can modify and extend this application to suit your needs. 
          Check the source files for implementation details.
        </p>
      </div>
    </div>
  );
}
`;
  }

  /**
   * Detect programming language from file path
   */
  detectLanguage(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const langMap = {
      '.js': 'javascript',
      '.jsx': 'jsx',
      '.ts': 'typescript',
      '.tsx': 'tsx',
      '.py': 'python',
      '.html': 'html',
      '.css': 'css',
      '.json': 'json',
      '.md': 'markdown',
      '.yaml': 'yaml',
      '.yml': 'yaml',
      '.sh': 'bash',
      '.env': 'text'
    };
    return langMap[ext] || 'text';
  }

  /**
   * Build file tree structure
   */
  buildFileTree(files) {
    const tree = {};
    
    files.forEach(file => {
      const parts = file.path.split('/');
      let current = tree;
      
      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          current[part] = { type: 'file', ...file };
        } else {
          if (!current[part]) {
            current[part] = { type: 'directory', children: {} };
          }
          current = current[part].children;
        }
      });
    });
    
    return tree;
  }

  /**
   * Generate run commands
   */
  generateCommands(stack) {
    return {
      backend: {
        install: 'cd backend && npm install',
        dev: 'cd backend && npm run dev',
        start: 'cd backend && npm start'
      },
      frontend: {
        install: 'cd frontend && npm install',
        dev: 'cd frontend && npm start',
        build: 'cd frontend && npm run build'
      },
      all: 'npm install && npm run dev'
    };
  }
}

module.exports = new EnhancedCodeGenerationService();