// backend/utils/cleanup.js
const fs = require('fs').promises;
const path = require('path');

const TEMP_DIR = path.join(__dirname, '../temp');
const PREVIEWS_DIR = path.join(TEMP_DIR, 'previews');
const EXPORTS_DIR = path.join(TEMP_DIR, 'exports');

/**
 * Clean up old files from temporary directories
 * @param {string} directory - Directory to clean
 * @param {number} maxAgeHours - Maximum file age in hours
 */
const cleanupOldFiles = async (directory, maxAgeHours = 24) => {
  try {
    const files = await fs.readdir(directory);
    const now = Date.now();
    const maxAge = maxAgeHours * 60 * 60 * 1000;
    
    let deletedCount = 0;
    let totalSize = 0;
    
    for (const file of files) {
      const filePath = path.join(directory, file);
      const stats = await fs.stat(filePath);
      
      if (now - stats.mtimeMs > maxAge) {
        totalSize += stats.size;
        await fs.rm(filePath, { recursive: true, force: true });
        deletedCount++;
      }
    }
    
    if (deletedCount > 0) {
      console.log(`🗑️ Cleaned up ${deletedCount} files (${(totalSize / 1024 / 1024).toFixed(2)} MB) from ${path.basename(directory)}`);
    }
    
    return { deletedCount, totalSize };
  } catch (err) {
    console.error(`Error cleaning up ${directory}:`, err);
    return { deletedCount: 0, totalSize: 0 };
  }
};

/**
 * Run cleanup on all temporary directories
 */
const runCleanup = async () => {
  console.log('🧹 Starting cleanup...');
  
  const previewCleanup = await cleanupOldFiles(PREVIEWS_DIR, 24); // 24 hours
  const exportCleanup = await cleanupOldFiles(EXPORTS_DIR, 2); // 2 hours
  
  console.log('✅ Cleanup complete!');
  return {
    previews: previewCleanup,
    exports: exportCleanup
  };
};

module.exports = { runCleanup, cleanupOldFiles };