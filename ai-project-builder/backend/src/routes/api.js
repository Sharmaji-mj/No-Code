// // // backend/routes/api.js
// // const express = require('express');
// // const router = express.Router();
// // const fs = require('fs').promises;
// // const path = require('path');
// // const { v4: uuidv4 } = require('uuid');
// // const archiver = require('archiver');
// // const AWS = require('aws-sdk');
// // const { execSync } = require('child_process');
// // const OpenAI = require('openai');

// // // Initialize OpenAI with API key from environment variables
// // const openai = new OpenAI({
// //   apiKey: process.env.OPENAI_API_KEY,
// // });

// // // Directory for temporary files
// // const TEMP_DIR = path.join(__dirname, '../temp');
// // const PREVIEW_DIR = path.join(__dirname, '../previews');

// // // Ensure temp directories exist
// // const ensureDirectories = async () => {
// //   try {
// //     await fs.mkdir(TEMP_DIR, { recursive: true });
// //     await fs.mkdir(PREVIEW_DIR, { recursive: true });
// //   } catch (error) {
// //     console.error('Error creating directories:', error);
// //   }
// // };

// // ensureDirectories();

// // // Helper function to detect language from file extension
// // const detectLanguage = (filePath) => {
// //   const ext = path.extname(filePath).toLowerCase();
// //   const langMap = {
// //     '.js': 'javascript',
// //     '.jsx': 'jsx',
// //     '.ts': 'typescript',
// //     '.tsx': 'tsx',
// //     '.html': 'html',
// //     '.css': 'css',
// //     '.scss': 'scss',
// //     '.json': 'json',
// //     '.py': 'python',
// //     '.java': 'java',
// //     '.go': 'go',
// //     '.rs': 'rust',
// //     '.md': 'markdown',
// //     '.yaml': 'yaml',
// //     '.yml': 'yaml'
// //   };
// //   return langMap[ext] || 'plaintext';
// // };

// // // Generate code using OpenAI
// // router.post('/generate', async (req, res) => {
// //   try {
// //     const { prompt, projectId, stack, conversationHistory } = req.body;
    
// //     // Parse stack if it's a string
// //     let stackConfig;
// //     try {
// //       stackConfig = typeof stack === 'string' ? JSON.parse(stack) : stack;
// //     } catch (e) {
// //       stackConfig = {
// //         frontend: 'React + Vite',
// //         backend: 'Node.js + Express',
// //         database: 'None',
// //         styling: 'Tailwind CSS'
// //       };
// //     }
    
// //     // System prompt for code generation
// //     const systemPrompt = `You are a senior full-stack engineer and UI/UX developer. 
// //     Produce production-ready, well-documented code and supporting files. 
// //     When generating code, make clear file paths, include all necessary package.json updates, 
// //     and return a ZIP-able project structure. Use secure practices (do not hard-code secrets). 
// //     Comment clearly and keep each file under 300 lines if possible.
    
// //     Generate a complete ${stackConfig.frontend} application with ${stackConfig.backend} backend 
// //     and ${stackConfig.database} database based on the user's request: "${prompt}"
    
// //     Return a JSON response with the following structure:
// //     {
// //       "applicationType": "web",
// //       "description": "Brief description of the generated application",
// //       "files": [
// //         {
// //           "path": "relative/path/to/file",
// //           "content": "file content",
// //           "language": "javascript"
// //         }
// //       ]
// //     }`;

// //     // Create conversation array with system prompt and user messages
// //     const messages = [
// //       { role: 'system', content: systemPrompt },
// //       ...(conversationHistory || []),
// //       { role: 'user', content: prompt }
// //     ];

// //     // Call OpenAI API
// //     const response = await openai.chat.completions.create({
// //       model: 'gpt-4',
// //       messages: messages,
// //       temperature: 0.2,
// //       max_tokens: 4000,
// //     });

// //     let projectData;
// //     try {
// //       // Try to parse the response as JSON
// //       projectData = JSON.parse(response.choices[0].message.content);
// //     } catch (parseError) {
// //       // If parsing fails, return the raw response
// //       return res.json({
// //         reply: response.choices[0].message.content
// //       });
// //     }

// //     // Ensure each file has a language property
// //     if (projectData.files) {
// //       projectData.files = projectData.files.map(file => ({
// //         ...file,
// //         language: file.language || detectLanguage(file.path)
// //       }));
// //     }

// //     res.json({
// //       projectData
// //     });
// //   } catch (error) {
// //     console.error('Generation error:', error);
// //     res.status(500).json({ 
// //       error: 'Failed to generate code',
// //       message: error.message 
// //     });
// //   }
// // });

// // // Create preview of the generated application
// // router.post('/preview', async (req, res) => {
// //   try {
// //     const { projectId, files } = req.body;
// //     const previewId = uuidv4();
// //     const previewPath = path.join(PREVIEW_DIR, previewId);
    
// //     // Create preview directory
// //     await fs.mkdir(previewPath, { recursive: true });
    
// //     // Write all files to the preview directory
// //     for (const file of files) {
// //       const filePath = path.join(previewPath, file.path);
// //       const fileDir = path.dirname(filePath);
      
// //       // Create directory if it doesn't exist
// //       await fs.mkdir(fileDir, { recursive: true });
      
// //       // Write file content
// //       await fs.writeFile(filePath, file.content);
// //     }
    
// //     // Try to build and serve the application
// //     try {
// //       // Check if package.json exists
// //       const packageJsonPath = path.join(previewPath, 'package.json');
// //       if (await fs.access(packageJsonPath).then(() => true).catch(() => false)) {
// //         // Install dependencies
// //         execSync('npm install', { cwd: previewPath, stdio: 'pipe' });
        
// //         // Try to build the application
// //         try {
// //           execSync('npm run build', { cwd: previewPath, stdio: 'pipe' });
// //         } catch (buildError) {
// //           console.log('Build failed, serving in development mode');
// //         }
// //       }
// //     } catch (error) {
// //       console.log('Could not install dependencies, serving static files');
// //     }
    
// //     // Return preview URL
// //     res.json({
// //       previewId,
// //       previewUrl: `/preview/${previewId}`
// //     });
    
// //     // Schedule cleanup of preview after 2 hours
// //     setTimeout(async () => {
// //       try {
// //         await fs.rm(previewPath, { recursive: true, force: true });
// //         console.log(`Cleaned up preview: ${previewId}`);
// //       } catch (error) {
// //         console.error(`Error cleaning up preview ${previewId}:`, error);
// //       }
// //     }, 2 * 60 * 60 * 1000); // 2 hours
// //   } catch (error) {
// //     console.error('Preview creation error:', error);
// //     res.status(500).json({ 
// //       error: 'Failed to create preview',
// //       message: error.message 
// //     });
// //   }
// // });

// // // Serve preview files
// // router.get('/preview/:previewId/*', async (req, res) => {
// //   try {
// //     const { previewId } = req.params;
// //     const filePath = req.params[0] || 'index.html';
// //     const fullPath = path.join(PREVIEW_DIR, previewId, filePath);
    
