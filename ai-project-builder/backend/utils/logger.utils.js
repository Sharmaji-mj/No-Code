// ===== backend/src/utils/logger.util.js =====

const fs = require('fs-extra');
const path = require('path');

class Logger {
  constructor() {
    this.logsPath = process.env.LOGS_PATH || './logs';
    this.initLogs();
  }

  async initLogs() {
    await fs.ensureDir(this.logsPath);
  }

  formatMessage(level, message, meta = {}) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta
    });
  }

  async writeLog(filename, content) {
    const logFile = path.join(this.logsPath, filename);
    await fs.appendFile(logFile, content + '\n');
  }

  info(message, meta = {}) {
    const log = this.formatMessage('INFO', message, meta);
    console.log(`ℹ️  ${message}`, meta);
    this.writeLog('info.log', log).catch(console.error);
  }

  error(message, error, meta = {}) {
    const log = this.formatMessage('ERROR', message, {
      ...meta,
      error: error?.message,
      stack: error?.stack
    });
    console.error(`❌ ${message}`, error);
    this.writeLog('error.log', log).catch(console.error);
  }

  warn(message, meta = {}) {
    const log = this.formatMessage('WARN', message, meta);
    console.warn(`⚠️  ${message}`, meta);
    this.writeLog('warn.log', log).catch(console.error);
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      const log = this.formatMessage('DEBUG', message, meta);
      console.debug(`🐛 ${message}`, meta);
      this.writeLog('debug.log', log).catch(console.error);
    }
  }

  success(message, meta = {}) {
    const log = this.formatMessage('SUCCESS', message, meta);
    console.log(`✅ ${message}`, meta);
    this.writeLog('info.log', log).catch(console.error);
  }

  generation(projectId, message, meta = {}) {
    const log = this.formatMessage('GENERATION', message, { projectId, ...meta });
    console.log(`🤖 [${projectId}] ${message}`);
    this.writeLog('generation.log', log).catch(console.error);
  }
}

module.exports = new Logger();


// ===== backend/src/utils/validator.util.js =====

