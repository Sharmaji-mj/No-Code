// // backend/src/utils/aiPrompts.js
// // Advanced AI prompt engineering for CodeAlchemy

// /**
//  * Generate system prompt based on project type and stack
//  */
// function generateSystemPrompt(stack, projectType = 'fullstack') {
//   const basePrompt = `You are an expert full-stack architect at CodeAlchemy, powered by advanced AI.

// YOUR MISSION:
// Transform natural language requirements into production-ready, complete applications.

// CORE PRINCIPLES:
// 1. NEVER use placeholders like "// rest of code", "// implement this", "..."
// 2. EVERY function must be fully implemented with real logic
// 3. ALL files must be 100% complete and working
// 4. Include proper error handling, validation, and security
// 5. Follow modern best practices and clean code principles
// 6. Generate code that can run immediately without modifications`;

//   const stackPrompt = generateStackSpecificPrompt(stack);
//   const formatPrompt = getResponseFormatPrompt();
//   const qualityPrompt = getQualityStandardsPrompt();

//   return `${basePrompt}\n\n${stackPrompt}\n\n${formatPrompt}\n\n${qualityPrompt}`;
// }

// /**
//  * Generate stack-specific instructions
//  */
// function generateStackSpecificPrompt(stack) {
//   const { frontend, backend, database, styling } = stack;

//   return `RECOMMENDED TECH STACK:
// Frontend: ${frontend.name} ${frontend.version}
// Backend: ${backend.name}
// Database: ${database.name}
// Styling: ${styling.name}

// FRONTEND REQUIREMENTS:
// ${getFrontendRequirements(frontend)}

// BACKEND REQUIREMENTS:
// ${getBackendRequirements(backend)}

// DATABASE REQUIREMENTS:
// ${getDatabaseRequirements(database)}

// STYLING REQUIREMENTS:
// ${getStylingRequirements(styling)}`;
// }

// /**
//  * Get frontend-specific requirements
//  */
// function getFrontendRequirements(frontend) {
//   const requirements = {
//     'React': `- Use React 18 with functional components and Hooks
// - Implement proper state management (Context API or Zustand for complex apps)
// - Use TypeScript for type safety
// - Create reusable, composable components
// - Implement proper error boundaries
// - Add loading states and error handling
// - Use modern patterns (custom hooks, composition)
// - Optimize with React.memo, useMemo, useCallback where needed`,

//     'Next.js': `- Use Next.js 14 with App Router
// - Implement Server Components where appropriate
// - Use Client Components only when needed (interactivity, hooks)
// - Implement proper SEO with metadata
// - Use server actions for mutations
// - Optimize images with next/image
// - Implement proper routing and navigation
// - Add loading.tsx and error.tsx files`,

//     'Vue': `- Use Vue 3 with Composition API
// - Implement proper reactivity with ref and reactive
// - Create reusable composables
// - Use TypeScript for type safety
// - Implement proper component lifecycle
// - Add error handling and loading states`,

//     'Svelte': `- Use Svelte 4 with SvelteKit
// - Implement reactive statements properly
// - Use stores for global state
// - Create reusable components
// - Implement proper routing`,

//     'Angular': `- Use Angular 17 with standalone components
// - Implement proper dependency injection
// - Use RxJS for reactive programming
// - Create services for business logic
// - Implement proper routing and guards`
//   };

//   return requirements[frontend.name] || requirements['React'];
// }

// /**
//  * Get backend-specific requirements
//  */
// function getBackendRequirements(backend) {
//   const requirements = {
//     'Node.js + Express': `- Use Express 4.x with modern middleware
// - Implement proper routing structure
// - Add comprehensive error handling middleware
// - Implement request validation (express-validator or Joi)
// - Add CORS configuration
// - Implement rate limiting
// - Use async/await for all async operations
// - Add proper logging (winston or pino)
// - Implement authentication with JWT
// - Add API documentation comments`,

//     'Node.js + NestJS': `- Use NestJS with TypeScript
// - Implement modular architecture with modules
// - Use dependency injection properly
// - Create DTOs for validation
// - Implement guards for authentication
// - Use interceptors for logging
// - Add Swagger documentation
// - Implement proper exception filters`,

