// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');

// // Deploy to AWS
// router.post('/aws', auth, async (req, res) => {
//   try {
//     const { projectId } = req.body;
    
//     // For now, just return a success message
//     // In a real implementation, you would trigger the actual deployment process
//     res.json({
//       success: true,
//       message: 'AWS deployment initiated successfully! Your project will be available shortly.'
//     });
//   } catch (error) {
//     console.error('Deployment error:', error);
//     res.status(500).json({
//       error: 'Deployment failed. Please check the server logs for details.'
//     });
//   }
// });

// // General deploy endpoint
// router.post('/', auth, async (req, res) => {
//   try {
//     const { platform } = req.body;
    
//     if (platform === 'aws') {
//       // For now, just return a success message
//       // In a real implementation, you would trigger the actual deployment process
//       res.json({
//         success: true,
//         message: 'AWS deployment initiated successfully! Your project will be available shortly.'
//       });
//     } else {
//       res.status(400).json({
//         error: `Deployment to ${platform} is not supported yet.`
//       });
//     }
//   } catch (error) {
//     console.error('Deployment error:', error);
//     res.status(500).json({
//       error: 'Deployment failed. Please check the server logs for details.'
//     });
//   }
// });

// module.exports = router;




// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');

// // Deploy to AWS
// router.post('/aws', auth, async (req, res) => {
//   try {
//     const { projectId } = req.body;
    
//     // For now, just return a success message
//     // In a real implementation, you would trigger the actual deployment process
//     res.json({
//       success: true,
//       message: 'AWS deployment initiated successfully! Your project will be available shortly.'
//     });
//   } catch (error) {
//     console.error('Deployment error:', error);
//     res.status(500).json({
//       error: 'Deployment failed. Please check the server logs for details.'
//     });
//   }
// });

// // General deploy endpoint
// router.post('/', auth, async (req, res) => {
//   try {
//     const { platform } = req.body;
    
//     if (platform === 'aws') {
//       // For now, just return a success message
//       // In a real implementation, you would trigger the actual deployment process
//       res.json({
//         success: true,
//         message: 'AWS deployment initiated successfully! Your project will be available shortly.'
//       });
//     } else {
//       res.status(400).json({
//         error: `Deployment to ${platform} is not supported yet.`
//       });
//     }
//   } catch (error) {
//     console.error('Deployment error:', error);
//     res.status(500).json({
//       error: 'Deployment failed. Please check the server logs for details.'
//     });
//   }
// });

// module.exports = router;




// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');

// // Deploy to AWS
// router.post('/aws', auth, async (req, res) => {
//   try {
//     const { projectId } = req.body;
    
//     res.json({
//       success: true,
//       message: 'AWS deployment initiated successfully! Your project will be available shortly.'
//     });
//   } catch (error) {
//     console.error('Deployment error:', error);
//     res.status(500).json({
//       error: 'Deployment failed. Please check the server logs for details.'
//     });
//   }
// });

// // General deploy endpoint
// router.post('/', auth, async (req, res) => {
//   try {
//     const { platform } = req.body;
    
//     if (platform === 'aws') {
//       res.json({
//         success: true,
//         message: 'AWS deployment initiated successfully! Your project will be available shortly.'
//       });
//     } else {
//       res.status(400).json({
//         error: `Deployment to ${platform} is not supported yet.`
//       });
//     }
//   } catch (error) {
//     console.error('Deployment error:', error);
//     res.status(500).json({
//       error: 'Deployment failed. Please check the server logs for details.'
//     });
//   }
// });

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth");

// // --------------------------------------------
// // GET Deployment Options
// // --------------------------------------------
// router.get("/options", async (req, res) => {
//   try {
//     const { applicationType = "web" } = req.query;

//     // Static deployment options (you can expand this later)
//     const options = [
//       {
//         id: "ec2-basic",
//         name: "AWS EC2 Standard",
//         description: "Run your full-stack app on a virtual EC2 instance.",
//         instanceTypes: [
//           {
//             id: "t2.micro",
//             name: "t2.micro",
//             hourlyRate: 0.0116,
//             memory: "1 GB",
//             cpu: "1 vCPU",
//             storage: "8 GB",
//           },
//           {
//             id: "t2.small",
//             name: "t2.small",
//             hourlyRate: 0.023,
//             memory: "2 GB",
//             cpu: "1 vCPU",
//             storage: "20 GB",
//           },
//           {
//             id: "t2.medium",
//             name: "t2.medium",
//             hourlyRate: 0.0464,
//             memory: "4 GB",
//             cpu: "2 vCPU",
//             storage: "40 GB",
//           },
//         ],
//         estimatedCost: {
//           compute: 0.0116 * 730,
//           storage: 20 * 0.1,
//           bandwidth: 100 * 0.09,
//           total:
//             0.0116 * 730 +
//             20 * 0.1 +
//             100 * 0.09,
//         },
//       },
//       {
//         id: "lambda-basic",
//         name: "AWS Lambda",
//         description: "Serverless deployment for event-driven or lightweight apps.",
//         instanceTypes: [
//           {
//             id: "lambda-1024",
//             name: "Lambda 1GB",
//             hourlyRate: 0.0000167,
//             memory: "1 GB",
//             cpu: "1 vCPU",
//             storage: "512 MB",
//           },
//         ],
//         estimatedCost: {
//           compute: 0.0000167 * 730,
//           storage: 5 * 0.1,
//           bandwidth: 10 * 0.09,
//           total:
//             0.0000167 * 730 +
//             5 * 0.1 +
//             10 * 0.09,
//         },
//       },
//     ];

