// // backend/routes/chat.js
// const express = require('express');
// const router = express.Router();
// const { OpenAI } = require('openai');
// const Project = require('../models/Project');

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Regular chat endpoint
// router.post('/', async (req, res) => {
//   try {
//     const { message, projectId } = req.body;
    
//     // Get project to include context
//     const project = await Project.findById(projectId);
//     if (!project) {
//       return res.status(404).json({ error: 'Project not found' });
//     }
    
//     // Prepare messages for OpenAI
//     const messages = [
//       { role: 'system', content: 'You are a helpful assistant for creating projects.' },
//       ...(project.chatHistory || []),
//       { role: 'user', content: message }
//     ];
    
//     // Call OpenAI API
//     const response = await openai.chat.completions.create({
//       model: 'gpt-5',
//       messages,
//       max_tokens: 16000,
//     });
    
//     const reply = response.choices[0].message.content;
    
//     // Update project chat history
//     project.chatHistory = [
//       ...(project.chatHistory || []),
//       { role: 'user', content: message },
//       { role: 'assistant', content: reply }
//     ];
//     await project.save();
    
//     res.json({ reply });
//   } catch (error) {
//     console.error('Chat error:', error);
//     res.status(500).json({ error: 'Failed to process chat message' });
//   }
// });

// // Chat with code generation endpoint
// router.post('/code-generation', async (req, res) => {
//   try {
//     const { message, projectId, history } = req.body;
    
//     // Get project to include context
//     const project = await Project.findById(projectId);
//     if (!project) {
//       return res.status(404).json({ error: 'Project not found' });
//     }
    
//     // Prepare messages for OpenAI with code generation instructions
//     const messages = [
//       { 
//         role: 'system', 
//         content: 'You are a helpful assistant for creating projects. When the user asks for code, provide the code in a code block with the appropriate language identifier. If the user asks for HTML, CSS, or JavaScript, provide complete, working code that they can use immediately.' 
//       },
//       ...(history || []),
//       { role: 'user', content: message }
//     ];
    
//     // Call OpenAI API
//     const response = await openai.chat.completions.create({
//       model: 'gpt-4',
//       messages,
//       max_tokens: 2000,
//     });
    
//     const reply = response.choices[0].message.content;
    
//     // Extract code from the response if present
//     const codeMatch = reply.match(/```(\w+)?\n([\s\S]*?)```/);
//     let code = null;
    
//     if (codeMatch) {
//       code = {
//         language: codeMatch[1] || 'text',
//         content: codeMatch[2]
//       };
//     }
    
//     // Update project chat history
//     project.chatHistory = [
//       ...(project.chatHistory || []),
//       { role: 'user', content: message },
//       { role: 'assistant', content: reply }
//     ];
//     await project.save();
    
//     res.json({ reply, code });
//   } catch (error) {
//     console.error('Chat error:', error);
//     res.status(500).json({ error: 'Failed to process chat message' });
//   }
// });

// module.exports = router;


// // backend/routes/chat.js

// const express = require('express');
// const router = express.Router();
// const { OpenAI } = require('openai');
// const { Project } = require('../models'); // Assuming this is your Sequelize model
// const jwt = require('jsonwebtoken');

// // --- Middleware ---
// // Re-use the same authMiddleware from projects.js for consistency
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

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Helper to parse chat history from the database
// const getChatHistory = (project) => {
//   return project.chatHistory ? (typeof project.chatHistory === 'string' ? JSON.parse(project.chatHistory) : project.chatHistory) : [];
// };
// router.post("/save", async (req, res) => {
//   try {
//     const { projectId, userMessage, assistantMessage } = req.body;
//     const chat = await Chat.create({ projectId, userMessage, assistantMessage });
//     res.json({ success: true, chat });
//   } catch (err) {
//     console.error("Error saving chat:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// router.get("/history", async (req, res) => {
//   try {
//     const chats = await Chat.findAll({ order: [["createdAt", "ASC"]] });
//     res.json(chats);
//   } catch (err) {
//     console.error("Error fetching chat history:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// export default router;
// // Regular chat endpoint
// router.post('/', authMiddleware, async (req, res) => {
//   try {
//     const { message, projectId } = req.body;
    
//     // Use Sequelize's findByPk to find the project
//     const project = await Project.findByPk(projectId);
    
//     // Authorization check: Ensure the user owns the project
//     if (!project || project.user_id !== req.user.userId) {
//       return res.status(404).json({ error: 'Project not found or not authorized' });
//     }
    
//     const currentHistory = getChatHistory(project);
    
//     // Prepare messages for OpenAI
//     const messages = [
//       { role: 'system', content: 'You are a helpful assistant for creating projects.' },
//       ...currentHistory,
//       { role: 'user', content: message }
//     ];
    
//     // Call OpenAI API with a valid model
//     const response = await openai.chat.completions.create({
//       model: 'gpt-4-turbo', // Corrected model name
//       messages,
//       max_tokens: 4000, // Adjusted token limit
//     });
    
//     const reply = response.choices[0].message.content;
    
//     // Update project chat history
//     const newHistory = [
//       ...currentHistory,
//       { role: 'user', content: message, timestamp: new Date().toISOString() },
//       { role: 'assistant', content: reply, timestamp: new Date().toISOString() }
//     ];

//     // Use Sequelize's update method
//     await project.update({ chatHistory: JSON.stringify(newHistory) });
    
//     res.json({ reply });
//   } catch (error) {
//     console.error('Chat error:', error);
//     res.status(500).json({ error: 'Failed to process chat message', details: error.message });
//   }
// });