//     'Node.js + Socket.io': `- Implement WebSocket server with Socket.io
// - Add proper event handling
// - Implement rooms and namespaces
// - Add authentication for socket connections
// - Handle disconnections gracefully
// - Implement message queuing if needed`
//   };

//   return requirements[backend.name] || requirements['Node.js + Express'];
// }

// /**
//  * Get database-specific requirements
//  */
// function getDatabaseRequirements(database) {
//   const requirements = {
//     'MongoDB': `- Use Mongoose with proper schemas
// - Implement validation at schema level
// - Add indexes for performance
// - Use virtuals and methods where appropriate
// - Implement proper connection handling
// - Add connection pooling
// - Use transactions for multi-document operations`,

//     'PostgreSQL': `- Use Prisma or Sequelize as ORM
// - Define proper models with relations
// - Implement migrations
// - Add proper indexes
// - Use transactions for complex operations
// - Implement connection pooling
// - Add database-level constraints`,

//     'MongoDB + Redis': `- MongoDB for persistent data
// - Redis for caching and sessions
// - Implement cache invalidation strategy
// - Use Redis pub/sub for real-time features
// - Add proper TTL for cached data`
//   };

//   return requirements[database.name] || requirements['MongoDB'];
// }

// /**
//  * Get styling requirements
//  */
// function getStylingRequirements(styling) {
//   const requirements = {
//     'Tailwind CSS': `- Use Tailwind CSS 3.x utility classes
// - Configure custom colors in tailwind.config.js
// - Use responsive design (mobile-first)
// - Implement dark mode support
// - Use @apply sparingly (prefer utilities)
// - Add custom components in base layer if needed`,

//     'Tailwind CSS + shadcn/ui': `- Install and configure shadcn/ui components
// - Use Tailwind CSS utilities
// - Customize component themes
// - Implement consistent design system
// - Use proper spacing and typography scales`,

//     'Material-UI': `- Use MUI v5 with emotion
// - Implement theme customization
// - Use sx prop for styling
// - Follow Material Design guidelines
// - Implement responsive grid system`,

//     'Chakra UI': `- Use Chakra UI v2
// - Implement custom theme
// - Use component style props
// - Follow responsive design patterns
// - Implement dark mode`
//   };

//   return requirements[styling.name] || requirements['Tailwind CSS'];
// }

// /**
//  * Response format instructions
//  */
// function getResponseFormatPrompt() {
//   return `RESPONSE FORMAT:
// You MUST respond with valid JSON in this EXACT structure:

// {
//   "analysis": "Your understanding of the requirements",
//   "recommendedFeatures": ["feature1", "feature2", "..."],
//   "files": [
//     {
//       "path": "exact/path/to/file.ext",
//       "name": "filename.ext",
//       "language": "javascript|jsx|typescript|tsx|html|css|json|markdown",
//       "content": "COMPLETE file content - NO PLACEHOLDERS",
//       "description": "What this file does"
//     }
//   ],
//   "setupInstructions": "Step-by-step setup guide",
//   "environmentVariables": {
//     "VAR_NAME": "description of what this var is for"
//   },
//   "dependencies": {
//     "frontend": ["package1@version", "package2@version"],
//     "backend": ["package1@version", "package2@version"]
//   },
//   "runInstructions": {
//     "frontend": "npm run dev",
//     "backend": "npm start"
//   },
//   "features": ["List of implemented features"],
//   "apiEndpoints": [
//     {
//       "method": "GET|POST|PUT|DELETE",
//       "path": "/api/endpoint",
//       "description": "What this endpoint does"
//     }
//   ],
//   "nextSteps": ["Suggestions for enhancements"]
// }

// CRITICAL RULES:
// 1. ALL files must have COMPLETE content - no "// TODO", "// implement this", etc.
// 2. Include ALL necessary imports and dependencies
// 3. Every function must be fully implemented
// 4. Add comprehensive error handling
// 5. Include input validation
// 6. Add helpful comments
// 7. Follow security best practices
// 8. Make code production-ready`;
// }

