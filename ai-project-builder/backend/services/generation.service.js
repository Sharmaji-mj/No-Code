// backend/src/services/generation.service.js
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const MODEL = process.env.OPENAI_MODEL || "gpt-4o";

const generationSchema = {
  name: "ProjectBundle",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      reply: { type: "string" },
      projectName: { type: "string" },
      files: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: { type: "string" },     // e.g. "index.html", "style.css", "script.js", "server.js"
            type: { type: "string" },     // "html" | "css" | "javascript" | "json" | "text" | ...
            content: { type: "string" }
          },
          required: ["name", "content"]
        }
      },
      setupInstructions: { type: "array", items: { type: "string" } },
      dependencies: { type: "object", additionalProperties: { type: "string" } }
    },
    required: ["reply", "files"]
  },
  strict: true
};

async function generateProject({ prompt, context, projectId }) {
  const sys = [
    "You are an expert full-stack code generator.",
    "Always return valid JSON exactly matching the provided schema.",
    "Create complete, runnable files. Prefer a single-page index.html entry for frontends."
  ].join(" ");

  const user = [
    `User request: ${prompt}`,
    context ? `\nContext (existing code or constraints):\n${context}` : "",
    "\nRequirements:",
    "- Provide a short reply/summary of what you generated.",
    "- Return a full set of files (HTML/CSS/JS and others as needed).",
    "- Make the UI responsive and well-structured.",
    "- Comment the code where helpful.",
    "- If the project is frontend-only, ensure index.html runs self-contained.",
  ].join("\n");

  const response = await client.responses.create({
    model: MODEL,
    temperature: 0.6,
    response_format: {
      type: "json_schema",
      json_schema: generationSchema
    },
    input: [
      { role: "system", content: sys },
      { role: "user", content: user }
    ]
  });

  // Extract the JSON
  const text = response.output_text; // SDK v4 helper that concatenates text parts
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    throw new Error("Model returned invalid JSON");
  }

  // Normalize file types
  (parsed.files || []).forEach(f => {
    if (!f.type) {
      const n = f.name.toLowerCase();
      if (n.endsWith(".html")) f.type = "html";
      else if (n.endsWith(".css")) f.type = "css";
      else if (n.endsWith(".js")) f.type = "javascript";
      else if (n.endsWith(".json")) f.type = "json";
      else f.type = "text";
    }
  });

  return {
    reply: parsed.reply,
    files: parsed.files || [],
    projectName: parsed.projectName || "Generated Project",
    setupInstructions: parsed.setupInstructions || [],
    dependencies: parsed.dependencies || {},
    projectId
  };
}

module.exports = { generateProject };