// //     // Check if file exists
// //     try {
// //       await fs.access(fullPath);
      
// //       // Determine content type
// //       const ext = path.extname(fullPath).toLowerCase();
// //       const contentTypes = {
// //         '.html': 'text/html',
// //         '.css': 'text/css',
// //         '.js': 'application/javascript',
// //         '.json': 'application/json',
// //         '.png': 'image/png',
// //         '.jpg': 'image/jpeg',
// //         '.svg': 'image/svg+xml'
// //       };
      
// //       const contentType = contentTypes[ext] || 'text/plain';
// //       res.setHeader('Content-Type', contentType);
      
// //       // Send file
// //       const fileContent = await fs.readFile(fullPath);
// //       res.send(fileContent);
// //     } catch (error) {
// //       // If file doesn't exist, try to serve index.html
// //       try {
// //         const indexPath = path.join(PREVIEW_DIR, previewId, 'index.html');
// //         const indexContent = await fs.readFile(indexPath);
// //         res.setHeader('Content-Type', 'text/html');
// //         res.send(indexContent);
// //       } catch (indexError) {
// //         res.status(404).send('Preview not found');
// //       }
// //     }
// //   } catch (error) {
// //     console.error('Preview serving error:', error);
// //     res.status(500).send('Server error');
// //   }
// // });

// // // Validate code
// // router.post('/validate', async (req, res) => {
// //   try {
// //     const { files } = req.body;
    
// //     // System prompt for code validation
// //     const systemPrompt = `You are a senior code reviewer. Analyze the provided code files for:
// //     1. Syntax errors
// //     2. Missing imports
// //     3. Security vulnerabilities
// //     4. Best practices violations
// //     5. Potential runtime issues
    
// //     Return a JSON response with the following structure:
// //     {
// //       "score": 85,
// //       "status": "good",
// //       "message": "Overall code quality is good with minor issues",
// //       "errors": [
// //         {
// //           "file": "src/App.js",
// //           "line": 15,
// //           "severity": "error",
// //           "message": "Missing import for React"
// //         }
// //       ],
// //       "warnings": [
// //         {
// //           "file": "src/styles.css",
// //           "line": 10,
// //           "message": "Unused CSS class"
// //         }
// //       ],
// //       "suggestions": [
// //         "Consider using TypeScript for better type safety",
// //         "Add unit tests for critical functions"
// //       ],
// //       "security": [
// //         {
// //           "file": "src/api.js",
// //           "issue": "Hardcoded API key",
// //           "recommendation": "Use environment variables for API keys"
// //         }
// //       ],
// //       "missingDependencies": [
// //         "axios",
// //         "lodash"
// //       ],
// //       "fixSuggestions": [
// //         {
// //           "file": "src/App.js",
// //           "line": 15,
// //           "current": "import { Component } from 'react';",
// //           "suggested": "import React, { Component } from 'react';"
// //         }
// //       ]
// //     }`;
    
// //     // Prepare file contents for analysis
// //     const fileContents = files.map(file => ({
// //       path: file.path,
// //       content: file.content
// //     }));
    
// //     // Create user message with file contents
// //     const userMessage = `Please analyze the following code files:\n\n${JSON.stringify(fileContents, null, 2)}`;
    
// //     // Call OpenAI API
// //     const response = await openai.chat.completions.create({
// //       model: 'gpt-4',
// //       messages: [
// //         { role: 'system', content: systemPrompt },
// //         { role: 'user', content: userMessage }
// //       ],
// //       temperature: 0.2,
// //       max_tokens: 4000,
// //     });
    
// //     let validationResult;
// //     try {
// //       // Try to parse the response as JSON
// //       validationResult = JSON.parse(response.choices[0].message.content);
// //     } catch (parseError) {
// //       // If parsing fails, return a default validation result
// //       validationResult = {
// //         score: 70,
// //         status: 'needs-improvement',
// //         message: 'Could not analyze code properly',
// //         errors: [],
// //         warnings: [],
// //         suggestions: [],
// //         security: [],
// //         missingDependencies: [],
// //         fixSuggestions: []
// //       };
// //     }
    
// //     res.json(validationResult);
// //   } catch (error) {
// //     console.error('Validation error:', error);
// //     res.status(500).json({ 
// //       error: 'Failed to validate code',
// //       message: error.message 
// //     });
// //   }
// // });

// // // Export project as ZIP
// // router.post('/export-zip', async (req, res) => {
// //   try {
// //     const { files, projectName } = req.body;
// //     const exportId = uuidv4();
// //     const zipPath = path.join(TEMP_DIR, `${exportId}.zip`);
    
// //     // Create a writable stream
// //     const output = require('fs').createWriteStream(zipPath);
// //     const archive = archiver('zip', { zlib: { level: 9 } });
    
// //     // Listen for all archive data to be written
// //     output.on('close', () => {
// //       console.log(`${archive.pointer()} total bytes`);
// //       console.log('Archiver has been finalized and the output file descriptor has closed.');
      
// //       // Return download URL
// //       res.json({
// //         exportId,
// //         downloadUrl: `/export/${exportId}.zip`
// //       });
      
// //       // Schedule cleanup of export file after 2 hours
// //       setTimeout(async () => {
// //         try {
// //           await fs.unlink(zipPath);
// //           console.log(`Cleaned up export: ${exportId}`);
// //         } catch (error) {
// //           console.error(`Error cleaning up export ${exportId}:`, error);
// //         }
// //       }, 2 * 60 * 60 * 1000); // 2 hours
// //     });
    
// //     // Handle warnings and errors
// //     archive.on('warning', (err) => {
// //       if (err.code === 'ENOENT') {
// //         console.log('Archive warning:', err);
// //       } else {
// //         throw err;
// //       }
// //     });
    
// //     archive.on('error', (err) => {
// //       throw err;
// //     });
    
// //     // Pipe archive data to the file
// //     archive.pipe(output);
    
// //     // Append files to the archive
// //     for (const file of files) {
// //       archive.append(file.content, { name: file.path });
// //     }
    
// //     // Finalize the archive
// //     archive.finalize();
// //   } catch (error) {
// //     console.error('Export error:', error);
// //     res.status(500).json({ 
// //       error: 'Failed to export project',
// //       message: error.message 
// //     });
// //   }
// // });

// // // Serve export files
// // router.get('/export/:exportId', async (req, res) => {
// //   try {
// //     const { exportId } = req.params;
// //     const filePath = path.join(TEMP_DIR, exportId);
    
// //     // Check if file exists
// //     try {
// //       await fs.access(filePath);
      
// //       // Set headers for file download
// //       res.setHeader('Content-Type', 'application/zip');
// //       res.setHeader('Content-Disposition', `attachment; filename="project-${exportId}.zip"`);
      
