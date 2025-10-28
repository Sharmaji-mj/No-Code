// // backend/src/utils/stackSelector.js
// // Intelligent stack selection based on project requirements

// /**
//  * Analyzes project requirements and recommends optimal tech stack
//  * @param {string} description - User's project description
//  * @param {object} preferences - User preferences (optional)
//  * @returns {object} Recommended stack with reasoning
//  */
// function analyzeAndRecommendStack(description, preferences = {}) {
//   const desc = description.toLowerCase();
  
//   // Analyze project characteristics
//   const characteristics = {
//     isEcommerce: /shop|store|cart|payment|checkout|product/.test(desc),
//     needsAuth: /auth|login|signup|user|account|profile/.test(desc),
//     needsRealtime: /chat|message|notification|live|realtime|socket/.test(desc),
//     needsSEO: /blog|article|content|seo|landing|marketing/.test(desc),
//     isComplex: /dashboard|admin|panel|analytics|complex/.test(desc),
//     needsDB: /database|data|store|save|crud/.test(desc),
//     isMobile: /mobile|app|ios|android|react native/.test(desc),
//     isSimple: /simple|basic|small|quick|todo/.test(desc),
//     needs3D: /3d|three|game|animation|graphics/.test(desc),
//     needsAI: /ai|ml|gpt|openai|machine learning/.test(desc),
//   };

//   // Score different stacks
//   const stacks = [
//     scoreReactStack(characteristics),
//     scoreNextJsStack(characteristics),
//     scoreVueStack(characteristics),
//     scoreSvelteStack(characteristics),
//     scoreAngularStack(characteristics),
//     scoreReactNativeStack(characteristics),
//   ];

//   // Sort by score and get best match
//   stacks.sort((a, b) => b.score - a.score);
//   const recommended = stacks[0];

//   // Select backend based on requirements
//   const backend = selectBackend(characteristics, preferences);
//   const database = selectDatabase(characteristics, preferences);
//   const styling = selectStyling(characteristics, preferences);
//   const additional = selectAdditionalTools(characteristics);

//   return {
//     frontend: recommended.stack,
//     backend: backend,
//     database: database,
//     styling: styling,
//     additionalTools: additional,
//     reasoning: recommended.reasoning,
//     score: recommended.score,
//     alternatives: stacks.slice(1, 3),
//     estimatedComplexity: estimateComplexity(characteristics),
//     estimatedTime: estimateTime(characteristics)
//   };
// }

// // Score React stack
// function scoreReactStack(chars) {
//   let score = 50; // Base score
//   let reasons = [];

//   if (chars.isSimple) {
//     score += 20;
//     reasons.push("React is perfect for simple apps");
//   }
//   if (chars.needsAuth) {
//     score += 10;
//     reasons.push("Great auth libraries available");
//   }
//   if (chars.needsRealtime) {
//     score += 15;
//     reasons.push("Excellent real-time support");
//   }
//   if (chars.isComplex) {
//     score += 15;
//     reasons.push("Scales well for complex UIs");
//   }
//   if (chars.needsSEO) {
//     score -= 10;
//     reasons.push("Not ideal for SEO (consider Next.js)");
//   }

//   return {
//     stack: {
//       name: "React",
//       version: "18",
//       buildTool: "Vite",
//       typescript: true
//     },
//     score,
//     reasoning: reasons.join(". ") + ". Most popular, huge ecosystem, flexible."
//   };
// }

// // Score Next.js stack
// function scoreNextJsStack(chars) {
//   let score = 40;
//   let reasons = [];

//   if (chars.needsSEO) {
//     score += 30;
//     reasons.push("Built-in SSR/SSG for excellent SEO");
//   }
//   if (chars.isEcommerce) {
//     score += 25;
//     reasons.push("Perfect for e-commerce with SEO needs");
//   }
//   if (chars.isComplex) {
//     score += 20;
//     reasons.push("Full-stack framework for complex apps");
//   }
//   if (chars.needsAuth) {
//     score += 15;
//     reasons.push("NextAuth.js integration");
//   }
//   if (chars.isSimple) {
//     score -= 10;
//     reasons.push("May be overkill for simple apps");
//   }

//   return {
//     stack: {
//       name: "Next.js",
//       version: "14",
//       features: ["App Router", "Server Components", "SSR"],
//       typescript: true
//     },
//     score,
//     reasoning: reasons.join(". ") + ". Best for SEO-critical apps."
//   };
// }

// // Score Vue stack
// function scoreVueStack(chars) {
//   let score = 45;
//   let reasons = [];