// /**
//  * Quality standards prompt
//  */
// function getQualityStandardsPrompt() {
//   return `CODE QUALITY STANDARDS:

// 1. COMPLETENESS:
//    ✅ Every function fully implemented
//    ✅ All imports included
//    ✅ No placeholder comments
//    ✅ Error handling everywhere
//    ✅ Input validation

// 2. SECURITY:
//    ✅ SQL injection prevention
//    ✅ XSS protection
//    ✅ CSRF tokens where needed
//    ✅ Password hashing (bcrypt)
//    ✅ JWT token validation
//    ✅ Environment variables for secrets
//    ✅ Rate limiting on APIs

// 3. BEST PRACTICES:
//    ✅ DRY (Don't Repeat Yourself)
//    ✅ SOLID principles
//    ✅ Proper separation of concerns
//    ✅ Consistent naming conventions
//    ✅ Meaningful variable names
//    ✅ Single responsibility per function

// 4. USER EXPERIENCE:
//    ✅ Loading states
//    ✅ Error messages
//    ✅ Success feedback
//    ✅ Responsive design
//    ✅ Accessibility (ARIA labels)
//    ✅ Keyboard navigation

// 5. PERFORMANCE:
//    ✅ Lazy loading where appropriate
//    ✅ Code splitting
//    ✅ Image optimization
//    ✅ Database indexing
//    ✅ API response caching
//    ✅ Debouncing user inputs

// 6. MAINTAINABILITY:
//    ✅ Clear comments
//    ✅ Modular architecture
//    ✅ Consistent code style
//    ✅ Reusable components
//    ✅ Proper file organization`;
// }

// /**
//  * Generate user prompt with context
//  */
// function generateUserPrompt(userRequest, stack, additionalContext = {}) {
//   const { conversationHistory, existingFiles, preferences } = additionalContext;

//   let prompt = `Generate a complete, production-ready application based on this requirement:\n\n"${userRequest}"\n\n`;

//   // Add stack information
//   prompt += `USE THIS EXACT TECH STACK:\n`;
//   prompt += `- Frontend: ${stack.frontend.name} ${stack.frontend.version}\n`;
//   prompt += `- Backend: ${stack.backend.name}\n`;
//   prompt += `- Database: ${stack.database.name}\n`;
//   prompt += `- Styling: ${stack.styling.name}\n\n`;

//   // Add additional tools if any
//   if (stack.additionalTools && stack.additionalTools.length > 0) {
//     prompt += `ADDITIONAL TOOLS TO INCLUDE:\n`;
//     stack.additionalTools.forEach(tool => {
//       prompt += `- ${tool.name}: ${tool.purpose}\n`;
//     });
//     prompt += `\n`;
//   }

//   // Add preferences
//   if (preferences) {
//     prompt += `USER PREFERENCES:\n`;
//     if (preferences.typescript) prompt += `- Use TypeScript\n`;
//     if (preferences.testing) prompt += `- Include unit tests\n`;
//     if (preferences.docker) prompt += `- Add Docker configuration\n`;
//     if (preferences.ci) prompt += `- Add CI/CD configuration\n`;
//     prompt += `\n`;
//   }

//   // Add conversation context
//   if (conversationHistory && conversationHistory.length > 0) {
//     prompt += `CONVERSATION CONTEXT:\n`;
//     conversationHistory.slice(-3).forEach(msg => {
//       prompt += `${msg.role}: ${msg.content.substring(0, 200)}\n`;
//     });
//     prompt += `\n`;
//   }

//   // Add modification context if editing existing files
//   if (existingFiles && existingFiles.length > 0) {
//     prompt += `EXISTING FILES TO MODIFY:\n`;
//     existingFiles.forEach(file => {
//       prompt += `- ${file.path}\n`;
//     });
//     prompt += `\nIMPORTANT: Maintain compatibility with existing code structure.\n\n`;
//   }

//   prompt += `Generate COMPLETE, WORKING code now. NO placeholders, NO incomplete implementations.`;

//   return prompt;
// }

// /**
//  * Generate follow-up prompt for modifications
//  */
// function generateModificationPrompt(modification, existingProject) {
//   return `MODIFICATION REQUEST: ${modification}