// //       // Send file
// //       const fileContent = await fs.readFile(filePath);
// //       res.send(fileContent);
// //     } catch (error) {
// //       res.status(404).send('Export not found');
// //     }
// //   } catch (error) {
// //     console.error('Export serving error:', error);
// //     res.status(500).send('Server error');
// //   }
// // });

// // // Get deployment options
// // router.get('/deploy/options', async (req, res) => {
// //   try {
// //     const { applicationType } = req.query;
    
// //     // Define deployment options based on application type
// //     const options = [
// //       {
// //         id: 'ec2',
// //         name: 'AWS EC2',
// //         description: 'Virtual servers with full control over the computing environment',
// //         instanceTypes: [
// //           {
// //             id: 't2.micro',
// //             name: 't2.micro',
// //             hourlyRate: 0.0116,
// //             memory: '1 GiB',
// //             cpu: '1 vCPU',
// //             storage: 'EBS only'
// //           },
// //           {
// //             id: 't3.small',
// //             name: 't3.small',
// //             hourlyRate: 0.023,
// //             memory: '2 GiB',
// //             cpu: '1 vCPU',
// //             storage: 'EBS only'
// //           },
// //           {
// //             id: 't3.medium',
// //             name: 't3.medium',
// //             hourlyRate: 0.046,
// //             memory: '4 GiB',
// //             cpu: '2 vCPUs',
// //             storage: 'EBS only'
// //           }
// //         ],
// //         estimatedCost: {
// //           compute: 8.5,
// //           storage: 2,
// //           bandwidth: 9,
// //           total: 19.5
// //         }
// //       },
// //       {
// //         id: 'ecs',
// //         name: 'AWS ECS Fargate',
// //         description: 'Serverless compute engine for containers without managing servers',
// //         instanceTypes: [
// //           {
// //             id: 'fargate.micro',
// //             name: '0.25 vCPU, 0.5 GB RAM',
// //             hourlyRate: 0.04048,
// //             memory: '0.5 GiB',
// //             cpu: '0.25 vCPU',
// //             storage: 'EFS'
// //           },
// //           {
// //             id: 'fargate.small',
// //             name: '0.5 vCPU, 1 GB RAM',
// //             hourlyRate: 0.08096,
// //             memory: '1 GiB',
// //             cpu: '0.5 vCPU',
// //             storage: 'EFS'
// //           },
// //           {
// //             id: 'fargate.medium',
// //             name: '1 vCPU, 2 GB RAM',
// //             hourlyRate: 0.16192,
// //             memory: '2 GiB',
// //             cpu: '1 vCPU',
// //             storage: 'EFS'
// //           }
// //         ],
// //         estimatedCost: {
// //           compute: 29.5,
// //           storage: 5,
// //           bandwidth: 9,
// //           total: 43.5
// //         }
// //       },
// //       {
// //         id: 'elastic-beanstalk',
// //         name: 'AWS Elastic Beanstalk',
// //         description: 'Easy deployment and scaling of web applications',
// //         instanceTypes: [
// //           {
// //             id: 'eb.micro',
// //             name: 't2.micro',
// //             hourlyRate: 0.0116,
// //             memory: '1 GiB',
// //             cpu: '1 vCPU',
// //             storage: 'EBS only'
// //           },
// //           {
// //             id: 'eb.small',
// //             name: 't3.small',
// //             hourlyRate: 0.023,
// //             memory: '2 GiB',
// //             cpu: '1 vCPU',
// //             storage: 'EBS only'
// //           },
// //           {
// //             id: 'eb.medium',
// //             name: 't3.medium',
// //             hourlyRate: 0.046,
// //             memory: '4 GiB',
// //             cpu: '2 vCPUs',
// //             storage: 'EBS only'
// //           }
// //         ],
// //         estimatedCost: {
// //           compute: 8.5,
// //           storage: 2,
// //           bandwidth: 9,
// //           total: 19.5
// //         }
// //       }
// //     ];
    
// //     // Filter options based on application type if needed
// //     let filteredOptions = options;
// //     if (applicationType === 'mobile') {
// //       // Add mobile-specific options
// //       filteredOptions.push({
// //         id: 'amplify',
// //         name: 'AWS Amplify',
// //         description: 'Build and deploy mobile and web apps',
// //         instanceTypes: [
// //           {
// //             id: 'amplify.free',
// //             name: 'Free Tier',
// //             hourlyRate: 0,
// //             memory: 'Included',
// //             cpu: 'Included',
// //             storage: '10 GB'
// //           },
// //           {
// //             id: 'amplify.standard',
// //             name: 'Standard',
// //             hourlyRate: 0.02,
// //             memory: '1 GB',
// //             cpu: '1 vCPU',
// //             storage: '100 GB'
// //           }
// //         ],
// //         estimatedCost: {
// //           compute: 0,
// //           storage: 0,
// //           bandwidth: 5,
// //           total: 5
// //         }
// //       });
// //     }
    
// //     res.json(filteredOptions);
// //   } catch (error) {
// //     console.error('Deployment options error:', error);
// //     res.status(500).json({ 
// //       error: 'Failed to get deployment options',
// //       message: error.message 
// //     });
// //   }
// // });

// // // Deploy project to AWS
// // router.post('/deploy/launch', async (req, res) => {
// //   try {
// //     const { 
// //       projectFiles, 
// //       projectName, 
// //       applicationType, 
// //       deploymentOption, 
// //       instanceType, 
// //       region, 
// //       awsCredentials 
// //     } = req.body;
    
// //     // Configure AWS with credentials
// //     AWS.config.update({
// //       accessKeyId: awsCredentials.accessKeyId,
// //       secretAccessKey: awsCredentials.secretAccessKey,
// //       region: region
// //     });
    
// //     // Create a unique deployment ID
// //     const deploymentId = uuidv4();
    
// //     // Deployment logic based on option
// //     let deploymentResult;
    
// //     if (deploymentOption === 'ec2') {
// //       deploymentResult = await deployToEC2({
// //         projectFiles,
// //         projectName,
// //         instanceType,
// //         region,
// //         deploymentId
// //       });
// //     } else if (deploymentOption === 'ecs') {
// //       deploymentResult = await deployToECS({
// //         projectFiles,
// //         projectName,
// //         instanceType,
// //         region,
// //         deploymentId
// //       });
// //     } else if (deploymentOption === 'elastic-beanstalk') {
// //       deploymentResult = await deployToElasticBeanstalk({
// //         projectFiles,
// //         projectName,
// //         instanceType,
// //         region,
// //         deploymentId
// //       });
// //     } else if (deploymentOption === 'amplify') {
// //       deploymentResult = await deployToAmplify({
// //         projectFiles,
// //         projectName,
// //         region,
// //         deploymentId
// //       });
// //     } else {
// //       throw new Error(`Unsupported deployment option: ${deploymentOption}`);
// //     }
    
// //     res.json({
// //       deploymentId,
// //       ...deploymentResult
// //     });
// //   } catch (error) {
// //     console.error('Deployment error:', error);
// //     res.status(500).json({ 
// //       error: 'Failed to deploy project',
// //       message: error.message 
// //     });
// //   }
// // });