// // Chat with code generation endpoint
// router.post('/code-generation', authMiddleware, async (req, res) => {
//   try {
//     const { message, projectId, history } = req.body;
    
//     // Use Sequelize's findByPk
//     const project = await Project.findByPk(projectId);

//     // Authorization check
//     if (!project || project.user_id !== req.user.userId) {
//       return res.status(404).json({ error: 'Project not found or not authorized' });
//     }
    
//     const currentHistory = history || getChatHistory(project);
    
//     // Prepare messages for OpenAI with code generation instructions
//     const messages = [
//       { 
//         role: 'system', 
//         content: 'You are a helpful assistant for creating projects. When the user asks for code, provide the code in a code block with the appropriate language identifier. If the user asks for HTML, CSS, or JavaScript, provide complete, working code that they can use immediately.' 
//       },
//       ...currentHistory,
//       { role: 'user', content: message }
//     ];
    
//     // Call OpenAI API with a valid model
//     const response = await openai.chat.completions.create({
//       model: 'gpt-4-turbo', // Corrected model name
//       messages,
//       max_tokens: 4000, // Adjusted token limit
//     });
    
//     const reply = response.choices[0].message.content;
    
//     // Extract code from the response if present
//     const codeMatch = reply.match(/```(\w+)?\n([\s\S]*?)```/);
//     let code = null;
    
//     if (codeMatch) {
//       code = {
//         language: codeMatch[1] || 'text',
//         content: codeMatch[2]
//       };
//     }
    
//     // Update project chat history
//     const newHistory = [
//       ...currentHistory,
//       { role: 'user', content: message, timestamp: new Date().toISOString() },
//       { role: 'assistant', content: reply, timestamp: new Date().toISOString() }
//     ];
    
//     // Use Sequelize's update method
//     await project.update({ chatHistory: JSON.stringify(newHistory) });
    
//     res.json({ reply, code });
//   } catch (error) {
//     console.error('Chat error:', error);
//     res.status(500).json({ error: 'Failed to process chat message', details: error.message });
//   }
// });

// module.exports = router;

// backend/routes/chat.js
const express = require("express");
const jwt = require("jsonwebtoken");
const { OpenAI } = require("openai");
const { Project, Chat } = require("../models"); // Ensure Chat model exists in your Sequelize setup

const router = express.Router();

// --- Auth Middleware ---
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret_key");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Helpers ---
const getChatHistory = (project) => {
  return project.chatHistory
    ? typeof project.chatHistory === "string"
      ? JSON.parse(project.chatHistory)
      : project.chatHistory
    : [];
};

// 🧠 Save individual chat
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const { projectId, userMessage, assistantMessage } = req.body;

    if (!projectId || !userMessage || !assistantMessage)
      return res.status(400).json({ success: false, message: "Missing fields" });

    const chat = await Chat.create({
      projectId,
      user_id: req.user.userId,
      userMessage,
      assistantMessage,
    });

    res.json({ success: true, chat });
  } catch (err) {
    console.error("Error saving chat:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 💬 Fetch chat history for a specific user
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const chats = await Chat.findAll({
      where: { user_id: req.user.userId },
      order: [["createdAt", "ASC"]],
    });
    res.json(chats);
  } catch (err) {
    console.error("Error fetching chat history:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🤖 General chat endpoint
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { message, projectId } = req.body;

    const project = await Project.findByPk(projectId);
    if (!project || project.user_id !== req.user.userId) {
      return res.status(404).json({ error: "Project not found or not authorized" });
    }

    const currentHistory = getChatHistory(project);
    const messages = [
      { role: "system", content: "You are a helpful assistant for creating projects." },
      ...currentHistory,
      { role: "user", content: message },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages,
      max_tokens: 4000,
    });

    const reply = response.choices[0].message.content;

    const newHistory = [
      ...currentHistory,
      { role: "user", content: message, timestamp: new Date().toISOString() },
      { role: "assistant", content: reply, timestamp: new Date().toISOString() },
    ];

    await project.update({ chatHistory: JSON.stringify(newHistory) });

    // Save chat to Chat model as well
    await Chat.create({
      projectId,
      user_id: req.user.userId,
      userMessage: message,
      assistantMessage: reply,
    });

    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process chat message", details: error.message });
  }
});

// 💻 Chat with code generation
router.post("/code-generation", authMiddleware, async (req, res) => {
  try {
    const { message, projectId, history } = req.body;

    const project = await Project.findByPk(projectId);
    if (!project || project.user_id !== req.user.userId) {
      return res.status(404).json({ error: "Project not found or not authorized" });
    }

    const currentHistory = history || getChatHistory(project);
    const messages = [
      {
        role: "system",
        content:
          "You are a coding assistant. Generate clean, working, language-tagged code snippets.",
      },
      ...currentHistory,
      { role: "user", content: message },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages,
      max_tokens: 4000,
    });

    const reply = response.choices[0].message.content;
    const codeMatch = reply.match(/```(\w+)?\n([\s\S]*?)```/);
    const code = codeMatch
      ? { language: codeMatch[1] || "text", content: codeMatch[2] }
      : null;

    const newHistory = [
      ...currentHistory,
      { role: "user", content: message, timestamp: new Date().toISOString() },
      { role: "assistant", content: reply, timestamp: new Date().toISOString() },
    ];

    await project.update({ chatHistory: JSON.stringify(newHistory) });
    await Chat.create({
      projectId,
      user_id: req.user.userId,
      userMessage: message,
      assistantMessage: reply,
    });

    res.json({ reply, code });
  } catch (error) {
    console.error("Code generation error:", error);
    res.status(500).json({ error: "Failed to process code generation", details: error.message });
  }
});

module.exports = router;
