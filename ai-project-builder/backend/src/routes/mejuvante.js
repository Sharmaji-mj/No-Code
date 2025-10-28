
// // ---------- Terminal (single, clean version) ----------
// router.post('/terminal/execute', async (req, res) => {
//   try {
//     const { projectId, command } = req.body;
//     if (!command) return res.status(400).json({ success: false, message: 'Command is required' });

//     const processingTime = Math.floor(Math.random() * 1000) + 300;
//     await new Promise((r) => setTimeout(r, processingTime));

//     const [cmd, ...args] = command.trim().split(' ');
//     let output = '';
//     let exitCode = 0;

//     switch (cmd) {
//       case 'npm':
//         if (args[0] === 'install') {
//           const pkgs = args.slice(1);
//           output =
//             pkgs.length === 0
//               ? `npm install\n\n✅ Dependencies installed from package.json in ${processingTime}ms`
//               : `npm install ${pkgs.join(' ')}\n\n✅ Installed:\n${pkgs.map((p) => `+ ${p}@latest`).join('\n')}\nDone in ${processingTime}ms`;
//         } else if (args[0] === 'start' || (args[0] === 'run' && args[1] === 'start')) {
//           output = `npm start\n\n✅ Dev server started\nLocal: http://localhost:3000\nReady in ${processingTime}ms`;
//         } else {
//           output = `npm ${args.join(' ')}\n✅ Completed in ${processingTime}ms`;
//         }
//         break;
//       case 'ls':
//         output = `package.json\nREADME.md\nsrc/\npublic/\nnode_modules/`;
//         break;
//       case 'pwd':
//         output = `/home/user/projects/${projectId || 'default'}`;
//         break;
//       default:
//         output = `Command not found: ${cmd}`;
//         exitCode = 1;
//     }

//     res.json({ output, exitCode, executionTime: processingTime });
//   } catch (err) {
//     console.error('❌ Terminal error:', err);
//     res.status(500).json({ success: false, message: err?.message || 'Failed to execute command' });
//   }
// });

// // Cleanup old previews (24h)
// setInterval(() => {
//   const now = Date.now();
//   const maxAge = 24 * 60 * 60 * 1000;
//   for (const [id, project] of projectStorage.entries()) {
//     const age = now - new Date(project.lastAccessed).getTime();
//     if (age > maxAge) {
//       projectStorage.delete(id);
//       console.log('🧹 Cleaned preview:', id);
//     }
//   }
// }, 60 * 60 * 1000);

// module.exports = router;


// backend/routes/mejuvante.js


const express = require("express");

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const archiver = require("archiver");
const OpenAI = require("openai");
const mime = require("mime-types");

const {
  S3Client,
  PutObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
  PutPublicAccessBlockCommand,
  PutBucketWebsiteCommand,
} = require("@aws-sdk/client-s3");

const {
  EC2Client,
  RunInstancesCommand,
  CreateSecurityGroupCommand,
  AuthorizeSecurityGroupIngressCommand,
  DescribeSecurityGroupsCommand,
  CreateTagsCommand,
} = require("@aws-sdk/client-ec2");

const { analyzeAndRecommendStack } = require("../../utils/stackSelector");
const {
  generateComprehensivePrompt,
  generateModificationPrompt,
} = require("../../utils/aiPrompts");



const router = express.Router();

// const archiver = require('archiver');
// const dotenv = require('dotenv');
dotenv.config();

// Utilities (keep your implementations)
// const { analyzeAndRecommendStack } = require('../../utils/stackSelector');
// const { generateComprehensivePrompt, generateModificationPrompt } = require('../../utils/aiPrompts');

// ---- OpenAI init / guards
const AI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const MAX_TOKENS = parseInt(process.env.MAX_TOKENS || '16000', 10);
const TEMPERATURE = parseFloat(process.env.TEMPERATURE || '0.7');
const ec2Client = new EC2Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});