// // // Helper function for EC2 deployment
// // async function deployToEC2({ projectFiles, projectName, instanceType, region, deploymentId }) {
// //   const ec2 = new AWS.EC2();
  
// //   // Create user data script to set up the instance
// //   let userDataScript = `#!/bin/bash
// // yum update -y
// // yum install -y git
// // cd /home/ec2-user
// // git clone https://github.com/aws/amazon-ec2-instance-setup.git
// // cd amazon-ec2-instance-setup
// // chmod +x amazon-ec2-instance-setup.sh
// // ./amazon-ec2-instance-setup.sh
// // cd /home/ec2-user
// // yum install -y nodejs npm
// // mkdir -p /var/www/html
// // cd /var/www/html
// // `;
  
// //   // Add file creation commands for each project file
// //   for (const file of projectFiles) {
// //     const filePath = file.path;
// //     const fileContent = file.content.replace(/"/g, '\\"').replace(/\$/g, '\\$');
// //     userDataScript += `mkdir -p $(dirname "${filePath}")\n`;
// //     userDataScript += `cat > "${filePath}" << 'EOL'\n${fileContent}\nEOL\n`;
// //   }
  
// //   // Add commands to install dependencies and start the application
// //   userDataScript += `
// // if [ -f "package.json" ]; then
// //   npm install
// //   if grep -q "\"start\"" package.json; then
// //     nohup npm start > /dev/null 2>&1 &
// //   elif grep -q "\"dev\"" package.json; then
// //     nohup npm run dev > /dev/null 2>&1 &
// //   else
// //     nohup npx serve -s build -l 3000 > /dev/null 2>&1 &
// //   fi
// // else
// //   nohup python3 -m http.server 3000 > /dev/null 2>&1 &
// // fi
// // `;
  
// //   // Create security group
// //   const securityGroupParams = {
// //     Description: `Security group for ${projectName}`,
// //     GroupName: `${projectName}-${deploymentId}`,
// //     IpPermissions: [
// //       {
// //         IpProtocol: 'tcp',
// //         FromPort: 22,
// //         ToPort: 22,
// //         IpRanges: [{ CidrIp: '0.0.0.0/0' }]
// //       },
// //       {
// //         IpProtocol: 'tcp',
// //         FromPort: 80,
// //         ToPort: 80,
// //         IpRanges: [{ CidrIp: '0.0.0.0/0' }]
// //       },
// //       {
// //         IpProtocol: 'tcp',
// //         FromPort: 443,
// //         ToPort: 443,
// //         IpRanges: [{ CidrIp: '0.0.0.0/0' }]
// //       },
// //       {
// //         IpProtocol: 'tcp',
// //         FromPort: 3000,
// //         ToPort: 3000,
// //         IpRanges: [{ CidrIp: '0.0.0.0/0' }]
// //       }
// //     ]
// //   };
  
// //   const securityGroup = await ec2.createSecurityGroup(securityGroupParams).promise();
  
// //   // Launch EC2 instance
// //   const instanceParams = {
// //     ImageId: 'ami-0c55b159cbfafe1f0', // Amazon Linux 2 AMI
// //     InstanceType: instanceType,
// //     MinCount: 1,
// //     MaxCount: 1,
// //     SecurityGroupIds: [securityGroup.GroupId],
// //     UserData: Buffer.from(userDataScript).toString('base64'),
// //     TagSpecifications: [
// //       {
// //         ResourceType: 'instance',
// //         Tags: [
// //           {
// //             Key: 'Name',
// //             Value: `${projectName}-${deploymentId}`
// //           }
// //         ]
// //       }
// //     ]
// //   };
  
// //   const instanceData = await ec2.runInstances(instanceParams).promise();
// //   const instanceId = instanceData.Instances[0].InstanceId;
  
// //   // Wait for instance to be running
// //   await ec2.waitFor('instanceRunning', { InstanceIds: [instanceId] }).promise();
  
// //   // Get public IP address
// //   const instanceDetails = await ec2.describeInstances({ InstanceIds: [instanceId] }).promise();
// //   const publicIp = instanceDetails.Reservations[0].Instances[0].PublicIpAddress;
  
// //   // Calculate estimated monthly cost
// //   const instanceTypeInfo = {
// //     't2.micro': 0.0116,
// //     't3.small': 0.023,
// //     't3.medium': 0.046
// //   };
  
// //   const hourlyRate = instanceTypeInfo[instanceType] || 0.023;
// //   const monthlyHours = 730; // Average hours in a month
// //   const computeCost = hourlyRate * monthlyHours;
// //   const storageCost = 10; // Estimated storage cost
// //   const bandwidthCost = 10; // Estimated bandwidth cost
// //   const totalCost = computeCost + storageCost + bandwidthCost;
  
// //   return {
// //     url: `http://${publicIp}:3000`,
// //     instanceId,
// //     region,
// //     estimatedCost: totalCost.toFixed(2)
// //   };
// // }

// // // Helper function for ECS deployment
// // async function deployToECS({ projectFiles, projectName, instanceType, region, deploymentId }) {
// //   // This is a simplified implementation
// //   // In a real-world scenario, you would need to:
// //   // 1. Create ECR repository
// //   // 2. Build and push Docker image
// //   // 3. Create ECS task definition
// //   // 4. Create ECS service
// //   // 5. Set up load balancer
  
// //   return {
// //     url: `http://${projectName}-${deploymentId}.${region}.elb.amazonaws.com`,
// //     serviceArn: `arn:aws:ecs:${region}:123456789012:service/${projectName}-${deploymentId}`,
// //     region,
// //     estimatedCost: '43.50'
// //   };
// // }

// // // Helper function for Elastic Beanstalk deployment
// // async function deployToElasticBeanstalk({ projectFiles, projectName, instanceType, region, deploymentId }) {
// //   // This is a simplified implementation
// //   // In a real-world scenario, you would need to:
// //   // 1. Create S3 bucket
// //   // 2. Create application bundle
// //   // 3. Upload to S3
// //   // 4. Create Elastic Beanstalk application
// //   // 5. Create environment and deploy
  
// //   return {
// //     url: `http://${projectName}-${deploymentId}.${region}.elasticbeanstalk.com`,
// //     environmentId: `e-${deploymentId.substring(0, 12)}`,
// //     region,
// //     estimatedCost: '19.50'
// //   };
// // }

// // // Helper function for Amplify deployment
// // async function deployToAmplify({ projectFiles, projectName, region, deploymentId }) {
// //   // This is a simplified implementation
// //   // In a real-world scenario, you would need to:
// //   // 1. Create Amplify app
// //   // 2. Connect to repository
// //   // 3. Configure build settings
// //   // 4. Deploy
  
// //   return {
// //     url: `https://${deploymentId.substring(0, 12)}.amplifyapp.com`,
// //     appId: deploymentId,
// //     region,
// //     estimatedCost: '5.00'
// //   };
// // }