// EXISTING PROJECT STRUCTURE:
// ${existingProject.files.map(f => `- ${f.path}`).join('\n')}

// CURRENT STACK:
// - Frontend: ${existingProject.stack.frontend}
// - Backend: ${existingProject.stack.backend}
// - Database: ${existingProject.stack.database}

// INSTRUCTIONS:
// 1. Understand what needs to be changed
// 2. Maintain consistency with existing code
// 3. Update ALL affected files completely
// 4. Ensure backward compatibility
// 5. Add proper migration steps if needed

// Return ONLY the files that need to be updated with their COMPLETE new content.`;
// }

// /**
//  * Generate code explanation prompt
//  */
// function generateExplanationPrompt(code, fileType) {
//   return `Explain this ${fileType} code in a clear, beginner-friendly way:

// \`\`\`${fileType}
// ${code}
// \`\`\`

// Provide:
// 1. High-level overview
// 2. Key components/functions explained
// 3. How it works step-by-step
// 4. Best practices used
// 5. Potential improvements`;
// }

// /**
//  * Generate debugging prompt
//  */
// function generateDebuggingPrompt(error, code, context) {
//   return `DEBUG THIS ERROR:

// Error Message:
// ${error}

// Code Context:
// \`\`\`
// ${code}
// \`\`\`

// Additional Context:
// ${context}

// Provide:
// 1. Root cause analysis
// 2. Step-by-step fix
// 3. Updated code
// 4. Prevention tips`;
// }

// /**
//  * Generate optimization prompt
//  */
// function generateOptimizationPrompt(code, metrics) {
//   return `OPTIMIZE THIS CODE:

// Current Code:
// \`\`\`
// ${code}
// \`\`\`

// Performance Metrics:
// ${JSON.stringify(metrics, null, 2)}

// Provide:
// 1. Performance bottlenecks identified
// 2. Optimization strategies
// 3. Optimized code
// 4. Expected improvements
// 5. Trade-offs to consider`;
// }

// /**
//  * Generate testing prompt
//  */
// function generateTestingPrompt(code, framework) {
//   return `Generate comprehensive unit tests for this code using ${framework}:

// \`\`\`
// ${code}
// \`\`\`

// Include:
// 1. Test file with all necessary imports
// 2. Tests for happy paths
// 3. Tests for edge cases
// 4. Tests for error handling
// 5. Mock implementations where needed
// 6. Test coverage report expectations`;
// }

// /**
//  * Template for different project types
//  */
// const projectTemplates = {
//   'todo': {
//     features: ['Create todos', 'Mark complete', 'Delete todos', 'Filter by status', 'Local storage'],
//     apiEndpoints: ['GET /todos', 'POST /todos', 'PUT /todos/:id', 'DELETE /todos/:id'],
//     components: ['TodoList', 'TodoItem', 'TodoForm', 'FilterBar']
//   },
//   'ecommerce': {
//     features: ['Product listing', 'Shopping cart', 'Checkout', 'User auth', 'Order history', 'Payment integration'],
//     apiEndpoints: ['GET /products', 'POST /cart', 'POST /orders', 'POST /payments'],
//     components: ['ProductList', 'ProductCard', 'Cart', 'Checkout', 'OrderHistory']
//   },
//   'blog': {
//     features: ['Post listing', 'Post detail', 'Comments', 'Search', 'Tags', 'Author profiles'],
//     apiEndpoints: ['GET /posts', 'GET /posts/:slug', 'POST /comments', 'GET /search'],
//     components: ['PostList', 'PostDetail', 'CommentSection', 'SearchBar', 'TagCloud']
//   },
//   'dashboard': {
//     features: ['Charts', 'Tables', 'Filters', 'Export data', 'User management', 'Analytics'],
//     apiEndpoints: ['GET /analytics', 'GET /users', 'GET /reports', 'POST /export'],
//     components: ['DashboardLayout', 'ChartWidget', 'DataTable', 'FilterPanel', 'StatCard']
//   },
//   'chat': {
//     features: ['Real-time messaging', 'User presence', 'Typing indicators', 'File sharing', 'Emojis'],
//     apiEndpoints: ['WebSocket connection', 'POST /messages', 'GET /history', 'POST /upload'],
//     components: ['ChatWindow', 'MessageList', 'MessageInput', 'UserList', 'FileUpload']
//   },
//   'social': {
//     features: ['Posts', 'Comments', 'Likes', 'Follow system', 'Notifications', 'User profiles'],
//     apiEndpoints: ['GET /feed', 'POST /posts', 'POST /follow', 'GET /notifications'],
//     components: ['Feed', 'Post', 'CommentSection', 'UserProfile', 'NotificationBell']
//   }
// };