//     res.json(options);
//   } catch (error) {
//     console.error("Error fetching deployment options:", error);
//     res.status(500).json({ error: "Failed to fetch deployment options" });
//   }
// });

// // --------------------------------------------
// // POST: Deploy to AWS
// // --------------------------------------------
// router.post("/aws", auth, async (req, res) => {
//   try {
//     const { projectName, deploymentType } = req.body;

//     // Use static AWS credentials (you provide from your backend env)
//     const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
//     const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

//     if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
//       return res.status(500).json({
//         error: "AWS credentials not configured in backend",
//       });
//     }

//     // Simulate deployment (here you could integrate actual AWS SDK calls)
//     console.log(`Deploying project '${projectName}' with type '${deploymentType}'`);

//     const deploymentResult = {
//       success: true,
//       message: "Deployment successful!",
//       url: `https://${projectName.toLowerCase()}.mejuvante.app`,
//       instanceId: "i-0abc1234xyz",
//       region: "us-east-1",
//       estimatedCost: 25.5,
//     };

//     res.json(deploymentResult);
//   } catch (error) {
//     console.error("Deployment error:", error);
//     res.status(500).json({
//       error: "Deployment failed. Please check server logs.",
//     });
//   }
// });

// module.exports = router;



/**
 * routes/deploy.js
 * Handles deployment logic to AWS and other providers.
 */

// const express = require("express");
// const router = express.Router();
// const AWS = require("aws-sdk");
// const auth = require("../middleware/auth");
// require("dotenv").config();

// // --------------------------------------------
// // 1️⃣ Get Deployment Options (for UI)
// // --------------------------------------------
// router.get("/options", async (req, res) => {
//   try {
//     const { applicationType = "web" } = req.query;

//     const options = [
//       {
//         id: "ec2-basic",
//         name: "AWS EC2 Instance",
//         description: "Deploy your app on a dedicated EC2 virtual server.",
//         instanceTypes: [
//           { id: "t2.micro", name: "t2.micro", cpu: "1 vCPU", memory: "1 GB", storage: "8 GB", hourlyRate: 0.0116 },
//           { id: "t2.small", name: "t2.small", cpu: "1 vCPU", memory: "2 GB", storage: "20 GB", hourlyRate: 0.023 },
//           { id: "t2.medium", name: "t2.medium", cpu: "2 vCPU", memory: "4 GB", storage: "40 GB", hourlyRate: 0.0464 },
//         ],
//         estimatedCost: {
//           monthly: (0.0116 * 730).toFixed(2),
//         },
//       },
//       {
//         id: "lambda-basic",
//         name: "AWS Lambda",
//         description: "Run small, event-driven apps with no server management.",
//         instanceTypes: [
//           { id: "lambda-1024", name: "Lambda 1GB", memory: "1 GB", cpu: "1 vCPU", storage: "512 MB" },
//         ],
//         estimatedCost: {
//           monthly: (0.0000167 * 730).toFixed(2),
//         },
//       },
//     ];

//     res.json({ success: true, options });
//   } catch (error) {
//     console.error("Error fetching deployment options:", error);
//     res.status(500).json({ success: false, error: "Failed to fetch deployment options" });
//   }
// });

// // --------------------------------------------
// // 2️⃣ Middleware: Check Subscription
// // --------------------------------------------
// const checkSubscription = async (req, res, next) => {
//   try {
//     const user = req.user; // from auth middleware
//     // Replace this with actual DB check
//     const hasSubscription = true;

//     if (!hasSubscription) {
//       return res.status(403).json({
//         success: false,
//         message: "You need an active subscription to deploy projects.",
//         redirectTo: "/subscribe",
//       });
//     }

//     next();
//   } catch (err) {
//     console.error("Subscription check failed:", err);
//     res.status(500).json({ success: false, message: "Subscription verification failed" });
//   }
// };