//   if (chars.isSimple) {
//     score += 15;
//     reasons.push("Gentle learning curve");
//   }
//   if (chars.isComplex) {
//     score += 10;
//     reasons.push("Good for complex apps");
//   }
//   if (chars.needsSEO) {
//     score += 5;
//     reasons.push("Nuxt.js available for SSR");
//   }

//   return {
//     stack: {
//       name: "Vue",
//       version: "3",
//       composition: true,
//       typescript: true
//     },
//     score,
//     reasoning: reasons.join(". ") + ". Progressive framework, easy to learn."
//   };
// }

// // Score Svelte stack
// function scoreSvelteStack(chars) {
//   let score = 35;
//   let reasons = [];

//   if (chars.isSimple) {
//     score += 20;
//     reasons.push("Minimal boilerplate");
//   }
//   if (chars.needsSpeed) {
//     score += 15;
//     reasons.push("Extremely fast");
//   }

//   return {
//     stack: {
//       name: "Svelte",
//       version: "4",
//       kit: true
//     },
//     score,
//     reasoning: reasons.join(". ") + ". No virtual DOM, blazing fast."
//   };
// }

// // Score Angular stack
// function scoreAngularStack(chars) {
//   let score = 30;
//   let reasons = [];

//   if (chars.isComplex) {
//     score += 25;
//     reasons.push("Enterprise-grade framework");
//   }
//   if (chars.isEcommerce) {
//     score += 10;
//     reasons.push("Good for large applications");
//   }

//   return {
//     stack: {
//       name: "Angular",
//       version: "17",
//       typescript: true
//     },
//     score,
//     reasoning: reasons.join(". ") + ". Full-featured, opinionated."
//   };
// }

// // Score React Native stack
// function scoreReactNativeStack(chars) {
//   let score = 0;
//   let reasons = [];

//   if (chars.isMobile) {
//     score = 90;
//     reasons.push("Native mobile development");
//   }

//   return {
//     stack: {
//       name: "React Native",
//       version: "0.73",
//       expo: true
//     },
//     score,
//     reasoning: reasons.join(". ") + ". Cross-platform mobile apps."
//   };
// }

// // Select backend
// function selectBackend(chars, prefs) {
//   if (prefs.backend) return prefs.backend;

//   if (chars.isSimple) {
//     return {
//       name: "Node.js + Express",
//       database: "MongoDB",
//       reasoning: "Lightweight, JavaScript everywhere"
//     };
//   }

//   if (chars.isComplex || chars.isEcommerce) {
//     return {
//       name: "Node.js + NestJS",
//       database: "PostgreSQL",
//       reasoning: "TypeScript, modular architecture, scalable"
//     };
//   }

//   if (chars.needsRealtime) {
//     return {
//       name: "Node.js + Socket.io",
//       database: "Redis + MongoDB",
//       reasoning: "Real-time communication"
//     };
//   }

//   return {
//     name: "Node.js + Express",
//     database: "MongoDB",
//     reasoning: "Standard, reliable stack"
//   };
// }

// // Select database
// function selectDatabase(chars, prefs) {
//   if (prefs.database) return prefs.database;

//   if (chars.isEcommerce || chars.isComplex) {
//     return {
//       name: "PostgreSQL",
//       orm: "Prisma",
//       reasoning: "ACID compliance, relations, transactions"
//     };
//   }

//   if (chars.needsRealtime) {
//     return {
//       name: "MongoDB + Redis",
//       reasoning: "Fast reads, caching, real-time"
//     };
//   }

//   if (chars.isSimple) {
//     return {
//       name: "MongoDB",
//       orm: "Mongoose",
//       reasoning: "Flexible schema, easy to use"
//     };
//   }

//   return {
//     name: "MongoDB",
//     orm: "Mongoose",
//     reasoning: "Popular, flexible"
//   };
// }

// // Select styling
// function selectStyling(chars, prefs) {
//   if (prefs.styling) return prefs.styling;

//   if (chars.isComplex) {
//     return {
//       name: "Tailwind CSS + shadcn/ui",
//       reasoning: "Component library, customizable"
//     };
//   }

//   return {
//     name: "Tailwind CSS",
//     reasoning: "Utility-first, fast development"
//   };
// }

// // Select additional tools
// function selectAdditionalTools(chars) {
//   const tools = [];

//   if (chars.needsAuth) {
//     tools.push({
//       name: "NextAuth.js",
//       purpose: "Authentication",
//       reason: "Easy OAuth, JWT, sessions"
//     });
//   }

//   if (chars.isEcommerce) {
//     tools.push({
//       name: "Stripe",
//       purpose: "Payments",
//       reason: "Most popular payment processor"
//     });
//   }

