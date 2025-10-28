const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// AWS Deployment Script
const deployToAWS = async () => {
  try {
    console.log('🚀 Starting AWS deployment...');
    
    // Check if AWS CLI is installed
    try {
      execSync('aws --version', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ AWS CLI is not installed. Please install it first.');
      process.exit(1);
    }
    
    // Check if user is logged in to AWS
    try {
      execSync('aws sts get-caller-identity', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Not logged in to AWS. Please run "aws configure" first.');
      process.exit(1);
    }
    
    // Create deployment package
    console.log('📦 Creating deployment package...');
    const packageDir = path.join(__dirname, '../deploy-package');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(packageDir)) {
      fs.mkdirSync(packageDir, { recursive: true });
    }
    
    // Copy necessary files
    const filesToCopy = [
      'src',
      'package.json',
      'package-lock.json',
      '.env'
    ];
    
    filesToCopy.forEach(file => {
      const srcPath = path.join(__dirname, '..', file);
      const destPath = path.join(packageDir, file);
      
      if (fs.existsSync(srcPath)) {
        if (fs.statSync(srcPath).isDirectory()) {
          execSync(`cp -r ${srcPath} ${destPath}`, { stdio: 'inherit' });
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    });
    
    // Create zip file
    console.log('🗜️ Creating deployment package zip...');
    execSync(`cd ${packageDir} && zip -r ../deployment-package.zip .`, { stdio: 'inherit' });
    
    // Deploy to Elastic Beanstalk
    console.log('🌱 Deploying to AWS Elastic Beanstalk...');
    
    // Create application if it doesn't exist
    try {
      execSync('aws elasticbeanstalk create-application --application-name ai-project-builder', { stdio: 'inherit' });
      console.log('✅ Created Elastic Beanstalk application');
    } catch (error) {
      // Application already exists
      console.log('ℹ️ Elastic Beanstalk application already exists');
    }
    
    // Create application version
    const versionLabel = `v${Date.now()}`;
    execSync(`aws elasticbeanstalk create-application-version --application-name ai-project-builder --version-label ${versionLabel} --source-bundle S3Bucket=elasticbeanstalk-us-east-1-123456789012,S3Key=deployment-package.zip`, { stdio: 'inherit' });
    
    // Update environment
    try {
      execSync(`aws elasticbeanstalk update-environment --application-name ai-project-builder --environment-name ai-project-builder-env --version-label ${versionLabel}`, { stdio: 'inherit' });
      console.log('✅ Deployment initiated successfully');
    } catch (error) {
      console.error('❌ Failed to update environment:', error);
    }
    
    console.log('🎉 AWS deployment completed!');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
};

// Export the function
module.exports = { deployToAWS };

// Run if called directly
if (require.main === module) {
  deployToAWS();
}