// // --------------------------------------------
// // 3️⃣ Deploy Project to AWS EC2
// // --------------------------------------------
// router.post("/aws", auth, checkSubscription, async (req, res) => {
//   try {
//     const { projectName, deploymentType, instanceType = "t2.micro" } = req.body;

//     // Configure AWS SDK
//     AWS.config.update({
//       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//       region: process.env.AWS_REGION || "us-east-1",
//     });

//     const ec2 = new AWS.EC2();

//     // Launch EC2 instance
//     const params = {
//       ImageId: "ami-0c02fb55956c7d316", // Amazon Linux 2 AMI
//       InstanceType: instanceType,
//       MinCount: 1,
//       MaxCount: 1,
//       TagSpecifications: [
//         {
//           ResourceType: "instance",
//           Tags: [{ Key: "Name", Value: projectName }],
//         },
//       ],
//       SecurityGroups: ["default"],
//     };

//     console.log(`[DEPLOY] Starting EC2 for ${projectName} (${instanceType})...`);
//     const launch = await ec2.runInstances(params).promise();
//     const instanceId = launch.Instances[0].InstanceId;

//     // Wait for running state
//     await ec2.waitFor("instanceRunning", { InstanceIds: [instanceId] }).promise();

//     // Get instance details
//     const details = await ec2.describeInstances({ InstanceIds: [instanceId] }).promise();
//     const publicDns = details.Reservations[0].Instances[0].PublicDnsName;

//     // Simulate code deployment (in real setup, use SSH or AWS CodeDeploy)
//     console.log(`[DEPLOY] Code uploaded to ${publicDns}`);

//     const appUrl = `http://${publicDns}:3000`;

//     res.json({
//       success: true,
//       message: "✅ Project deployed successfully to AWS!",
//       instanceId,
//       region: process.env.AWS_REGION || "us-east-1",
//       url: appUrl,
//     });
//   } catch (error) {
//     console.error("AWS Deployment Error:", error);
//     res.status(500).json({
//       success: false,
//       error: error.message || "Deployment failed. Please check logs.",
//     });
//   }
// });

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const AWS = require("aws-sdk");
// const auth = require("../middleware/auth");
// require("dotenv").config();

// // --------------------------------------------
// // 1️⃣ Get Deployment Options (for UI)
// // --------------------------------------------
// router.get("/options", async (req, res) => {
//   try {
//     const options = [
//       {
//         id: "ec2-basic",
//         name: "AWS EC2 Instance",
//         description: "Deploy your app on a dedicated EC2 virtual server.",
//         instanceTypes: [
//           { id: "t2.micro", name: "t2.micro", cpu: "1 vCPU", memory: "1 GB", storage: "8 GB", hourlyRate: 0.0116 },
//           { id: "t2.small", name: "t2.small", cpu: "1 vCPU", memory: "2 GB", storage: "20 GB", hourlyRate: 0.023 },
//           { id: "t2.medium", name: "t2.medium", cpu: "2 vCPU", memory: "4 GB", storage: "40 GB", hourlyRate: 0.0464 },
//         ],
//         estimatedCost: {
//           compute: 0.0116 * 730,
//           storage: 10,
//           bandwidth: 5,
//           total: 0.0116 * 730 + 10 + 5,
//         },
//       },
//       {
//         id: "lambda-basic",
//         name: "AWS Lambda",
//         description: "Run small, event-driven apps with no server management.",
//         instanceTypes: [
//           { id: "lambda-1024", name: "Lambda 1GB", memory: "1 GB", cpu: "1 vCPU", storage: "512 MB", hourlyRate: 0 },
//         ],
//         estimatedCost: {
//           compute: 0.0000167 * 730,
//           storage: 0,
//           bandwidth: 0,
//           total: 0.0000167 * 730,
//         },
//       },
//     ];

//     res.json({ success: true, options });
//   } catch (error) {
//     console.error("Error fetching deployment options:", error);
//     res.status(500).json({ success: false, error: "Failed to fetch deployment options" });
//   }
// });

// // --------------------------------------------
// // 2️⃣ Middleware: Check Subscription
// // --------------------------------------------
// const checkSubscription = async (req, res, next) => {
//   try {
//     const user = req.user; // from auth middleware
//     // TODO: Replace with actual DB check
//     const hasSubscription = true;

//     if (!hasSubscription) {
//       return res.status(403).json({
//         success: false,
//         message: "You need an active subscription to deploy projects.",
//         redirectTo: "/subscribe",
//       });
//     }

//     next();
//   } catch (err) {
//     console.error("Subscription check failed:", err);
//     res.status(500).json({ success: false, message: "Subscription verification failed" });
//   }
// };

// // --------------------------------------------
// // 3️⃣ Deploy Project to AWS EC2
// // --------------------------------------------
// router.post("/aws", auth, checkSubscription, async (req, res) => {
//   try {
//     const { projectName, instanceType = "t2.micro" } = req.body;

