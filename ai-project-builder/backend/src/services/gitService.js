// backend/src/services/gitService.js
const simpleGit = require('simple-git');
const fs = require('fs');
const path = require('path');
const os = require('os');

const cloneRepository = async (repoUrl) => {
  try {
    // Create a temporary directory
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'git-clone-'));
    
    // Clone the repository
    const git = simpleGit();
    await git.clone(repoUrl, tempDir);
    
    // Read all files
    const files = {};
    const readFiles = (dir, basePath = '') => {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const relativePath = basePath ? path.join(basePath, item) : item;
        
        if (fs.statSync(itemPath).isDirectory()) {
          // Skip .git directory
          if (item !== '.git') {
            readFiles(itemPath, relativePath);
          }
        } else {
          // Only read text files
          if (isTextFile(item)) {
            const content = fs.readFileSync(itemPath, 'utf8');
            files[relativePath] = content;
          }
        }
      });
    };
    
    readFiles(tempDir);
    
    // Clean up temporary directory
    fs.rmSync(tempDir, { recursive: true, force: true });
    
    return files;
  } catch (error) {
    console.error('Error cloning repository:', error);
    throw error;
  }
};

const getRepositoryInfo = async (repoUrl) => {
  try {
    // For now, just return basic info
    // In a real implementation, you might want to parse the URL or use GitHub API
    const repoName = repoUrl.split('/').pop().replace('.git', '');
    
    return {
      name: repoName,
      url: repoUrl,
    };
  } catch (error) {
    console.error('Error getting repository info:', error);
    throw error;
  }
};

const isTextFile = (filename) => {
  const textExtensions = [
    '.html', '.htm', '.css', '.js', '.jsx', '.ts', '.tsx', '.json', '.xml',
    '.md', '.txt', '.yml', '.yaml', '.ini', '.cfg', '.conf', '.log',
    '.py', '.java', '.c', '.cpp', '.h', '.hpp', '.cs', '.php', '.rb',
    '.go', '.rs', '.swift', '.kt', '.scala', '.sh', '.bat', '.ps1'
  ];
  
  const ext = path.extname(filename).toLowerCase();
  return textExtensions.includes(ext) || ext === '';
};

module.exports = {
  cloneRepository,
  getRepositoryInfo,
};