// /**
//  * Detect project type from description
//  */
// function detectProjectType(description) {
//   const desc = description.toLowerCase();
  
//   if (/todo|task/.test(desc)) return 'todo';
//   if (/shop|store|cart|ecommerce|e-commerce/.test(desc)) return 'ecommerce';
//   if (/blog|article|post|cms/.test(desc)) return 'blog';
//   if (/dashboard|admin|analytics/.test(desc)) return 'dashboard';
//   if (/chat|message|messenger/.test(desc)) return 'chat';
//   if (/social|feed|follow|like/.test(desc)) return 'social';
  
//   return 'custom';
// }

// /**
//  * Get template for project type
//  */
// function getProjectTemplate(projectType) {
//   return projectTemplates[projectType] || null;
// }

// /**
//  * Generate comprehensive prompt with all context
//  */
// function generateComprehensivePrompt(userRequest, stack, options = {}) {
//   const systemPrompt = generateSystemPrompt(stack);
//   const userPrompt = generateUserPrompt(userRequest, stack, options);
  
//   const projectType = detectProjectType(userRequest);
//   const template = getProjectTemplate(projectType);
  
//   let enhancedUserPrompt = userPrompt;
  
//   if (template) {
//     enhancedUserPrompt += `\n\nSUGGESTED FEATURES TO INCLUDE:\n`;
//     enhancedUserPrompt += template.features.map(f => `- ${f}`).join('\n');
//     enhancedUserPrompt += `\n\nSUGGESTED COMPONENTS:\n`;
//     enhancedUserPrompt += template.components.map(c => `- ${c}`).join('\n');
//     enhancedUserPrompt += `\n\nSUGGESTED API ENDPOINTS:\n`;
//     enhancedUserPrompt += template.apiEndpoints.map(e => `- ${e}`).join('\n');
//   }

//   return {
//     systemPrompt,
//     userPrompt: enhancedUserPrompt,
//     projectType,
//     template
//   };
// }

// module.exports = {
//   generateSystemPrompt,
//   generateUserPrompt,
//   generateModificationPrompt,
//   generateExplanationPrompt,
//   generateDebuggingPrompt,
//   generateOptimizationPrompt,
//   generateTestingPrompt,
//   generateComprehensivePrompt,
//   detectProjectType,
//   getProjectTemplate
// };


// backend/utils/aiPrompts.js

/**
 * Generates comprehensive prompts for AI code generation
 */