//   if (chars.needsRealtime) {
//     tools.push({
//       name: "Socket.io",
//       purpose: "WebSockets",
//       reason: "Real-time bidirectional communication"
//     });
//   }

//   if (chars.needs3D) {
//     tools.push({
//       name: "Three.js / React Three Fiber",
//       purpose: "3D Graphics",
//       reason: "WebGL rendering"
//     });
//   }

//   if (chars.needsAI) {
//     tools.push({
//       name: "OpenAI SDK",
//       purpose: "AI Integration",
//       reason: "GPT integration"
//     });
//   }

//   return tools;
// }

// // Estimate complexity
// function estimateComplexity(chars) {
//   let complexity = 0;
  
//   if (chars.isEcommerce) complexity += 3;
//   if (chars.needsAuth) complexity += 2;
//   if (chars.needsRealtime) complexity += 2;
//   if (chars.isComplex) complexity += 3;
//   if (chars.needs3D) complexity += 4;
//   if (chars.needsAI) complexity += 2;

//   if (complexity === 0) return "Low";
//   if (complexity <= 5) return "Medium";
//   if (complexity <= 10) return "High";
//   return "Very High";
// }

// // Estimate time
// function estimateTime(chars) {
//   const complexity = estimateComplexity(chars);
  
//   const times = {
//     "Low": "1-2 hours",
//     "Medium": "3-6 hours",
//     "High": "1-2 days",
//     "Very High": "3-5 days"
//   };

//   return times[complexity];
// }

// module.exports = {
//   analyzeAndRecommendStack,
//   estimateComplexity,
//   estimateTime
// };


// backend/utils/stackSelector.js

/**
 * Analyzes project requirements and recommends optimal tech stack
 */
function analyzeAndRecommendStack(prompt, userPreferences = {}) {
  const lowerPrompt = prompt.toLowerCase();
  
  // Analyze complexity
  const complexityIndicators = {
    high: ['authentication', 'payment', 'real-time', 'database', 'api', 'backend', 'full-stack', 'e-commerce', 'dashboard'],
    medium: ['form', 'interactive', 'dynamic', 'state', 'routing', 'multi-page'],
    low: ['landing', 'static', 'simple', 'portfolio', 'single page']
  };
  
  let complexity = 'low';
  if (complexityIndicators.high.some(ind => lowerPrompt.includes(ind))) {
    complexity = 'high';
  } else if (complexityIndicators.medium.some(ind => lowerPrompt.includes(ind))) {
    complexity = 'medium';
  }
  
  // Frontend recommendation
  let frontend = { name: 'HTML/CSS/JS', reason: 'Simple and effective' };
  if (lowerPrompt.includes('react')) {
    frontend = { name: 'React', reason: 'Explicitly requested' };
  } else if (lowerPrompt.includes('vue')) {
    frontend = { name: 'Vue.js', reason: 'Explicitly requested' };
  } else if (complexity === 'high') {
    frontend = { name: 'React', reason: 'Best for complex applications' };
  } else if (complexity === 'medium') {
    frontend = { name: 'React', reason: 'Good for interactive UIs' };
  }
  
  // Backend recommendation
  let backend = { name: 'None', reason: 'Static frontend only' };
  if (lowerPrompt.includes('node') || lowerPrompt.includes('express')) {
    backend = { name: 'Node.js + Express', reason: 'Explicitly requested' };
  } else if (complexity === 'high') {
    backend = { name: 'Node.js + Express', reason: 'Scalable and JavaScript-based' };
  }
  
  // Database recommendation
  let database = { name: 'None', reason: 'No persistent storage needed' };
  if (lowerPrompt.includes('mongo') || lowerPrompt.includes('mongodb')) {
    database = { name: 'MongoDB', reason: 'Explicitly requested' };
  } else if (lowerPrompt.includes('sql') || lowerPrompt.includes('mysql') || lowerPrompt.includes('postgres')) {
    database = { name: 'PostgreSQL', reason: 'Relational data requested' };
  } else if (complexity === 'high' && backend.name !== 'None') {
    database = { name: 'MongoDB', reason: 'Flexible and easy to use' };
  }
  
  // Estimate time and complexity
  const estimatedTime = complexity === 'high' ? '2-4 hours' : complexity === 'medium' ? '30min - 1 hour' : '10-30 minutes';
  
  return {
    frontend,
    backend,
    database,
    estimatedComplexity: complexity,
    estimatedTime,
    reasoning: `Based on your requirements, I recommend ${frontend.name} for the frontend${backend.name !== 'None' ? ` with ${backend.name} backend` : ''}${database.name !== 'None' ? ` and ${database.name} database` : ''}.`
  };
}

module.exports = { analyzeAndRecommendStack };