// // module.exports = router;


// // backend/routes/api.js
// const express = require('express');
// const router = express.Router();
// const fs = require('fs').promises;
// const path = require('path');
// const { v4: uuidv4 } = require('uuid');
// const archiver = require('archiver');
// const AWS = require('aws-sdk');
// const { execSync } = require('child_process');
// const OpenAI = require('openai');

// // Initialize OpenAI with API key from environment variables
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Directory for temporary files
// const TEMP_DIR = path.join(__dirname, '../temp');
// const PREVIEW_DIR = path.join(__dirname, '../previews');

// // Ensure temp directories exist
// const ensureDirectories = async () => {
//   try {
//     await fs.mkdir(TEMP_DIR, { recursive: true });
//     await fs.mkdir(PREVIEW_DIR, { recursive: true });
//   } catch (error) {
//     console.error('Error creating directories:', error);
//   }
// };

// ensureDirectories();

// // Helper function to detect language from file extension
// const detectLanguage = (filePath) => {
//   const ext = path.extname(filePath).toLowerCase();
//   const langMap = {
//     '.js': 'javascript',
//     '.jsx': 'jsx',
//     '.ts': 'typescript',
//     '.tsx': 'tsx',
//     '.html': 'html',
//     '.css': 'css',
//     '.scss': 'scss',
//     '.json': 'json',
//     '.py': 'python',
//     '.java': 'java',
//     '.go': 'go',
//     '.rs': 'rust',
//     '.md': 'markdown',
//     '.yaml': 'yaml',
//     '.yml': 'yaml'
//   };
//   return langMap[ext] || 'plaintext';
// };

// // Generate code using OpenAI
// router.post('/generate', async (req, res) => {
//   try {
//     const { prompt, projectId, stack, conversationHistory } = req.body;
    
//     // Check if OpenAI API key is configured
//     if (!process.env.OPENAI_API_KEY) {
//       console.error('OpenAI API key not configured');
//       return res.status(500).json({ 
//         error: 'OpenAI API key not configured',
//         message: 'Please set OPENAI_API_KEY in your .env file'
//       });
//     }
    
//     // Parse stack if it's a string
//     let stackConfig;
//     try {
//       stackConfig = typeof stack === 'string' ? JSON.parse(stack) : stack;
//     } catch (e) {
//       stackConfig = {
//         frontend: 'React + Vite',
//         backend: 'Node.js + Express',
//         database: 'None',
//         styling: 'Tailwind CSS'
//       };
//     }
    
//     // System prompt for code generation
//     const systemPrompt = `You are a senior full-stack engineer and UI/UX developer. 
//     Produce production-ready, well-documented code and supporting files. 
//     When generating code, make clear file paths, include all necessary package.json updates, 
//     and return a ZIP-able project structure. Use secure practices (do not hard-code secrets). 
//     Comment clearly and keep each file under 300 lines if possible.
    
//     Generate a complete ${stackConfig.frontend} application with ${stackConfig.backend} backend 
//     and ${stackConfig.database} database based on the user's request: "${prompt}"
    
//     Return a JSON response with the following structure:
//     {
//       "applicationType": "web",
//       "description": "Brief description of the generated application",
//       "files": [
//         {
//           "path": "relative/path/to/file",
//           "content": "file content",
//           "language": "javascript"
//         }
//       ]
//     }`;

//     // Create conversation array with system prompt and user messages
//     const messages = [
//       { role: 'system', content: systemPrompt },
//       ...(conversationHistory || []),
//       { role: 'user', content: prompt }
//     ];

//     console.log('Sending request to OpenAI...');
    
//     // Call OpenAI API
//     const response = await openai.chat.completions.create({
//       model: 'gpt-4',
//       messages: messages,
//       temperature: 0.2,
//       max_tokens: 4000,
//     });

//     let projectData;
//     try {
//       // Try to parse the response as JSON
//       projectData = JSON.parse(response.choices[0].message.content);
//       console.log('Successfully parsed OpenAI response');
//     } catch (parseError) {
//       console.error('Failed to parse OpenAI response as JSON:', parseError);
//       console.log('Raw response:', response.choices[0].message.content);
      
//       // If parsing fails, return the raw response
//       return res.json({
//         reply: response.choices[0].message.content
//       });
//     }

//     // Ensure each file has a language property
//     if (projectData.files) {
//       projectData.files = projectData.files.map(file => ({
//         ...file,
//         language: file.language || detectLanguage(file.path)
//       }));
//     }

//     console.log(`Generated ${projectData.files?.length || 0} files for project`);
    
//     res.json({
//       projectData
//     });
//   } catch (error) {
//     console.error('Generation error:', error);
//     res.status(500).json({ 
//       error: 'Failed to generate code',
//       message: error.message 
//     });
//   }
// });

// // Create preview of the generated application
// router.post('/preview', async (req, res) => {
//   try {
//     const { projectId, files } = req.body;
//     const previewId = uuidv4();
//     const previewPath = path.join(PREVIEW_DIR, previewId);
    
//     console.log(`Creating preview ${previewId} with ${files.length} files`);
    
//     // Create preview directory
//     await fs.mkdir(previewPath, { recursive: true });
    
//     // Write all files to the preview directory
//     for (const file of files) {
//       const filePath = path.join(previewPath, file.path);
//       const fileDir = path.dirname(filePath);
      
//       // Create directory if it doesn't exist
//       await fs.mkdir(fileDir, { recursive: true });
      
//       // Write file content
//       await fs.writeFile(filePath, file.content);
//     }
    
//     // Try to build and serve the application
//     try {
//       // Check if package.json exists
//       const packageJsonPath = path.join(previewPath, 'package.json');
//       if (await fs.access(packageJsonPath).then(() => true).catch(() => false)) {
//         console.log('Installing dependencies for preview...');
//         // Install dependencies
//         execSync('npm install', { cwd: previewPath, stdio: 'pipe' });
        
//         // Try to build the application
//         try {
//           console.log('Building application for preview...');
//           execSync('npm run build', { cwd: previewPath, stdio: 'pipe' });
//         } catch (buildError) {
//           console.log('Build failed, serving in development mode:', buildError.message);
//         }
//       }
//     } catch (error) {
//       console.log('Could not install dependencies, serving static files:', error.message);
//     }
    
//     // Return preview URL
//     res.json({
//       previewId,
//       previewUrl: `/preview/${previewId}`
//     });
    
//     // Schedule cleanup of preview after 2 hours
//     setTimeout(async () => {
//       try {
//         await fs.rm(previewPath, { recursive: true, force: true });
//         console.log(`Cleaned up preview: ${previewId}`);
//       } catch (error) {
//         console.error(`Error cleaning up preview ${previewId}:`, error);
//       }
//     }, 2 * 60 * 60 * 1000); // 2 hours
//   } catch (error) {
//     console.error('Preview creation error:', error);
//     res.status(500).json({ 
//       error: 'Failed to create preview',
//       message: error.message 
//     });
//   }
// });