class RequestValidator {
  /**
   * Validate code generation request
   */
  validateGenerateRequest(data) {
    const errors = [];

    if (!data.prompt || typeof data.prompt !== 'string') {
      errors.push('prompt is required and must be a string');
    } else if (data.prompt.length < 10) {
      errors.push('prompt must be at least 10 characters');
    } else if (data.prompt.length > 2000) {
      errors.push('prompt must be less than 2000 characters');
    }

    if (!data.projectName || typeof data.projectName !== 'string') {
      errors.push('projectName is required and must be a string');
    } else if (!/^[a-z0-9-]+$/i.test(data.projectName)) {
      errors.push('projectName must contain only alphanumeric characters and hyphens');
    } else if (data.projectName.length > 50) {
      errors.push('projectName must be less than 50 characters');
    }

    if (data.stack && typeof data.stack !== 'object') {
      errors.push('stack must be an object');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate deployment request
   */
  validateDeploymentRequest(data) {
    const errors = [];

    if (!data.projectId) {
      errors.push('projectId is required');
    }

    if (!data.deploymentType) {
      errors.push('deploymentType is required');
    }

    const validTypes = ['ec2', 'lambda', 'elasticbeanstalk', 'amplify', 'fargate'];
    if (data.deploymentType && !validTypes.includes(data.deploymentType)) {
      errors.push(`deploymentType must be one of: ${validTypes.join(', ')}`);
    }

    if (data.awsCredentials) {
      if (!data.awsCredentials.accessKeyId) {
        errors.push('awsCredentials.accessKeyId is required when providing credentials');
      }
      if (!data.awsCredentials.secretAccessKey) {
        errors.push('awsCredentials.secretAccessKey is required when providing credentials');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitize user input
   */
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove inline event handlers
      .trim();
  }

  /**
   * Validate project ID format
   */
  isValidProjectId(projectId) {
    return /^[a-z0-9-]+$/i.test(projectId);
  }
}

module.exports = new RequestValidator();


// ===== backend/src/utils/performance.util.js =====

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }

  /**
   * Start timing an operation
   */
  start(operationName) {
    this.metrics.set(operationName, {
      startTime: Date.now(),
      startMemory: process.memoryUsage().heapUsed
    });
  }

  /**
   * End timing and return metrics
   */
  end(operationName) {
    const metric = this.metrics.get(operationName);
    if (!metric) {
      return null;
    }

    const endTime = Date.now();
    const endMemory = process.memoryUsage().heapUsed;

    const result = {
      operation: operationName,
      duration: endTime - metric.startTime,
      durationMs: `${endTime - metric.startTime}ms`,
      memoryDelta: endMemory - metric.startMemory,
      memoryDeltaMB: `${((endMemory - metric.startMemory) / 1024 / 1024).toFixed(2)}MB`
    };

    this.metrics.delete(operationName);
    return result;
  }

  /**
   * Measure async function
   */
  async measure(name, fn) {
    this.start(name);
    try {
      const result = await fn();
      const metrics = this.end(name);
      console.log(`⏱️  ${name}: ${metrics.durationMs} (Memory: ${metrics.memoryDeltaMB})`);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  /**
   * Get current memory usage
   */
  getMemoryUsage() {
    const usage = process.memoryUsage();
    return {
      heapUsed: `${(usage.heapUsed / 1024 / 1024).toFixed(2)}MB`,
      heapTotal: `${(usage.heapTotal / 1024 / 1024).toFixed(2)}MB`,
      rss: `${(usage.rss / 1024 / 1024).toFixed(2)}MB`,
      external: `${(usage.external / 1024 / 1024).toFixed(2)}MB`
    };
  }

  /**
   * Log system health
   */
  logHealth() {
    const memUsage = this.getMemoryUsage();
    const uptime = process.uptime();
    
    console.log('📊 System Health:');
    console.log(`   Uptime: ${Math.floor(uptime / 60)} minutes`);
    console.log(`   Memory: ${memUsage.heapUsed} / ${memUsage.heapTotal}`);
    console.log(`   RSS: ${memUsage.rss}`);
  }
}

module.exports = new PerformanceMonitor();


// ===== backend/src/utils/rateLimiter.util.js =====

class RateLimiter {
  constructor() {
    this.requests = new Map();
    this.cleanup();
  }

  /**
   * Check if request is allowed
   */
  isAllowed(identifier, maxRequests = 10, windowMs = 60000) {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Filter out old requests
    const recentRequests = userRequests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return {
        allowed: false,
        retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000)
      };
    }

    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);

    return {
      allowed: true,
      remaining: maxRequests - recentRequests.length
    };
  }

  /**
   * Middleware factory
   */
  middleware(options = {}) {
    const maxRequests = options.max || 100;
    const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes

    return (req, res, next) => {
      const identifier = req.ip || req.connection.remoteAddress;
      const result = this.isAllowed(identifier, maxRequests, windowMs);

      if (!result.allowed) {
        return res.status(429).json({
          error: 'Too many requests',
          retryAfter: result.retryAfter
        });
      }

      res.setHeader('X-RateLimit-Remaining', result.remaining);
      next();
    };
  }

  /**
   * Clean up old entries periodically
   */
  cleanup() {
    setInterval(() => {
      const now = Date.now();
      for (const [identifier, requests] of this.requests.entries()) {
        const recentRequests = requests.filter(time => now - time < 60000);
        if (recentRequests.length === 0) {
          this.requests.delete(identifier);
        } else {
          this.requests.set(identifier, recentRequests);
        }
      }
    }, 60000); // Every minute
  }
}

module.exports = new RateLimiter();


// ===== backend/src/utils/cache.util.js =====

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.ttl = new Map();
  }

  /**
   * Set cache with TTL
   */
  set(key, value, ttlMs = 300000) { // Default 5 minutes
    this.cache.set(key, value);
    
    if (ttlMs > 0) {
      const expiresAt = Date.now() + ttlMs;
      this.ttl.set(key, expiresAt);
      
      // Auto-cleanup
      setTimeout(() => {
        this.delete(key);
      }, ttlMs);
    }
  }

  /**
   * Get from cache
   */
  get(key) {
    const expiresAt = this.ttl.get(key);
    
    if (expiresAt && Date.now() > expiresAt) {
      this.delete(key);
      return null;
    }

    return this.cache.get(key);
  }

  /**
   * Check if key exists and is valid
   */
  has(key) {
    return this.get(key) !== null && this.get(key) !== undefined;
  }

  /**
   * Delete from cache
   */
  delete(key) {
    this.cache.delete(key);
    this.ttl.delete(key);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
    this.ttl.clear();
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Middleware for response caching
   */
  middleware(ttlMs = 300000) {
    return (req, res, next) => {
      const key = `${req.method}:${req.originalUrl}`;
      const cached = this.get(key);

      if (cached) {
        return res.json(cached);
      }

      const originalJson = res.json.bind(res);
      res.json = (data) => {
        this.set(key, data, ttlMs);
        return originalJson(data);
      };

      next();
    };
  }
}