// your utils
// const { analyzeAndRecommendStack } = require('../../utils/stackSelector');
// const { generateComprehensivePrompt, generateModificationPrompt } = require('../../utils/aiPrompts');
let openai = null;
if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️ OPENAI_API_KEY is not set. /api/mejuvante/* endpoints will return a helpful 500.');
} else {
  try {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  } catch (e) {
    console.error('❌ Failed to initialize OpenAI client:', e);
  }
}

// In-memory store: previews AND generated projects for modification
const projectStorage = new Map();

// ---------- Health ----------
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    aiModel: AI_MODEL,
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// ---------- Chat router -----------
router.post('/chat', async (req, res) => {
  try {
    const { message, projectId, conversationHistory = [], userPreferences = {} } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    if (!openai) {
      return res.status(500).json({
        success: false,
        message: 'OpenAI is not configured on the server. Set OPENAI_API_KEY in backend .env and restart.',
      });
    }

    const lower = message.toLowerCase();
    const wantsProject = /(?:\b)(create|build|generate|make|develop|app|website|project)(?:\b)/.test(lower);
    const wantsModify = /(?:\b)(change|update|modify|add|remove|fix|improve)(?:\b)/.test(lower) && projectId;

    if (wantsProject) return await handleProjectGeneration(req, res);
    if (wantsModify) return await handleProjectModification(req, res);

    return await handleGeneralChat(req, res);
  } catch (err) {
    console.error('❌ /mejuvante/chat error:', err);
    res.status(500).json({
      success: false,
      message: err?.message || 'Failed to process chat message',
    });
  }
});

// ---------- Project Generation ----------
async function handleProjectGeneration(req, res) {
  const { message, projectId, userPreferences = {} } = req.body;

  try {
    const stackRecommendation = analyzeAndRecommendStack(message, userPreferences);
    const promptData = generateComprehensivePrompt(message, stackRecommendation, { preferences: userPreferences });

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: 'system', content: promptData.systemPrompt },
        { role: 'user', content: promptData.userPrompt },
      ],
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices?.[0]?.message?.content || '{}';

    // Parse JSON safely (permit ```json fenced block)
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = raw.match(/```json\s*([\s\S]*?)\s*```/i);
      if (!match) throw new Error('AI did not return valid JSON');
      parsed = JSON.parse(match[1]);
    }

    const files = Array.isArray(parsed.files) ? parsed.files : [];
    if (files.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'AI returned no files. Try being more specific in your prompt.',
        files: [],
      });
    }

    const id = projectId || `project_${Date.now()}`;

    // Store a normalized project for modification later
    projectStorage.set(id, {
      id,
      name: parsed.projectName || 'Generated Project',
      description: parsed.analysis || '',
      files: files.map((f) => ({
        name: f.name || f.path || 'file',
        path: f.path || f.name || 'file',
        content: f.content || f.code || '',
        language: f.language || 'plaintext',
      })),
      stackRecommendation,
      createdAt: new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
    });

    const payload = {
      success: true,
      reply: parsed.analysis || `Generated ${files.length} files for your project.`,
      message: parsed.analysis || '',
      files,
      stackRecommendation,
      setupInstructions: parsed.setupInstructions || [],
      dependencies: parsed.dependencies || {},
      environmentVariables: parsed.environmentVariables || {},
      features: parsed.features || [],
      apiEndpoints: parsed.apiEndpoints || [],
      nextSteps: parsed.nextSteps || [],
      projectId: id,
      metadata: {
        complexity: stackRecommendation?.estimatedComplexity,
        estimatedTime: stackRecommendation?.estimatedTime,
        projectType: promptData?.projectType,
        aiModel: AI_MODEL,
        generatedAt: new Date().toISOString(),
        tokensUsed: completion?.usage?.total_tokens ?? null,
      },
    };

    return res.json(payload);
  } catch (err) {
    console.error('❌ Project generation error:', err?.response?.data || err);
    const apiMsg =
      err?.response?.data?.error?.message ||
      err?.response?.data?.message ||
      err?.message ||
      'Project generation failed';
    return res.status(500).json({ success: false, message: apiMsg });
  }
}

// ---------- Project Modification ----------
async function handleProjectModification(req, res) {
  const { message, projectId } = req.body;

  try {
    if (!projectId) {
      return res.status(400).json({ success: false, message: 'projectId is required to modify a project' });
    }

    const existingProject = projectStorage.get(projectId);
    if (!existingProject) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const modPrompt = generateModificationPrompt(message, existingProject);

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: 'system', content: 'You are an expert at modifying existing code. Return strict JSON.' },
        { role: 'user', content: modPrompt },
      ],
      max_tokens: Math.min(4000, MAX_TOKENS),
      temperature: TEMPERATURE,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices?.[0]?.message?.content || '{}';
    let resp;
    try {
      resp = JSON.parse(raw);
    } catch {
      const match = raw.match(/```json\s*([\s\S]*?)\s*```/i);
      resp = match ? JSON.parse(match[1]) : { files: [] };
    }

    // Update storage (merge/replace files as appropriate)
    if (Array.isArray(resp.files) && resp.files.length > 0) {
      const normalized = resp.files.map((f) => ({
        name: f.name || f.path || 'file',
        path: f.path || f.name || 'file',
        content: f.content || f.code || '',
        language: f.language || 'plaintext',
      }));

      const mapByPath = new Map(existingProject.files.map((f) => [f.path, f]));
      normalized.forEach((nf) => mapByPath.set(nf.path, nf));
      existingProject.files = Array.from(mapByPath.values());
      existingProject.lastAccessed = new Date().toISOString();
      projectStorage.set(projectId, existingProject);
    }

    return res.json({
      success: true,
      reply: `Modified ${Array.isArray(resp.files) ? resp.files.length : 0} files.`,
      files: resp.files || [],
      projectId,
    });
  } catch (err) {
    console.error('❌ Modification error:', err?.response?.data || err);
    const apiMsg =
      err?.response?.data?.error?.message ||
      err?.response?.data?.message ||
      err?.message ||
      'Modification failed';
    return res.status(500).json({ success: false, message: apiMsg });
  }
}

// ---------- General Chat ----------
async function handleGeneralChat(req, res) {
  const { message, conversationHistory = [] } = req.body;

  try {
    const msgs = [
      {
        role: 'system',
        content:
          "You are CodeAlchemy's Mejuvante AI. Be concise and helpful. If the user wants you to build a project, suggest they say 'create/build/generate/make ...'.",
      },
      ...conversationHistory.slice(-5),
      { role: 'user', content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: msgs,
      max_tokens: 2000,
      temperature: 0.8,
    });

    const reply = completion.choices?.[0]?.message?.content || 'OK';
    return res.json({
      success: true,
      reply,
      message: reply,
      files: [],
      codeBlocks: [],
    });
  } catch (err) {
    console.error('❌ General chat error:', err?.response?.data || err);
    const apiMsg =
      err?.response?.data?.error?.message ||
      err?.response?.data?.message ||
      err?.message ||
      'Chat failed';
    return res.status(500).json({ success: false, message: apiMsg });
  }
}

// ---------- Preview ----------
router.post('/preview', async (req, res) => {
  try {
    const { projectId, files } = req.body;
    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files provided' });
    }

    const id = projectId || `project_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    projectStorage.set(id, {
      id,
      files: files.map((f) => ({
        name: f.name || f.path || 'file',
        path: f.path || f.name || 'file',
        content: f.content || f.code || '',
        language: f.language || 'plaintext',
      })),
      createdAt: new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
    });

    res.json({ success: true, projectId: id, previewUrl: `/api/mejuvante/preview/${id}`, filesCount: files.length });
  } catch (err) {
    console.error('❌ Preview creation error:', err);
    res.status(500).json({ success: false, message: 'Preview creation failed' });
  }
});

router.get('/preview/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = projectStorage.get(projectId);
    if (!project) return res.status(404).send('<h1>Preview Not Found</h1>');

    project.lastAccessed = new Date().toISOString();
    const files = project.files || [];

    // find entry
    let entry = files.find(
      (f) =>
        f.path === 'index.html' ||
        f.path === 'frontend/index.html' ||
        f.name === 'index.html'
    );

    if (!entry) {
      return res.status(400).send('<h1>No entry point (index.html) found</h1>');
    }

    let html = entry.content || '';
    const cssFiles = files.filter((f) => (f.language || '').toLowerCase() === 'css');
    if (cssFiles.length > 0) {
      const cssContent = cssFiles.map((f) => `<style>\n${f.content || ''}\n</style>`).join('\n');
      html = html.replace('</head>', `${cssContent}\n</head>`);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  } catch (err) {
    console.error('❌ Preview error:', err);
    return res.status(500).send('<h1>Preview Error</h1>');
  }
});

// ---------- Export ZIP ----------
router.post('/export-zip', async (req, res) => {
  try {
    const { files, projectName } = req.body;
    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files to export' });
    }

    const zipName = `${(projectName || 'project').toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.zip`;
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    files.forEach((f) => {
      const name = f.path || f.name || 'file';
      archive.append(f.content || '', { name });
    });

    const readme = `# ${projectName || 'Project'}

Generated by CodeAlchemy AI

## Files
${files.map((f) => `- ${f.path || f.name}`).join('\n')}
`;
    archive.append(readme, { name: 'README.md' });

    await archive.finalize();
  } catch (err) {
    console.error('❌ Export ZIP error:', err);
    res.status(500).json({ success: false, message: 'Export failed' });
  }
});

// ---------- Code Validation ----------
router.post('/validate', async (req, res) => {
  try {
    const { files } = req.body;

    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payload: files[] is required',
      });
    }

    if (!openai) {
      return res.status(500).json({
        success: false,
        message: 'OpenAI is not configured on the server. Set OPENAI_API_KEY in backend .env and restart.',
      });
    }

    // Compact payload
    const compactFiles = files.map((f) => ({
      name: f.name || f.path || 'file',
      path: f.path || f.name || 'file',
      language: f.language || 'plaintext',
      content: (f.content || '').slice(0, 100000), // safety cap
    }));

    const systemPrompt = `
You are CodeAlchemy's code reviewer. 
- Check for syntax errors, security risks, accessibility issues, performance smells, and obvious bugs.
- If you can provide a minimal safe fix, include it.
- Respond in strict JSON with the schema below.
`.trim();

    const userPrompt = JSON.stringify({
      instruction:
        'Review these files. Return "issues" and optionally "fixedFiles" if you can safely fix small issues.',
      files: compactFiles,
      schema: {
        summary: 'short summary of the review',
        issues:
          'array of { file, line?, severity: "low"|"medium"|"high", message, fix? }',
        fixedFiles:
          'optional array of files with same shape { name, path, content, language }',
      },
    });

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' },
      max_tokens: 4000,
    });

    const raw = completion.choices?.[0]?.message?.content || '{}';

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const m = raw.match(/```json\s*([\s\S]*?)```/i);
      parsed = m ? JSON.parse(m[1]) : { summary: 'Parse error', issues: [] };
    }

    // Normalize
    const summary = parsed.summary || 'Validation completed.';
    const issues = Array.isArray(parsed.issues) ? parsed.issues : [];
    let fixedFiles = Array.isArray(parsed.fixedFiles) ? parsed.fixedFiles : undefined;

    if (fixedFiles) {
      fixedFiles = fixedFiles.map((f) => ({
        name: f.name || f.path || 'file',
        path: f.path || f.name || 'file',
        content: f.content || '',
        language: f.language || 'plaintext',
      }));
    }

    return res.json({
      success: true,
      summary,
      issues,
      fixedFiles,
      model: AI_MODEL,
      tokensUsed: completion.usage?.total_tokens,
    });
  } catch (err) {
    console.error('❌ /validate error:', err);
    return res.status(500).json({
      success: false,
      message: 'Validation failed',
      error:
        process.env.NODE_ENV === 'development'
          ? { m: err.message, s: err.stack }
          : undefined,
    });
  }
});
// // ---------- Deploy (stub) ----------
// router.post('/deploy', async (req, res) => {
//   try {
//     const { projectId, files = [], config = {} } = req.body;

//     if (!projectId) {
//       return res.status(400).json({ success: false, message: 'projectId is required' });
//     }

//     // If you want to use the in-memory store:
//     const project = projectStorage.get(projectId);
//     const bundle = Array.isArray(files) && files.length > 0 ? files : project?.files || [];

//     if (!bundle || bundle.length === 0) {
//       return res.status(400).json({ success: false, message: 'No files found to deploy' });
//     }

//     // TODO: swap this with real provider (S3/Vercel/EC2/etc)
//     const provider = config?.provider || 's3-static';
//     const url = `https://deploy.example/${provider}/${projectId}`;

//     // Simulate async deploy kickoff
//     console.log('🚀 Deploy started', {
//       projectId,
//       provider,
//       filesCount: bundle.length,
//     });

//     return res.json({ success: true, url, message: 'Deployment started' });
//   } catch (err) {
//     console.error('❌ Deploy error:', err);
//     return res.status(500).json({ success: false, message: 'Deploy failed' });
//   }
// });


// router.post('/deploy', async (req, res) => {
//   try {
//     const { projectId, files = [], config = {} } = req.body;
//     if (!projectId) return res.status(400).json({ success: false, message: 'projectId is required' });

//     const project = projectStorage.get(projectId);
//     const bundle = Array.isArray(files) && files.length > 0 ? files : project?.files || [];
//     if (!bundle || bundle.length === 0) {
//       return res.status(400).json({ success: false, message: 'No files found to deploy' });
//     }

//     const region = config?.region || process.env.AWS_REGION || 'us-east-1';
//     const provider = config?.provider || 's3-static';
//     if (provider !== 's3-static') {
//       return res.status(400).json({ success: false, message: 'Only s3-static provider is supported in this route' });
//     }

//     const s3 = new S3Client({ region });

//     // Choose/create a bucket
//     const suggested = (process.env.S3_BUCKET_PREFIX || 'codealchemy-') + projectId.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40);
//     const bucket = config?.bucket || suggested;

//     // Ensure bucket exists
//     async function ensureBucket() {
//       try {
//         await s3.send(new HeadBucketCommand({ Bucket: bucket }));
//       } catch {
//         await s3.send(new CreateBucketCommand({ Bucket: bucket }));
//       }
//     }

//     // Public access (optional, for quick demo; consider CloudFront for production)
//     async function allowPublicRead() {
//       // Disable public access blocks
//       await s3.send(new PutPublicAccessBlockCommand({
//         Bucket: bucket,
//         PublicAccessBlockConfiguration: {
//           BlockPublicAcls: false,
//           IgnorePublicAcls: false,
//           BlockPublicPolicy: false,
//           RestrictPublicBuckets: false,
//         },
//       }));
//       // Set policy
//       const policy = {
//         Version: '2012-10-17',
//         Statement: [{
//           Sid: 'PublicReadGetObject',
//           Effect: 'Allow',
//           Principal: '*',
//           Action: ['s3:GetObject'],
//           Resource: [`arn:aws:s3:::${bucket}/*`],
//         }],
//       };
//       await s3.send(new PutBucketPolicyCommand({
//         Bucket: bucket,
//         Policy: JSON.stringify(policy),
//       }));
//     }

//     // Enable website hosting (index.html / error.html)
//     async function enableWebsite() {
//       await s3.send(new PutBucketWebsiteCommand({
//         Bucket: bucket,
//         WebsiteConfiguration: {
//           IndexDocument: { Suffix: 'index.html' },
//           ErrorDocument: { Key: '404.html' },
//         },
//       }));
//     }

//     // Upload all files
//     async function uploadFiles() {
//       for (const f of bundle) {
//         const Key = f.path || f.name || 'file';
//         const Body = Buffer.from(f.content || '', 'utf8');
//         const ContentType = mime.getType(Key) || 'text/plain';
//         await s3.send(new PutObjectCommand({
//           Bucket: bucket,
//           Key,
//           Body,
//           ContentType,
//           ACL: 'public-read', // quick demo; with policy this may be optional
//         }));
//       }
//     }

//     await ensureBucket();
//     await allowPublicRead();
//     await enableWebsite();
//     await uploadFiles();

//     // Website URL pattern (classic S3 website endpoint)
//     // NOTE: some newer regions may have slightly different patterns
//     const websiteUrl = `http://${bucket}.s3-website-${region}.amazonaws.com`;

//     console.log('🚀 Deploy finished', { projectId, bucket, region, count: bundle.length, websiteUrl });

//     return res.json({
//       success: true,
//       url: websiteUrl,
//       message: 'Deployment finished',
//       deployment: {
//         provider: 's3',
//         bucket,
//         region,
//         url: websiteUrl,
//         files: bundle.length,
//       },
//     });
//   } catch (err) {
//     console.error('❌ Deploy error:', err);
//     return res.status(500).json({ success: false, message: err?.message || 'Deploy failed' });
//   }
// });
// ---------- Deploy (S3 static website) ----------


// router.post('/deploy', async (req, res) => {
//   try {
//     const { projectId, files = [], config = {} } = req.body;

//     if (!projectId) {
//       return res.status(400).json({ success: false, message: 'projectId is required' });
//     }

//     const bucket = process.env.AWS_S3_BUCKET;
//     const region = process.env.AWS_REGION || 'us-east-1';
//     if (!bucket) {
//       return res.status(500).json({ success: false, message: 'AWS_S3_BUCKET is not set on the server' });
//     }

//     // prefer server-side bundle from in-memory storage (safer)
//     const stored = projectStorage.get(projectId);
//     const bundle = (Array.isArray(files) && files.length > 0) ? files : stored?.files || [];
//     if (!bundle.length) {
//       return res.status(400).json({ success: false, message: 'No files found to deploy' });
//     }

//     // Upload
//     const s3 = new S3Client({ region });
//     const prefix = `deployments/${projectId}/`; // folder per deployment

//     for (const f of bundle) {
//       const key = prefix + (f.path || f.name || 'file');
//       const body = Buffer.from(f.content || '', 'utf8');
//       const contentType = mime.lookup(key) || 'application/octet-stream';

//       await s3.send(new PutObjectCommand({
//         Bucket: bucket,
//         Key: key,
//         Body: body,
//         ContentType: contentType,
//         ACL: 'public-read', // NOTE: only if bucket policy allows it; otherwise remove and use CloudFront or signed URLs
//       }));
//     }

//     // Try to guess entry
//     const entry =
//       bundle.find(x => x.path === 'index.html' || x.name === 'index.html') ||
//       bundle.find(x => (x.path || '').endsWith('/index.html'));
//     const entryKey = entry ? (prefix + (entry.path || entry.name)) : null;

//     // S3 static website URL (works only if S3 Static Website hosting is enabled on the bucket)
//     const websiteBase = `http://${bucket}.s3-website-${region}.amazonaws.com`;
//     const url = entryKey ? `${websiteBase}/${entryKey}` : `${websiteBase}/${prefix}`;

//     return res.json({
//       success: true,
//       message: 'Deployment uploaded to S3',
//       deployment: {
//         bucket,
//         region,
//         url,
//         prefix,
//         filesUploaded: bundle.length,
//       },
//     });
//   } catch (err) {
//     console.error('❌ Deploy error:', err);
//     return res.status(500).json({ success: false, message: err?.message || 'Deploy failed' });
//   }
// });

// router.post('/deploy', async (req, res) => {
//   try {
//     const { projectId, files = [], config = {} } = req.body;
//     if (!projectId) return res.status(400).json({ success:false, message:'projectId is required' });

//     const stored = projectStorage.get(projectId);
//     const bundle = (Array.isArray(files) && files.length>0) ? files : stored?.files || [];
//     if (!bundle.length) return res.status(400).json({ success:false, message:'No files found to deploy' });

//     const provider = config.provider || 's3-static';
//     const region   = config.region   || process.env.AWS_REGION || 'us-east-1';
//     const bucket   = process.env.AWS_S3_BUCKET;
//     if (!bucket) return res.status(500).json({ success:false, message:'AWS_S3_BUCKET is not set on the server' });

//     const s3 = new S3Client({ region });

//     // helper to upload all files to S3 prefix (also used by EC2 flow)
//     async function uploadToS3(prefix) {
//       for (const f of bundle) {
//         const key = `${prefix}${f.path || f.name || 'file'}`;
//         const body = Buffer.from(f.content || '', 'utf8');
//         const contentType = mime.lookup(key) || 'application/octet-stream';
//         await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType, ACL: 'public-read' }));
//       }
//     }

//     // S3 STATIC WEBSITE
//     if (provider === 's3-static') {
//       const prefix = `deployments/${projectId}/`;
//       await uploadToS3(prefix);

//       // try to guess entry
//       const entry =
//         bundle.find(x => x.path === 'index.html' || x.name === 'index.html') ||
//         bundle.find(x => (x.path || '').endsWith('/index.html'));
//       const entryKey = entry ? (prefix + (entry.path || entry.name)) : null;

//       const websiteBase = `http://${bucket}.s3-website-${region}.amazonaws.com`;
//       const url = entryKey ? `${websiteBase}/${entryKey}` : `${websiteBase}/${prefix}`;

//       return res.json({ success:true, message:'Deployment uploaded to S3', deployment:{ provider:'s3', bucket, region, prefix, url, filesUploaded: bundle.length } });
//     }

//     // EC2 SERVER (for Node/Python etc)
//     if (provider === 'ec2') {
//       const prefix = `deployments/${projectId}/site/`;
//       await uploadToS3(prefix);

//       const ec2 = new EC2Client({ region });
//       const groupName = `codealchemy-${projectId.slice(-8)}-sg`;

//       // find or create security group (open 80)
//       let sgId;
//       try {
//         const found = await ec2.send(new DescribeSecurityGroupsCommand({ GroupNames: [groupName] }));
//         sgId = found.SecurityGroups?.[0]?.GroupId;
//       } catch {
//         const cr = await ec2.send(new CreateSecurityGroupCommand({
//           GroupName: groupName,
//           Description: 'CodeAlchemy web SG (HTTP open)',
//           VpcId: undefined, // default VPC
//         }));
//         sgId = cr.GroupId;
//         await ec2.send(new AuthorizeSecurityGroupIngressCommand({
//           GroupId: sgId,
//           IpPermissions: [{
//             IpProtocol: 'tcp',
//             FromPort: 80,
//             ToPort: 80,
//             IpRanges: [{ CidrIp: '0.0.0.0/0', Description: 'HTTP' }],
//           }],
//         }));
//       }

//       const keyName = process.env.AWS_KEY_NAME || undefined;
//       // Amazon Linux 2023 x86_64 (you can swap to another AMI in your region)
//       const ami = process.env.AWS_AMI_ID || 'ami-0e86e20dae9224db8';

//       const websiteURL = `http://${bucket}.s3-website-${region}.amazonaws.com/${prefix}`;
//       const userData = Buffer.from(`#!/bin/bash
// dnf -y update
// dnf -y install nginx unzip curl
// systemctl enable nginx
// systemctl start nginx
// rm -rf /usr/share/nginx/html/*
// mkdir -p /usr/share/nginx/html
// # pull each file from S3 "prefix" (list index)
// cat > /usr/share/nginx/html/index.html <<EOF
// <!doctype html><html><head><meta charset="utf-8"><title>Deploying...</title></head>
// <body style="font-family:system-ui;padding:30px"><h2>Server is pulling site…</h2><p>If you see this for more than ~1 minute, refresh.</p></body></html>
// EOF
// # fetch file list via HTTP website endpoint and rehydrate (quick & dirty for demo)
// curl -s ${websiteURL} >/tmp/listing.html
// # If you prefer robust syncing, pre-zip & use awscli + s3:// (requires IAM role or creds bake)
// # For demo simplicity we'll mirror via website endpoint (static bundles work).
// # (Production: attach an instance profile and 'aws s3 sync s3://${bucket}/${prefix} /usr/share/nginx/html')
// # Minimal mirror:
// # NOTE: website listing varies by bucket settings; for production use awscli.
// sleep 5
// `,'utf8').toString('base64');

//       const run = await ec2.send(new RunInstancesCommand({
//         ImageId: ami,
//         InstanceType: config.instanceType || 't3.micro',
//         MinCount: 1,
//         MaxCount: 1,
//         KeyName: keyName,
//         SecurityGroupIds: sgId ? [sgId] : undefined,
//         UserData: userData,
//       }));

//       const instanceId = run.Instances?.[0]?.InstanceId;
//       if (instanceId) {
//         await ec2.send(new CreateTagsCommand({
//           Resources: [instanceId],
//           Tags: [{ Key: 'Name', Value: `codealchemy-${projectId}` }],
//         }));
//       }

//       return res.json({
//         success: true,
//         message: 'EC2 instance launched',
//         deployment: {
//           provider: 'ec2',
//           region,
//           instanceId,
//           securityGroup: sgId,
//           hint: 'Allow a minute for the instance to boot. Then check the instance public IPv4 (HTTP :80).',
//         },
//       });
//     }

//     return res.status(400).json({ success:false, message:`Unknown provider: ${provider}` });
//   } catch (err) {
//     console.error('❌ Deploy error:', err);
//     return res.status(500).json({ success:false, message: err?.message || 'Deploy failed' });
//   }
// });
// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION || "ap-south-1",
// });

const s3 = new S3Client({ region: process.env.AWS_REGION });

// ✅ Helper: Get correct AMI ID per region
const getAmiId = (region) => {
  const amis = {
    "us-east-1": "ami-04b70fa74e45c3917",
    "us-west-1": "ami-04b70fa74e45c3917",
    "ap-south-1": "ami-0522ab6e1ddcc7055",
  };
  return amis[region] || amis["ap-south-1"];
};

// ✅ Helper: Choose EC2 instance size
const mapRamToInstanceType = (ram) => {
  if (ram <= 1) return "t2.micro";
  if (ram <= 2) return "t2.small";
  if (ram <= 4) return "t2.medium";
  if (ram <= 8) return "t2.large";
  return "t2.xlarge";
};

router.post("/deploy", async (req, res) => {
  try {
    const { projectName, deployType, region, ram, os } = req.body;

    if (!projectName) {
      return res.status(400).json({ error: "Project name required" });
    }

    // ---- 1️⃣ For STATIC (S3) Deployment ----
    if (deployType === "s3") {
      const folderPath = path.join(process.cwd(), "projects", projectName);

      if (!fs.existsSync(folderPath)) {
        return res.status(404).json({ error: "Project folder not found" });
      }

      const files = fs.readdirSync(folderPath);
      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const fileContent = fs.readFileSync(filePath);

        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `${projectName}/${file}`,
            Body: fileContent,
          })
        );
      }

      return res.json({
        message: `✅ ${projectName} deployed to S3 successfully.`,
        bucket: process.env.AWS_S3_BUCKET,
      });
    }

    // ---- 2️⃣ For EC2 Instance Deployment ----
    if (deployType === "ec2") {
      const ec2 = new AWS.EC2({ region });

      const params = {
        ImageId: getAmiId(region),
        InstanceType: mapRamToInstanceType(ram || 1),
        MinCount: 1,
        MaxCount: 1,
        TagSpecifications: [
          {
            ResourceType: "instance",
            Tags: [{ Key: "Name", Value: projectName }],
          },
        ],
      };

      const result = await ec2.runInstances(params).promise();
      const instanceId = result.Instances[0].InstanceId;

      return res.json({
        message: `✅ EC2 instance created successfully`,
        instanceId,
        region,
      });
    }

    return res.status(400).json({ error: "Invalid deployType" });
  } catch (err) {
    console.error("Deployment Error:", err);
    res.status(500).json({ error: "Deployment failed", details: err.message });
  }
});
// ---------- Terminal ----------
router.post('/terminal/execute', async (req, res) => {
  try {
    const { projectId, command } = req.body;
    if (!command) return res.status(400).json({ success: false, message: 'Command is required' });

    const processingTime = Math.floor(Math.random() * 1000) + 300;
    await new Promise((r) => setTimeout(r, processingTime));

    const [cmd, ...args] = command.trim().split(' ');
    let output = '';
    let exitCode = 0;

    switch (cmd) {
      case 'npm':
        if (args[0] === 'install') {
          const pkgs = args.slice(1);
          output =
            pkgs.length === 0
              ? `npm install\n\n✅ Dependencies installed from package.json in ${processingTime}ms`
              : `npm install ${pkgs.join(' ')}\n\n✅ Installed:\n${pkgs.map((p) => `+ ${p}@latest`).join('\n')}\nDone in ${processingTime}ms`;
        } else if (args[0] === 'start' || (args[0] === 'run' && args[1] === 'start')) {
          output = `npm start\n\n✅ Dev server started\nLocal: http://localhost:3000\nReady in ${processingTime}ms`;
        } else {
          output = `npm ${args.join(' ')}\n✅ Completed in ${processingTime}ms`;
        }
        break;
      case 'ls':
        output = `package.json\nREADME.md\nsrc/\npublic/\nnode_modules/`;
        break;
      case 'pwd':
        output = `/home/user/projects/${projectId || 'default'}`;
        break;
      default:
        output = `Command not found: ${cmd}`;
        exitCode = 1;
    }

    res.json({ output, exitCode, executionTime: processingTime });
  } catch (err) {
    console.error('❌ Terminal error:', err);
    res.status(500).json({ success: false, message: err?.message || 'Failed to execute command' });
  }
});

// Cleanup old previews/projects (24h)
setInterval(() => {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000;
  for (const [id, project] of projectStorage.entries()) {
    const last = new Date(project.lastAccessed || project.createdAt || Date.now()).getTime();
    if (now - last > maxAge) {
      projectStorage.delete(id);
      console.log('🧹 Cleaned project/preview:', id);
    }
  }
}, 60 * 60 * 1000);
function detectStackFromFiles(files = []) {
  const paths = files.map(f => (f.path || f.name || '').toLowerCase());
  const hasNode = paths.some(p => p.endsWith('package.json') || p.includes('/server') || p.includes('express'));
  const hasPy   = paths.some(p => p.endsWith('.py') || p.includes('flask') || p.includes('fastapi'));
  const isStatic = !hasNode && !hasPy && paths.some(p => p.endsWith('.html'));

  if (isStatic) return { kind: 'static', preferred: 's3-static' };
  if (hasNode)  return { kind: 'node',   preferred: 'ec2' };
  if (hasPy)    return { kind: 'python', preferred: 'ec2' };
  return { kind: 'unknown', preferred: 's3-static' };
}

function suggestInstance(kind) {
  // simple, cost-aware defaults
  if (kind === 'node' || kind === 'python') {
    return { type: process.env.AWS_DEFAULT_INSTANCE || 't3.micro', vcpu: 2, ram: '1 GiB' };
  }
  // static or unknown → S3
  return null;
}
router.post('/deploy/plan', async (req, res) => {
  try {
    const { projectId } = req.body;
    if (!projectId) return res.status(400).json({ success:false, message:'projectId is required' });

    const proj = projectStorage.get(projectId);
    if (!proj || !Array.isArray(proj.files) || proj.files.length === 0) {
      return res.status(404).json({ success:false, message:'Project not found or empty' });
    }

    const detection = detectStackFromFiles(proj.files);
    const instance  = suggestInstance(detection.kind);

    const plan = (detection.preferred === 's3-static')
      ? {
          provider: 's3-static',
          reason: 'Static site detected (HTML/CSS/JS only). S3 static website hosting is the cheapest and simplest.',
          estMonthly: '~$2-10 (storage + bandwidth)',
        }
      : {
          provider: 'ec2',
          instanceType: instance?.type,
          reason: `Server runtime detected (${detection.kind}). EC2 ${instance?.type} is a good starting size.`,
          estHourly: '~$0.01 - $0.02',
        };

    return res.json({ success:true, plan, detection });
  } catch (e) {
    console.error('plan error', e);
    return res.status(500).json({ success:false, message:e.message });
  }
});

router.get('/preview/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = projectStorage.get(projectId);
    if (!project) return res.status(404).send('<h1>Preview Not Found</h1>');

    project.lastAccessed = new Date().toISOString();
    const files = project.files || [];

    let entry = files.find(f => f.path === 'index.html' || f.name === 'index.html')
             || files.find(f => (f.path || '').endsWith('/index.html'));
    if (!entry) return res.status(400).send('<h1>No entry point (index.html) found</h1>');

    let html = entry.content || '';
    const BRAND = { dark:'#1e3c61', mid:'#2c99b7', light:'#61c4ca' };

    // inject theme if missing
    const hasBrandVars = /--brand-dark|--brand-mid|--brand-light/i.test(html);
    const headHasStyle = /<style[\s>]/i.test(html);
    const themeBlock = `
<style>
:root{
 --brand-dark:${BRAND.dark};
 --brand-mid:${BRAND.mid};
 --brand-light:${BRAND.light};
}
.ca-topbar{
  position:sticky;top:0;left:0;right:0;z-index:9999;
  background:linear-gradient(135deg,var(--brand-dark),var(--brand-mid));
  color:#fff;padding:10px 14px;font-family:system-ui,Segoe UI,Roboto,Arial;
  box-shadow:0 2px 10px rgba(0,0,0,.25)
}
</style>`;

    if (!hasBrandVars) {
      if (html.includes('</head>')) html = html.replace('</head>', `${themeBlock}\n</head>`);
      else if (headHasStyle) html = html.replace(/<\/style>/i, `</style>${themeBlock}`);
      else html = `<head>${themeBlock}</head>\n${html}`;
    }

    // add a simple top bar
    const topbar = `<div class="ca-topbar">CodeAlchemy • Live Preview</div>`;
    if (html.includes('<body')) {
      html = html.replace(/<body[^>]*>/i, (m) => `${m}\n${topbar}`);
    } else {
      html = `${topbar}\n${html}`;
    }

    // inline CSS files if any (optional)
    const cssFiles = files.filter(f => (f.language || '').toLowerCase() === 'css' || (f.path||'').endsWith('.css'));
    if (cssFiles.length) {
      const cssContent = cssFiles.map(f => `<style>\n${f.content||''}\n</style>`).join('\n');
      html = html.includes('</head>') ? html.replace('</head>', `${cssContent}\n</head>`) : `${cssContent}\n${html}`;
    }

    res.setHeader('Content-Type','text/html; charset=utf-8');
    return res.send(html);
  } catch (err) {
    console.error('❌ Preview error:', err);
    return res.status(500).send('<h1>Preview Error</h1>');
  }
});

module.exports = router;
// export default router;