// // Serve preview files
// router.get('/preview/:previewId/*', async (req, res) => {
//   try {
//     const { previewId } = req.params;
//     const filePath = req.params[0] || 'index.html';
//     const fullPath = path.join(PREVIEW_DIR, previewId, filePath);
    
//     // Check if file exists
//     try {
//       await fs.access(fullPath);
      
//       // Determine content type
//       const ext = path.extname(fullPath).toLowerCase();
//       const contentTypes = {
//         '.html': 'text/html',
//         '.css': 'text/css',
//         '.js': 'application/javascript',
//         '.json': 'application/json',
//         '.png': 'image/png',
//         '.jpg': 'image/jpeg',
//         '.svg': 'image/svg+xml'
//       };
      
//       const contentType = contentTypes[ext] || 'text/plain';
//       res.setHeader('Content-Type', contentType);
      
//       // Send file
//       const fileContent = await fs.readFile(fullPath);
//       res.send(fileContent);
//     } catch (error) {
//       // If file doesn't exist, try to serve index.html
//       try {
//         const indexPath = path.join(PREVIEW_DIR, previewId, 'index.html');
//         const indexContent = await fs.readFile(indexPath);
//         res.setHeader('Content-Type', 'text/html');
//         res.send(indexContent);
//       } catch (indexError) {
//         res.status(404).send('Preview not found');
//       }
//     }
//   } catch (error) {
//     console.error('Preview serving error:', error);
//     res.status(500).send('Server error');
//   }
// });

// // Validate code
// router.post('/validate', async (req, res) => {
//   try {
//     const { files } = req.body;
    
//     // System prompt for code validation
//     const systemPrompt = `You are a senior code reviewer. Analyze the provided code files for:
//     1. Syntax errors
//     2. Missing imports
//     3. Security vulnerabilities
//     4. Best practices violations
//     5. Potential runtime issues
    
//     Return a JSON response with the following structure:
//     {
//       "score": 85,
//       "status": "good",
//       "message": "Overall code quality is good with minor issues",
//       "errors": [
//         {
//           "file": "src/App.js",
//           "line": 15,
//           "severity": "error",
//           "message": "Missing import for React"
//         }
//       ],
//       "warnings": [
//         {
//           "file": "src/styles.css",
//           "line": 10,
//           "message": "Unused CSS class"
//         }
//       ],
//       "suggestions": [
//         "Consider using TypeScript for better type safety",
//         "Add unit tests for critical functions"
//       ],
//       "security": [
//         {
//           "file": "src/api.js",
//           "issue": "Hardcoded API key",
//           "recommendation": "Use environment variables for API keys"
//         }
//       ],
//       "missingDependencies": [
//         "axios",
//         "lodash"
//       ],
//       "fixSuggestions": [
//         {
//           "file": "src/App.js",
//           "line": 15,
//           "current": "import { Component } from 'react';",
//           "suggested": "import React, { Component } from 'react';"
//         }
//       ]
//     }`;
    
//     // Prepare file contents for analysis
//     const fileContents = files.map(file => ({
//       path: file.path,
//       content: file.content
//     }));
    
//     // Create user message with file contents
//     const userMessage = `Please analyze the following code files:\n\n${JSON.stringify(fileContents, null, 2)}`;
    
//     // Call OpenAI API
//     const response = await openai.chat.completions.create({
//       model: 'gpt-4',
//       messages: [
//         { role: 'system', content: systemPrompt },
//         { role: 'user', content: userMessage }
//       ],
//       temperature: 0.2,
//       max_tokens: 4000,
//     });
    
//     let validationResult;
//     try {
//       // Try to parse the response as JSON
//       validationResult = JSON.parse(response.choices[0].message.content);
//     } catch (parseError) {
//       // If parsing fails, return a default validation result
//       validationResult = {
//         score: 70,
//         status: 'needs-improvement',
//         message: 'Could not analyze code properly',
//         errors: [],
//         warnings: [],
//         suggestions: [],
//         security: [],
//         missingDependencies: [],
//         fixSuggestions: []
//       };
//     }
    
//     res.json(validationResult);
//   } catch (error) {
//     console.error('Validation error:', error);
//     res.status(500).json({ 
//       error: 'Failed to validate code',
//       message: error.message 
//     });
//   }
// });

// // Export project as ZIP
// router.post('/export-zip', async (req, res) => {
//   try {
//     const { files, projectName } = req.body;
//     const exportId = uuidv4();
//     const zipPath = path.join(TEMP_DIR, `${exportId}.zip`);
    
//     // Create a writable stream
//     const output = require('fs').createWriteStream(zipPath);
//     const archive = archiver('zip', { zlib: { level: 9 } });
    
//     // Listen for all archive data to be written
//     output.on('close', () => {
//       console.log(`${archive.pointer()} total bytes`);
//       console.log('Archiver has been finalized and the output file descriptor has closed.');
      
//       // Return download URL
//       res.json({
//         exportId,
//         downloadUrl: `/export/${exportId}.zip`
//       });
      
//       // Schedule cleanup of export file after 2 hours
//       setTimeout(async () => {
//         try {
//           await fs.unlink(zipPath);
//           console.log(`Cleaned up export: ${exportId}`);
//         } catch (error) {
//           console.error(`Error cleaning up export ${exportId}:`, error);
//         }
//       }, 2 * 60 * 60 * 1000); // 2 hours
//     });
    
//     // Handle warnings and errors
//     archive.on('warning', (err) => {
//       if (err.code === 'ENOENT') {
//         console.log('Archive warning:', err);
//       } else {
//         throw err;
//       }
//     });
    
//     archive.on('error', (err) => {
//       throw err;
//     });
    
//     // Pipe archive data to the file
//     archive.pipe(output);
    
//     // Append files to the archive
//     for (const file of files) {
//       archive.append(file.content, { name: file.path });
//     }
    
//     // Finalize the archive
//     archive.finalize();
//   } catch (error) {
//     console.error('Export error:', error);
//     res.status(500).json({ 
//       error: 'Failed to export project',
//       message: error.message 
//     });
//   }
// });

// // Serve export files
// router.get('/export/:exportId', async (req, res) => {
//   try {
//     const { exportId } = req.params;
//     const filePath = path.join(TEMP_DIR, exportId);
    
//     // Check if file exists
//     try {
//       await fs.access(filePath);
      
//       // Set headers for file download
//       res.setHeader('Content-Type', 'application/zip');
//       res.setHeader('Content-Disposition', `attachment; filename="project-${exportId}.zip"`);
      
//       // Send file
//       const fileContent = await fs.readFile(filePath);
//       res.send(fileContent);
//     } catch (error) {
//       res.status(404).send('Export not found');
//     }
//   } catch (error) {
//     console.error('Export serving error:', error);
//     res.status(500).send('Server error');
//   }
// });

// // Get deployment options
// router.get('/deploy/options', async (req, res) => {
//   try {
//     const { applicationType } = req.query;
    