module.exports = new CacheManager();


// ===== backend/src/utils/security.util.js =====

const crypto = require('crypto');

class SecurityUtil {
  /**
   * Hash sensitive data
   */
  hash(data) {
    return crypto
      .createHash('sha256')
      .update(data)
      .digest('hex');
  }

  /**
   * Generate secure random token
   */
  generateToken(length = 32) {
    return crypto
      .randomBytes(length)
      .toString('hex');
  }

  /**
   * Sanitize file path to prevent directory traversal
   */
  sanitizePath(filePath) {
    return filePath.replace(/\.\./g, '').replace(/[\/\\]+/g, '/');
  }

  /**
   * Check if string contains sensitive data patterns
   */
  containsSensitiveData(content) {
    const patterns = [
      /api[_-]?key/i,
      /secret/i,
      /password/i,
      /token/i,
      /sk-[a-zA-Z0-9]{32,}/,  // OpenAI keys
      /AKIA[0-9A-Z]{16}/,      // AWS keys
      /ghp_[a-zA-Z0-9]{36}/    // GitHub tokens
    ];

    return patterns.some(pattern => pattern.test(content));
  }

  /**
   * Mask sensitive data in logs
   */
  maskSensitiveData(data) {
    if (typeof data !== 'string') return data;
    
    return data
      .replace(/(api[_-]?key[_-]?[=:]\s*)[\w-]+/gi, '$1***MASKED***')
      .replace(/(secret[_-]?[=:]\s*)[\w-]+/gi, '$1***MASKED***')
      .replace(/(password[_-]?[=:]\s*)[\w-]+/gi, '$1***MASKED***')
      .replace(/sk-[a-zA-Z0-9]{32,}/g, 'sk-***MASKED***')
      .replace(/AKIA[0-9A-Z]{16}/g, 'AKIA***MASKED***');
  }

  /**
   * Validate file upload
   */
  validateFileUpload(file, options = {}) {
    const errors = [];
    const maxSize = options.maxSize || 10 * 1024 * 1024; // 10MB default
    const allowedTypes = options.allowedTypes || [];

    if (file.size > maxSize) {
      errors.push(`File size exceeds ${maxSize / 1024 / 1024}MB`);
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
      errors.push(`File type ${file.mimetype} not allowed`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate CORS options
   */
  getCorsOptions(allowedOrigins = []) {
    return {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    };
  }
}

module.exports = new SecurityUtil();


// ===== backend/scripts/setup.js =====

const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('🚀 Code Generation Platform Setup\n');

  // Check if .env exists
  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', '.env.example');

  if (await fs.pathExists(envPath)) {
    console.log('✓ .env file already exists');
  } else {
    console.log('Creating .env file...');
    await fs.copy(envExamplePath, envPath);
    console.log('✓ .env file created from .env.example');
  }

  // Ask for OpenAI API key
  const apiKey = await question('\n🔑 Enter your OpenAI API key (or press Enter to skip): ');
  
  if (apiKey.trim()) {
    let envContent = await fs.readFile(envPath, 'utf8');
    envContent = envContent.replace(/OPENAI_API_KEY=.*/,`OPENAI_API_KEY=${apiKey.trim()}`);
    await fs.writeFile(envPath, envContent);
    console.log('✓ OpenAI API key saved');
  }

  // Create necessary directories
  const dirs = ['generated', 'logs', 'temp'];
  for (const dir of dirs) {
    const dirPath = path.join(__dirname, '..', dir);
    await fs.ensureDir(dirPath);
    console.log(`✓ Created ${dir}/ directory`);
  }

  console.log('\n✅ Setup complete!');
  console.log('\nNext steps:');
  console.log('  1. npm install');
  console.log('  2. npm run dev');
  console.log('  3. Open http://localhost:5000\n');

  rl.close();
}

setup().catch(error => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});