// backend/test-api.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:5000/api';
const TEST_TOKEN = process.env.TEST_TOKEN || 'your-test-token-here';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Authorization': `Bearer ${TEST_TOKEN}`
  }
});

console.log('🧪 Starting API Tests...\n');

// Test 1: Health Check
async function testHealth() {
  try {
    console.log('1️⃣ Testing health endpoint...');
    const response = await api.get('/mejuvante/health');
    console.log('✅ Health check passed:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

// Test 2: Code Generation
async function testGeneration() {
  try {
    console.log('\n2️⃣ Testing code generation...');
    const response = await api.post('/mejuvante/generate', {
      prompt: 'Create a simple HTML page with a button that shows an alert',
      projectId: 'test-project-123',
      stack: 'HTML/CSS/JavaScript'
    });
    
    console.log('✅ Code generation passed');
    console.log(`   - Response length: ${response.data.reply.length} characters`);
    console.log(`   - Tokens used: ${response.data.tokens_used}`);
    return response.data;
  } catch (error) {
    console.error('❌ Code generation failed:', error.message);
    return null;
  }
}

// Test 3: Preview Creation
async function testPreview(files) {
  try {
    console.log('\n3️⃣ Testing preview creation...');
    const response = await api.post('/mejuvante/preview/create', {
      projectId: 'test-project-123',
      files: files || [{
        path: 'index.html',
        content: '<html><body><h1>Test</h1></body></html>',
        language: 'html'
      }]
    });
    
    console.log('✅ Preview creation passed');
    console.log(`   - Preview URL: ${response.data.previewUrl}`);
    
    // Test preview access
    const previewResponse = await axios.get(`${API_BASE}${response.data.previewUrl}`);
    if (previewResponse.status === 200) {
      console.log('✅ Preview accessible');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Preview creation failed:', error.message);
    return null;
  }
}

// Test 4: Code Validation
async function testValidation() {
  try {
    console.log('\n4️⃣ Testing code validation...');
    const response = await api.post('/mejuvante/validate', {
      files: [{
        path: 'test.js',
        content: 'function test() { console.log("hello"); }',
        language: 'javascript'
      }]
    });
    
    console.log('✅ Code validation passed');
    console.log(`   - Score: ${response.data.score}/100`);
    console.log(`   - Status: ${response.data.status}`);
    return response.data;
  } catch (error) {
    console.error('❌ Code validation failed:', error.message);
    return null;
  }
}

// Test 5: Export ZIP
async function testExport() {
  try {
    console.log('\n5️⃣ Testing ZIP export...');
    const response = await api.post('/mejuvante/export-zip', {
      files: [{
        path: 'index.html',
        content: '<html><body><h1>Test</h1></body></html>',
        language: 'html'
      }],
      projectName: 'Test Project'
    });
    
    console.log('✅ ZIP export passed');
    console.log(`   - Download URL: ${response.data.downloadUrl}`);
    console.log(`   - Expires at: ${response.data.expiresAt}`);
    return response.data;
  } catch (error) {
    console.error('❌ ZIP export failed:', error.message);
    return null;
  }
}

// Test 6: Deployment Options
async function testDeploymentOptions() {
  try {
    console.log('\n6️⃣ Testing deployment options...');
    const response = await api.get('/mejuvante/deploy/options?applicationType=web');
    
    console.log('✅ Deployment options passed');
    console.log(`   - Application type: ${response.data.applicationType}`);
    console.log(`   - Available options: ${response.data.options.length}`);
    console.log(`   - Available regions: ${response.data.regions.length}`);
    return response.data;
  } catch (error) {
    console.error('❌ Deployment options failed:', error.message);
    return null;
  }
}

// Test 7: Cost Calculator
async function testCostCalculator() {
  try {
    console.log('\n7️⃣ Testing cost calculator...');
    const response = await api.post('/mejuvante/calculate-cost', {
      instanceType: 't2.micro',
      storage: 20,
      bandwidth: 10,
      monitoring: false,
      hours: 730
    });
    
    console.log('✅ Cost calculator passed');
    console.log(`   - Monthly cost: $${response.data.total}`);
    console.log(`   - Hourly cost: $${response.data.breakdown.hourly}`);
    return response.data;
  } catch (error) {
    console.error('❌ Cost calculator failed:', error.message);
    return null;
  }
}

// Run all tests
async function runTests() {
  const results = {
    passed: 0,
    failed: 0,
    total: 7
  };
  
  const tests = [
    testHealth,
    testGeneration,
    testPreview,
    testValidation,
    testExport,
    testDeploymentOptions,
    testCostCalculator
  ];
  
  for (const test of tests) {
    const result = await test();
    if (result !== null && result !== false) {
      results.passed++;
    } else {
      results.failed++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${results.passed}/${results.total}`);
  console.log(`❌ Failed: ${results.failed}/${results.total}`);
  console.log('='.repeat(50));
  
  process.exit(results.failed > 0 ? 1 : 0);
}

runTests();