//     // Define deployment options based on application type
//     const options = [
//       {
//         id: 'ec2',
//         name: 'AWS EC2',
//         description: 'Virtual servers with full control over the computing environment',
//         instanceTypes: [
//           {
//             id: 't2.micro',
//             name: 't2.micro',
//             hourlyRate: 0.0116,
//             memory: '1 GiB',
//             cpu: '1 vCPU',
//             storage: 'EBS only'
//           },
//           {
//             id: 't3.small',
//             name: 't3.small',
//             hourlyRate: 0.023,
//             memory: '2 GiB',
//             cpu: '1 vCPU',
//             storage: 'EBS only'
//           },
//           {
//             id: 't3.medium',
//             name: 't3.medium',
//             hourlyRate: 0.046,
//             memory: '4 GiB',
//             cpu: '2 vCPUs',
//             storage: 'EBS only'
//           }
//         ],
//         estimatedCost: {
//           compute: 8.5,
//           storage: 2,
//           bandwidth: 9,
//           total: 19.5
//         }
//       },
//       {
//         id: 'ecs',
//         name: 'AWS ECS Fargate',
//         description: 'Serverless compute engine for containers without managing servers',
//         instanceTypes: [
//           {
//             id: 'fargate.micro',
//             name: '0.25 vCPU, 0.5 GB RAM',
//             hourlyRate: 0.04048,
//             memory: '0.5 GiB',
//             cpu: '0.25 vCPU',
//             storage: 'EFS'
//           },
//           {
//             id: 'fargate.small',
//             name: '0.5 vCPU, 1 GB RAM',
//             hourlyRate: 0.08096,
//             memory: '1 GiB',
//             cpu: '0.5 vCPU',
//             storage: 'EFS'
//           },
//           {
//             id: 'fargate.medium',
//             name: '1 vCPU, 2 GB RAM',
//             hourlyRate: 0.16192,
//             memory: '2 GiB',
//             cpu: '1 vCPU',
//             storage: 'EFS'
//           }
//         ],
//         estimatedCost: {
//           compute: 29.5,
//           storage: 5,
//           bandwidth: 9,
//           total: 43.5
//         }
//       },
//       {
//         id: 'elastic-beanstalk',
//         name: 'AWS Elastic Beanstalk',
//         description: 'Easy deployment and scaling of web applications',
//         instanceTypes: [
//           {
//             id: 'eb.micro',
//             name: 't2.micro',
//             hourlyRate: 0.0116,
//             memory: '1 GiB',
//             cpu: '1 vCPU',
//             storage: 'EBS only'
//           },
//           {
//             id: 'eb.small',
//             name: 't3.small',
//             hourlyRate: 0.023,
//             memory: '2 GiB',
//             cpu: '1 vCPU',
//             storage: 'EBS only'
//           },
//           {
//             id: 'eb.medium',
//             name: 't3.medium',
//             hourlyRate: 0.046,
//             memory: '4 GiB',
//             cpu: '2 vCPUs',
//             storage: 'EBS only'
//           }
//         ],
//         estimatedCost: {
//           compute: 8.5,
//           storage: 2,
//           bandwidth: 9,
//           total: 19.5
//         }
//       }
//     ];
    
//     // Filter options based on application type if needed
//     let filteredOptions = options;
//     if (applicationType === 'mobile') {
//       // Add mobile-specific options
//       filteredOptions.push({
//         id: 'amplify',
//         name: 'AWS Amplify',
//         description: 'Build and deploy mobile and web apps',
//         instanceTypes: [
//           {
//             id: 'amplify.free',
//             name: 'Free Tier',
//             hourlyRate: 0,
//             memory: 'Included',
//             cpu: 'Included',
//             storage: '10 GB'
//           },
//           {
//             id: 'amplify.standard',
//             name: 'Standard',
//             hourlyRate: 0.02,
//             memory: '1 GB',
//             cpu: '1 vCPU',
//             storage: '100 GB'
//           }
//         ],
//         estimatedCost: {
//           compute: 0,
//           storage: 0,
//           bandwidth: 5,
//           total: 5
//         }
//       });
//     }
    
//     res.json(filteredOptions);
//   } catch (error) {
//     console.error('Deployment options error:', error);
//     res.status(500).json({ 
//       error: 'Failed to get deployment options',
//       message: error.message 
//     });
//   }
// });

// // Deploy project to AWS
// router.post('/deploy/launch', async (req, res) => {
//   try {
//     const { 
//       projectFiles, 
//       projectName, 
//       applicationType, 
//       deploymentOption, 
//       instanceType, 
//       region, 
//       awsCredentials 
//     } = req.body;
    
//     // Configure AWS with credentials
//     AWS.config.update({
//       accessKeyId: awsCredentials.accessKeyId,
//       secretAccessKey: awsCredentials.secretAccessKey,
//       region: region
//     });
    
//     // Create a unique deployment ID
//     const deploymentId = uuidv4();
    
//     // Deployment logic based on option
//     let deploymentResult;
    
//     if (deploymentOption === 'ec2') {
//       deploymentResult = await deployToEC2({
//         projectFiles,
//         projectName,
//         instanceType,
//         region,
//         deploymentId
//       });
//     } else if (deploymentOption === 'ecs') {
//       deploymentResult = await deployToECS({
//         projectFiles,
//         projectName,
//         instanceType,
//         region,
//         deploymentId
//       });
//     } else if (deploymentOption === 'elastic-beanstalk') {
//       deploymentResult = await deployToElasticBeanstalk({
//         projectFiles,
//         projectName,
//         instanceType,
//         region,
//         deploymentId
//       });
//     } else if (deploymentOption === 'amplify') {
//       deploymentResult = await deployToAmplify({
//         projectFiles,
//         projectName,
//         region,
//         deploymentId
//       });
//     } else {
//       throw new Error(`Unsupported deployment option: ${deploymentOption}`);
//     }
    
//     res.json({
//       deploymentId,
//       ...deploymentResult
//     });
//   } catch (error) {
//     console.error('Deployment error:', error);
//     res.status(500).json({ 
//       error: 'Failed to deploy project',
//       message: error.message 
//     });
//   }
// });

// // Helper function for EC2 deployment
// async function deployToEC2({ projectFiles, projectName, instanceType, region, deploymentId }) {
//   const ec2 = new AWS.EC2();
  
//   // Create user data script to set up the instance
//   let userDataScript = `#!/bin/bash
// yum update -y
// yum install -y git
// cd /home/ec2-user
// git clone https://github.com/aws/amazon-ec2-instance-setup.git
// cd amazon-ec2-instance-setup
// chmod +x amazon-ec2-instance-setup.sh
// ./amazon-ec2-instance-setup.sh
// cd /home/ec2-user
// yum install -y nodejs npm
// mkdir -p /var/www/html
// cd /var/www/html
// `;
  