function generateComprehensivePrompt(userRequest, stackRecommendation, options = {}) {
  const { frontend, backend, database, estimatedComplexity } = stackRecommendation;
  
  // Determine project type
  let projectType = 'web-application';
  const lowerRequest = userRequest.toLowerCase();
  
  if (lowerRequest.includes('landing')) projectType = 'landing-page';
  else if (lowerRequest.includes('dashboard')) projectType = 'dashboard';
  else if (lowerRequest.includes('e-commerce') || lowerRequest.includes('shop')) projectType = 'e-commerce';
  else if (lowerRequest.includes('blog')) projectType = 'blog';
  else if (lowerRequest.includes('portfolio')) projectType = 'portfolio';
  else if (lowerRequest.includes('api')) projectType = 'api';
  
  const systemPrompt = `You are an expert full-stack developer specializing in ${frontend.name}${backend.name !== 'None' ? `, ${backend.name}` : ''}${database.name !== 'None' ? `, and ${database.name}` : ''}.

Your task is to generate COMPLETE, PRODUCTION-READY code based on user requirements.

CRITICAL REQUIREMENTS:
1. Return ONLY valid JSON in this exact format:
{
  "analysis": "Brief description of what you're building",
  "files": [
    {
      "name": "filename.ext",
      "path": "path/to/filename.ext",
      "content": "complete file content",
      "language": "html/css/javascript/etc"
    }
  ],
  "setupInstructions": ["step 1", "step 2"],
  "dependencies": {
    "npm": ["package1", "package2"]
  },
  "environmentVariables": {
    "VAR_NAME": "description"
  },
  "features": ["feature 1", "feature 2"],
  "apiEndpoints": [
    {
      "method": "GET/POST/etc",
      "path": "/api/endpoint",
      "description": "what it does"
    }
  ],
  "nextSteps": ["step 1", "step 2"]
}

2. Generate COMPLETE, WORKING code - no placeholders, no TODOs
3. Include proper error handling and validation
4. Add detailed comments explaining complex logic
5. Follow best practices and modern conventions
6. Make the UI modern, responsive, and visually appealing
7. Include proper security measures (input validation, sanitization)
8. Ensure cross-browser compatibility

STYLING GUIDELINES:
- Use modern CSS with flexbox/grid
- Include hover effects and smooth transitions
- Use gradients, shadows, and modern color schemes
- Ensure mobile responsiveness
- Add loading states and user feedback

CODE QUALITY:
- Clean, readable, and maintainable
- Proper indentation and formatting
- Meaningful variable and function names
- Modular and reusable components
- Efficient algorithms and optimizations`;

  const userPrompt = `Create a complete ${projectType} project with the following requirements:

${userRequest}

TECH STACK:
- Frontend: ${frontend.name}
- Backend: ${backend.name}
${database.name !== 'None' ? `- Database: ${database.name}` : ''}

COMPLEXITY LEVEL: ${estimatedComplexity}

SPECIFIC REQUIREMENTS:
${projectType === 'landing-page' ? `
- Create a stunning, modern landing page
- Include hero section, features, testimonials, CTA
- Mobile-responsive design
- Smooth scroll animations
- Contact form with validation
` : ''}

${projectType === 'dashboard' ? `
- Create an admin/analytics dashboard
- Include charts and data visualizations
- Sidebar navigation
- Responsive tables and cards
- User authentication UI
- Dark/Light mode toggle
` : ''}

${projectType === 'e-commerce' ? `
- Product listing with filters
- Shopping cart functionality
- Checkout process
- Product detail pages
- Search functionality
- Payment integration UI
` : ''}

${frontend.name === 'React' ? `
REACT SPECIFIC:
- Use functional components with hooks
- Implement proper state management
- Create reusable components
- Use modern React patterns (Context API if needed)
- Include PropTypes or TypeScript interfaces
` : ''}

${backend.name !== 'None' ? `
BACKEND SPECIFIC:
- RESTful API design
- Proper route structure
- Middleware for auth and validation
- Error handling
- CORS configuration
- Environment variables setup
` : ''}

${database.name !== 'None' ? `
DATABASE SPECIFIC:
- Proper schema design
- Database connection setup
- CRUD operations
- Data validation
- Indexes for performance
` : ''}

Remember: Return ONLY valid JSON. No markdown, no code blocks, just pure JSON.`;

  return {
    systemPrompt,
    userPrompt,
    projectType,
    stackRecommendation
  };
}

/**
 * Generates prompts for modifying existing projects
 */
function generateModificationPrompt(modificationRequest, existingProject) {
  return `Modify the existing project based on this request:

${modificationRequest}

EXISTING PROJECT FILES:
${existingProject.files.map(f => `\n--- ${f.name} ---\n${f.content.substring(0, 500)}...\n`).join('\n')}

Return modified files in JSON format:
{
  "files": [
    {
      "name": "filename",
      "path": "path",
      "content": "modified content",
      "language": "language"
    }
  ],
  "changes": ["change 1", "change 2"]
}

Only include files that need modification. Keep the same structure and style.`;
}

module.exports = {
  generateComprehensivePrompt,
  generateModificationPrompt
};