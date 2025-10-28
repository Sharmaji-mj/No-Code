const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// AWS Deployment Script for Frontend
const deployToAWS = async () => {
  try {
    console.log('🚀 Starting frontend AWS deployment...');
    
    // Build the React app
    console.log('🔨 Building React app...');
    execSync('npm run build', { stdio: 'inherit' });
    
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
    
    // Create S3 bucket if it doesn't exist
    const bucketName = 'ai-project-builder-frontend';
    try {
      execSync(`aws s3 mb s3://${bucketName}`, { stdio: 'inherit' });
      console.log(`✅ Created S3 bucket: ${bucketName}`);
    } catch (error) {
      console.log(`ℹ️ S3 bucket ${bucketName} already exists`);
    }
    
    // Configure S3 bucket for static website hosting
    execSync(`aws s3 website s3://${bucketName} --index-document index.html --error-document index.html`, { stdio: 'inherit' });
    
    // Set bucket policy for public access
    const bucketPolicy = {
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "PublicReadGetObject",
          Effect: "Allow",
          Principal: "*",
          Action: "s3:GetObject",
          Resource: `arn:aws:s3:::${bucketName}/*`
        }
      ]
    };
    
    fs.writeFileSync(path.join(__dirname, '../bucket-policy.json'), JSON.stringify(bucketPolicy, null, 2));
    execSync(`aws s3api put-bucket-policy --bucket ${bucketName} --policy file://${path.join(__dirname, '../bucket-policy.json')}`, { stdio: 'inherit' });
    
    // Upload build files to S3
    console.log('📤 Uploading files to S3...');
    execSync(`aws s3 sync ${path.join(__dirname, '../build')} s3://${bucketName} --delete`, { stdio: 'inherit' });
    
    // Create CloudFront distribution if it doesn't exist
    try {
      const distributionConfig = {
        CallerReference: `ai-project-builder-${Date.now()}`,
        Comment: 'AI Project Builder Frontend Distribution',
        DefaultRootObject: 'index.html',
        Origins: {
          Quantity: 1,
          Items: [
            {
              Id: 'S3-ai-project-builder-frontend',
              DomainName: `${bucketName}.s3.amazonaws.com`,
              S3OriginConfig: {
                OriginAccessIdentity: ''
              }
            }
          ]
        },
        DefaultCacheBehavior: {
          TargetOriginId: 'S3-ai-project-builder-frontend',
          ViewerProtocolPolicy: 'redirect-to-https',
          TrustedSigners: {
            Enabled: false,
            Quantity: 0
          },
          ForwardedValues: {
            QueryString: false,
            Cookies: {
              Forward: 'none'
            }
          },
          MinTTL: 0
        },
        Enabled: true
      };
      
      fs.writeFileSync(path.join(__dirname, '../distribution-config.json'), JSON.stringify(distributionConfig, null, 2));
      
      try {
        const result = execSync(`aws cloudfront create-distribution --distribution-config file://${path.join(__dirname, '../distribution-config.json')}`, { encoding: 'utf8' });
        const distributionId = JSON.parse(result).Distribution.Id;
        console.log(`✅ Created CloudFront distribution: ${distributionId}`);
        console.log(`🌐 Your website will be available at: https://${distributionId}.cloudfront.net`);
      } catch (error) {
        console.log('ℹ️ CloudFront distribution might already exist');
      }
    } catch (error) {
      console.error('❌ Failed to create CloudFront distribution:', error);
    }
    
    console.log('🎉 Frontend AWS deployment completed!');
    
  } catch (error) {
    console.error('❌ Frontend deployment failed:', error);
    process.exit(1);
  }
};

// Export the function
module.exports = { deployToAWS };

// Run if called directly
if (require.main === module) {
  deployToAWS();
}