//   // Add file creation commands for each project file
//   for (const file of projectFiles) {
//     const filePath = file.path;
//     const fileContent = file.content.replace(/"/g, '\\"').replace(/\$/g, '\\$');
//     userDataScript += `mkdir -p $(dirname "${filePath}")\n`;
//     userDataScript += `cat > "${filePath}" << 'EOL'\n${fileContent}\nEOL\n`;
//   }
  
//   // Add commands to install dependencies and start the application
//   userDataScript += `
// if [ -f "package.json" ]; then
//   npm install
//   if grep -q "\"start\"" package.json; then
//     nohup npm start > /dev/null 2>&1 &
//   elif grep -q "\"dev\"" package.json; then
//     nohup npm run dev > /dev/null 2>&1 &
//   else
//     nohup npx serve -s build -l 3000 > /dev/null 2>&1 &
//   fi
// else
//   nohup python3 -m http.server 3000 > /dev/null 2>&1 &
// fi
// `;
  
//   // Create security group
//   const securityGroupParams = {
//     Description: `Security group for ${projectName}`,
//     GroupName: `${projectName}-${deploymentId}`,
//     IpPermissions: [
//       {
//         IpProtocol: 'tcp',
//         FromPort: 22,
//         ToPort: 22,
//         IpRanges: [{ CidrIp: '0.0.0.0/0' }]
//       },
//       {
//         IpProtocol: 'tcp',
//         FromPort: 80,
//         ToPort: 80,
//         IpRanges: [{ CidrIp: '0.0.0.0/0' }]
//       },
//       {
//         IpProtocol: 'tcp',
//         FromPort: 443,
//         ToPort: 443,
//         IpRanges: [{ CidrIp: '0.0.0.0/0' }]
//       },
//       {
//         IpProtocol: 'tcp',
//         FromPort: 3000,
//         ToPort: 3000,
//         IpRanges: [{ CidrIp: '0.0.0.0/0' }]
//       }
//     ]
//   };
  
//   const securityGroup = await ec2.createSecurityGroup(securityGroupParams).promise();
  
//   // Launch EC2 instance
//   const instanceParams = {
//     ImageId: 'ami-0c55b159cbfafe1f0', // Amazon Linux 2 AMI
//     InstanceType: instanceType,
//     MinCount: 1,
//     MaxCount: 1,
//     SecurityGroupIds: [securityGroup.GroupId],
//     UserData: Buffer.from(userDataScript).toString('base64'),
//     TagSpecifications: [
//       {
//         ResourceType: 'instance',
//         Tags: [
//           {
//             Key: 'Name',
//             Value: `${projectName}-${deploymentId}`
//           }
//         ]
//       }
//     ]
//   };
  
//   const instanceData = await ec2.runInstances(instanceParams).promise();
//   const instanceId = instanceData.Instances[0].InstanceId;
  
//   // Wait for instance to be running
//   await ec2.waitFor('instanceRunning', { InstanceIds: [instanceId] }).promise();
  
//   // Get public IP address
//   const instanceDetails = await ec2.describeInstances({ InstanceIds: [instanceId] }).promise();
//   const publicIp = instanceDetails.Reservations[0].Instances[0].PublicIpAddress;
  
//   // Calculate estimated monthly cost
//   const instanceTypeInfo = {
//     't2.micro': 0.0116,
//     't3.small': 0.023,
//     't3.medium': 0.046
//   };
  
//   const hourlyRate = instanceTypeInfo[instanceType] || 0.023;
//   const monthlyHours = 730; // Average hours in a month
//   const computeCost = hourlyRate * monthlyHours;
//   const storageCost = 10; // Estimated storage cost
//   const bandwidthCost = 10; // Estimated bandwidth cost
//   const totalCost = computeCost + storageCost + bandwidthCost;
  
//   return {
//     url: `http://${publicIp}:3000`,
//     instanceId,
//     region,
//     estimatedCost: totalCost.toFixed(2)
//   };
// }

// // Helper function for ECS deployment
// async function deployToECS({ projectFiles, projectName, instanceType, region, deploymentId }) {
//   // This is a simplified implementation
//   // In a real-world scenario, you would need to:
//   // 1. Create ECR repository
//   // 2. Build and push Docker image
//   // 3. Create ECS task definition
//   // 4. Create ECS service
//   // 5. Set up load balancer
  
//   return {
//     url: `http://${projectName}-${deploymentId}.${region}.elb.amazonaws.com`,
//     serviceArn: `arn:aws:ecs:${region}:123456789012:service/${projectName}-${deploymentId}`,
//     region,
//     estimatedCost: '43.50'
//   };
// }

// // Helper function for Elastic Beanstalk deployment
// async function deployToElasticBeanstalk({ projectFiles, projectName, instanceType, region, deploymentId }) {
//   // This is a simplified implementation
//   // In a real-world scenario, you would need to:
//   // 1. Create S3 bucket
//   // 2. Create application bundle
//   // 3. Upload to S3
//   // 4. Create Elastic Beanstalk application
//   // 5. Create environment and deploy
  
//   return {
//     url: `http://${projectName}-${deploymentId}.${region}.elasticbeanstalk.com`,
//     environmentId: `e-${deploymentId.substring(0, 12)}`,
//     region,
//     estimatedCost: '19.50'
//   };
// }

// // Helper function for Amplify deployment
// async function deployToAmplify({ projectFiles, projectName, region, deploymentId }) {
//   // This is a simplified implementation
//   // In a real-world scenario, you would need to:
//   // 1. Create Amplify app
//   // 2. Connect to repository
//   // 3. Configure build settings
//   // 4. Deploy
  
//   return {
//     url: `https://${deploymentId.substring(0, 12)}.amplifyapp.com`,
//     appId: deploymentId,
//     region,
//     estimatedCost: '5.00'
//   };
// }

// module.exports = router;

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const mejuvanteApi = {
  async generate(data: {
    prompt: string;
    projectId: string;
    stack: string;
    conversationHistory: any[];
  }) {
    const response = await fetch(`${API_URL}/api/chat/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Generation failed: ${response.statusText}`);
    }

    return await response.json();
  },

  async createPreview(data: { projectId: string; files: any[] }) {
    const response = await fetch(`${API_URL}/api/preview/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Preview creation failed: ${response.statusText}`);
    }

    return await response.json();
  },

  async validateCode(files: any[]) {
    const response = await fetch(`${API_URL}/api/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files })
    });

    if (!response.ok) {
      throw new Error(`Validation failed: ${response.statusText}`);
    }

    return await response.json();
  },

  async exportZip(data: { files: any[]; projectName: string }) {
    const response = await fetch(`${API_URL}/api/export/prepare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    return await response.json();
  }
};

export const projectApi = {
  async create(data: any) {
    // Your existing implementation
    return {
      id: Date.now().toString(),
      ...data
    };
  },

  async getById(id: string) {
    // Your existing implementation
    return {
      id,
      name: 'Project',
      files: [],
      chatHistory: []
    };
  },

  async update(id: string, data: any) {
    // Your existing implementation
    return { id, ...data };
  }
};