//     // Configure AWS SDK
//     AWS.config.update({
//       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//       region: process.env.AWS_REGION || "us-east-1",
//     });

//     const ec2 = new AWS.EC2();

//     // Launch EC2 instance
//     const params = {
//       ImageId: "ami-0c02fb55956c7d316", // Amazon Linux 2 AMI
//       InstanceType: instanceType,
//       MinCount: 1,
//       MaxCount: 1,
//       TagSpecifications: [
//         {
//           ResourceType: "instance",
//           Tags: [{ Key: "Name", Value: projectName }],
//         },
//       ],
//       SecurityGroups: ["default"],
//     };

//     console.log(`[DEPLOY] Starting EC2 for ${projectName} (${instanceType})...`);
//     const launch = await ec2.runInstances(params).promise();
//     const instanceId = launch.Instances[0].InstanceId;

//     // Wait until instance is running
//     await ec2.waitFor("instanceRunning", { InstanceIds: [instanceId] }).promise();

//     // Get instance details
//     const details = await ec2.describeInstances({ InstanceIds: [instanceId] }).promise();
//     const publicDns = details.Reservations[0].Instances[0].PublicDnsName;

//     // Simulate deployment (replace with actual code deployment)
//     console.log(`[DEPLOY] Code deployed to ${publicDns}`);

//     const appUrl = `http://${publicDns}:3000`;

//     res.json({
//       success: true,
//       message: "✅ Project deployed successfully to AWS!",
//       instanceId,
//       region: process.env.AWS_REGION || "us-east-1",
//       url: appUrl,
//       estimatedCost: 10, // you can calculate real cost if needed
//     });
//   } catch (error) {
//     console.error("AWS Deployment Error:", error);
//     res.status(500).json({
//       success: false,
//       error: error.message || "Deployment failed. Please check logs.",
//     });
//   }
// });

// module.exports = router;



// backend/routes/deploy.js
import express from "express";
import {
  EC2Client,
  RunInstancesCommand,
  DescribeInstancesCommand,
} from "@aws-sdk/client-ec2";
import { S3Client, CreateBucketCommand } from "@aws-sdk/client-s3";

const router = express.Router();

router.post("/", async (req, res) => {
  const { projectName, purpose, os, region, ram } = req.body;

  if (!projectName || !purpose || !os || !region || !ram) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const ec2 = new EC2Client({ region });

    const instanceParams = {
      ImageId: getAmiId(os, region),
      InstanceType: mapRamToInstanceType(ram),
      MinCount: 1,
      MaxCount: 1,
      TagSpecifications: [
        {
          ResourceType: "instance",
          Tags: [{ Key: "Name", Value: projectName }],
        },
      ],
    };

    const runCommand = new RunInstancesCommand(instanceParams);
    const data = await ec2.send(runCommand);
    const instanceId = data.Instances[0].InstanceId;

    // Describe instance
    const describeCommand = new DescribeInstancesCommand({
      InstanceIds: [instanceId],
    });
    const desc = await ec2.send(describeCommand);
    const publicIp = desc.Reservations?.[0]?.Instances?.[0]?.PublicIpAddress || "Pending";

    // Create S3 bucket if static site
    if (purpose === "static") {
      const s3 = new S3Client({ region });
      const bucketName = `${projectName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
      await s3.send(new CreateBucketCommand({ Bucket: bucketName }));
    }

    res.status(200).json({
      success: true,
      message: "Deployment initiated",
      instanceId,
      ipAddress: publicIp,
    });
  } catch (err) {
    console.error("Deployment error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

function mapRamToInstanceType(ram) {
  const map = {
    "1 GB": "t3.nano",
    "2 GB": "t3.micro",
    "4 GB": "t3.small",
    "8 GB": "t3.medium",
    "16 GB": "t3.large",
  };
  return map[ram] || "t3.micro";
}

function getAmiId(os, region) {
  const amiMap = {
    "Ubuntu 22.04": {
      "ap-south-1": "ami-0f58b397bc5c1f2e8",
      "eu-central-1": "ami-099981549d4358e9a",
    },
    "Debian 12": {
      "ap-south-1": "ami-0c614dee691cbbf37",
      "eu-central-1": "ami-007855ac798b5175e",
    },
    "CentOS 9": {
      "ap-south-1": "ami-07d3b31f8efc96b59",
      "eu-central-1": "ami-0b89f7c17997b4b01",
    },
    "Alpine 3.19": {
      "ap-south-1": "ami-0e6e3b3bcae5d9a3e",
      "eu-central-1": "ami-03cba9f10b39b2a1f",
    },
  };
  return amiMap[os]?.[region] || "ami-0f58b397bc5c1f2e8";
}

export default router;
