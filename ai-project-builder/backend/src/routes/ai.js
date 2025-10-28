// // const express = require('express');
// // const router = express.Router();
// // const OpenAI = require('openai');
// // const auth = require('../middleware/auth');

// // const openai = new OpenAI({
// //   apiKey: process.env.OPENAI_API_KEY,
// // });

// // // Generate code with AI
// // router.post('/generate', auth, async (req, res) => {
// //   try {
// //     const { prompt, language, context } = req.body;

// //     const systemPrompt = `You are an expert full-stack developer. Generate complete, multi-file projects based on user requirements.
    
// //     For each request, create:
// //     1. A comprehensive project explanation
// //     2. All necessary files (HTML, CSS, JavaScript, and any other required files)
// //     3. Professional, responsive design
// //     4. Complete functionality
// //     5. Proper error handling and validation
    
// //     Return the response in this exact JSON format:
// //     {
// //       "explanation": {
// //         "overview": "Detailed project overview explaining what the project does",
// //         "features": ["List of main features", "Each feature on a new line"],
// //         "setup": ["Step 1: Setup instruction", "Step 2: Next step"],
// //         "execution": ["Step 1: How to run", "Step 2: What to do next"],
// //         "files": {"filename.ext": "Description of what this file does"}
// //       },
// //       "files": [
// //         {"name": "index.html", "content": "Complete HTML code", "type": "html"},
// //         {"name": "style.css", "content": "Complete CSS code", "type": "css"},
// //         {"name": "script.js", "content": "Complete JavaScript code", "type": "javascript"}
// //       ]
// //     }
    
// //     Make sure the response is valid JSON and includes all required fields.`;

// //     const completion = await openai.chat.completions.create({
// //       model: "gpt-3.5-turbo",
// //       messages: [
// //         { role: "system", content: systemPrompt },
// //         { role: "user", content: prompt }
// //       ],
// //       max_tokens: 4000,
// //       temperature: 0.7,
// //     });

// //     let responseText = completion.choices[0].message.content;
    
// //     // Try to parse the response as JSON
// //     let responseData;
// //     try {
// //       // Clean up the response to ensure it's valid JSON
// //       responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
// //       responseData = JSON.parse(responseText);
// //     } catch (parseError) {
// //       console.error('Failed to parse AI response as JSON:', parseError);
// //       // Fallback: create a basic structure
// //       responseData = {
// //         explanation: {
// //           overview: "A complete web application",
// //           features: ["User interface", "Interactive functionality"],
// //           setup: ["Create project folder", "Add files"],
// //           execution: ["Open index.html in browser"],
// //           files: {}
// //         },
// //         files: [
// //           {
// //             name: "index.html",
// //             content: responseText,
// //             type: "html"
// //           }
// //         ]
// //       };
// //     }

// //     res.json(responseData);
// //   } catch (error) {
// //     console.error('OpenAI API error:', error);
// //     res.status(500).json({ error: 'Failed to generate code' });
// //   }
// // });

// // // Explain code
// // router.post('/explain', auth, async (req, res) => {
// //   try {
// //     const { code } = req.body;

// //     const completion = await openai.chat.completions.create({
// //       model: "gpt-3.5-turbo",
// //       messages: [
// //         { 
// //           role: "system", 
// //           content: "You are a helpful programming assistant. Explain the provided code in a clear and concise way. Break down what each part does and how it works together. Use simple language that a beginner can understand." 
// //         },
// //         { role: "user", content: `Explain this code:\n\n${code}` }
// //       ],
// //       max_tokens: 1000,
// //       temperature: 0.3,
// //     });

// //     res.json({ 
// //       explanation: completion.choices[0].message.content
// //     });
// //   } catch (error) {
// //     console.error('OpenAI API error:', error);
// //     res.status(500).json({ error: 'Failed to explain code' });
// //   }
// // });

// // // Debug code
// // router.post('/debug', auth, async (req, res) => {
// //   try {
// //     const { code, error } = req.body;

// //     const completion = await openai.chat.completions.create({
// //       model: "gpt-3.5-turbo",
// //       messages: [
// //         { 
// //           role: "system", 
// //           content: "You are a debugging expert. Analyze the provided code and error message, identify the issue, and provide a corrected version of the code." 
// //         },
// //         { role: "user", content: `Code:\n${code}\n\nError:\n${error}` }
// //       ],
// //       max_tokens: 1500,
// //       temperature: 0.3,
// //     });

// //     res.json({ 
// //       solution: completion.choices[0].message.content
// //     });
// //   } catch (error) {
// //     console.error('OpenAI API error:', error);
// //     res.status(500).json({ error: 'Failed to debug code' });
// //   }
// // });

// // module.exports = router;



// const express = require('express');
// const router = express.Router();
// const OpenAI = require('openai');
// const auth = require('../middleware/auth');

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Generate code with AI
// router.post('/generate', auth, async (req, res) => {
//   try {
//     const { prompt, language, context } = req.body;

//     const systemPrompt = `You are an expert full-stack developer. Create unique, complete projects based on specific user requirements.
    
//     IMPORTANT: Generate a UNIQUE project tailored to the user's specific requirements. Do not use generic templates.
    
//     For each request, create:
//     1. A comprehensive project explanation with specific details
//     2. All necessary files (HTML, CSS, JavaScript, and any other required files)
//     3. Professional, responsive design
//     4. Complete functionality
//     5. Proper error handling and validation
    
//     Return the response in this exact JSON format:
//     {
//       "explanation": {
//         "overview": "Detailed project overview explaining what the project does",
//         "features": ["List of main features", "Each feature should be specific to the project"],
//         "setup": ["Step 1: Specific setup instruction", "Step 2: Next step"],
//         "execution": ["Step 1: How to run", "Step 2: What to do next"],
//         "files": {"filename.ext": "Description of what this file does"}
//       },
//       "files": [
//         {"name": "index.html", "content": "Complete HTML code", "type": "html"},
//         {"name": "style.css", "content": "Complete CSS code", "type": "css"},
//         {"name": "script.js", "content": "Complete JavaScript code", "type": "javascript"}
//       ]
//     }
    
//     Make sure the response is valid JSON and includes all required fields.`;

//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: prompt }
//       ],
//       max_tokens: 4000,
//       temperature: 0.8, // Higher temperature for more creativity
//     });

//     let responseText = completion.choices[0].message.content;
    
//     // Try to parse the response as JSON
//     let responseData;
//     try {
//       // Clean up the response to ensure it's valid JSON
//       responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
//       responseData = JSON.parse(responseText);
//     } catch (parseError) {
//       console.error('Failed to parse AI response as JSON:', parseError);
//       // Fallback: create a basic structure
//       responseData = {
//         explanation: {
//           overview: "A complete web application",
//           features: ["User interface", "Interactive functionality"],
//           setup: ["Create project folder", "Add files"],
//           execution: ["Open index.html in browser"],
//           files: {}
//         },
//         files: [
//           {
//             name: "index.html",
//             content: responseText,
//             type: "html"
//           }
//         ]
//       };
//     }

//     res.json(responseData);
//   } catch (error) {
//     console.error('OpenAI API error:', error);
//     res.status(500).json({ error: 'Failed to generate code' });
//   }
// });

// // ... rest of the routes remain the same



const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const auth = require('../middleware/auth');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate code with AI
router.post('/generate', auth, async (req, res) => {
  try {
    const { prompt, language, context } = req.body;

    const systemPrompt = `You are an expert full-stack developer. Create unique, complete projects based on specific user requirements.
    
    IMPORTANT: Generate a UNIQUE project tailored to the user's specific requirements. Do not use generic templates.
    
    For each request, create:
    1. A comprehensive project explanation with specific details
    2. All necessary files (HTML, CSS, JavaScript, and any other required files)
    3. Professional, responsive design
    4. Complete functionality
    5. Proper error handling and validation
    
    Return the response in this exact JSON format:
    {
      "explanation": {
        "overview": "Detailed project overview explaining what the project does",
        "features": ["List of main features", "Each feature should be specific to the project"],
        "setup": ["Step 1: Specific setup instruction", "Step 2: Next step"],
        "execution": ["Step 1: How to run", "Step 2: What to do next"],
        "files": {"filename.ext": "Description of what this file does"}
      },
      "files": [
        {"name": "index.html", "content": "Complete HTML code", "type": "html"},
        {"name": "style.css", "content": "Complete CSS code", "type": "css"},
        {"name": "script.js", "content": "Complete JavaScript code", "type": "javascript"}
      ]
    }
    
    Make sure the response is valid JSON and includes all required fields.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 4000,
      temperature: 0.8,
    });

    let responseText = completion.choices[0].message.content;
    
    let responseData;
    try {
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      responseData = {
        explanation: {
          overview: "A complete web application",
          features: ["User interface", "Interactive functionality"],
          setup: ["Create project folder", "Add files"],
          execution: ["Open index.html in browser"],
          files: {}
        },
        files: [
          {
            name: "index.html",
            content: responseText,
            type: "html"
          }
        ]
      };
    }

    res.json(responseData);
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to generate code' });
  }
});
// Generate code with AI
router.post('/generate', auth, async (req, res) => {
  try {
    const { prompt, language, context } = req.body;

    const systemPrompt = `You are an expert full-stack developer. Create unique, complete projects based on specific user requirements.
    
    IMPORTANT: Generate a UNIQUE project tailored to the user's specific requirements. Do not use generic templates.
    
    For each request, create:
    1. A comprehensive project explanation with specific details
    2. All necessary files (HTML, CSS, JavaScript, and any other required files)
    3. Professional, responsive design
    4. Complete functionality
    5. Proper error handling and validation
    
    Return the response in this exact JSON format:
    {
      "explanation": {
        "overview": "Detailed project overview explaining what the project does",
        "features": ["List of main features", "Each feature should be specific to the project"],
        "setup": ["Step 1: Specific setup instruction", "Step 2: Next step"],
        "execution": ["Step 1: How to run", "Step 2: What to do next"],
        "files": {"filename.ext": "Description of what this file does"}
      },
      "files": [
        {"name": "index.html", "content": "Complete HTML code", "type": "html"},
        {"name": "style.css", "content": "Complete CSS code", "type": "css"},
        {"name": "script.js", "content": "Complete JavaScript code", "type": "javascript"}
      ]
    }
    
    Make sure the response is valid JSON and includes all required fields.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 4000,
      temperature: 0.8, // Higher temperature for more creativity
    });

    let responseText = completion.choices[0].message.content;
    
    let responseData;
    try {
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      responseData = {
        explanation: {
          overview: "A complete web application",
          features: ["User interface", "Interactive functionality"],
          setup: ["Create project folder", "Add files"],
          execution: ["Open index.html in browser"],
          files: {}
        },
        files: [
          {
            name: "index.html",
            content: responseText,
            type: "html"
          }
        ]
      };
    }

    res.json(responseData);
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to generate code' });
  }
});
// Explain code
router.post('/explain', auth, async (req, res) => {
  try {
    const { code } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a helpful programming assistant. Explain the provided code in a clear and concise way." 
        },
        { role: "user", content: `Explain this code:\n\n${code}` }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });

    res.json({ 
      explanation: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to explain code' });
  }
});

module.exports = router;