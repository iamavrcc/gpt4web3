const aesjs = require('aes-js');
const { APIIntegration, WorkflowHandler } = require('../src/index');
const { generateToken } = require('../src/utils');

// Initialize with your secure token
const token = generateToken('express-api-secret-2024');

// Simulated Express.js integration
class ExpressMiddleware {
  constructor() {
    this.apiHandler = new APIIntegration(token);
    this.workflowHandler = new WorkflowHandler(token);
  }

  // Middleware for processing incoming requests
  processRequest(req, res, next) {
    const secured = this.apiHandler.secureRequest(req.body);
    req.securedPayload = secured;
    console.log('✓ Request secured');
    next();
  }

  // Webhook handler
  handleWebhook(payload) {
    const result = this.workflowHandler.handleWebhook(payload);
    console.log('✓ Webhook processed:', result.substring(0, 40) + '...');
    return result;
  }

  // Background job processor
  processBackgroundJob(jobData) {
    const cipher = new aesjs.ModeOfOperation.ctr(token);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(jobData));
    const processed = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(processed);
  }
}

// Demo usage
console.log('=== Express.js Integration Example ===\n');

const middleware = new ExpressMiddleware();

// Simulate incoming request
console.log('1. Processing API request:');
const mockRequest = {
  body: { userId: '12345', action: 'update_profile' }
};
const mockResponse = {};
const mockNext = () => console.log('   → Passed to next middleware\n');

middleware.processRequest(mockRequest, mockResponse, mockNext);

// Simulate webhook
console.log('2. Handling webhook event:');
const webhookPayload = {
  event: 'payment.success',
  amount: 99.99,
  timestamp: Date.now()
};
middleware.handleWebhook(webhookPayload);
console.log();

// Simulate background job
console.log('3. Processing background job:');
const jobData = {
  type: 'generate_report',
  user: 'admin',
  date: new Date().toISOString()
};
const jobResult = middleware.processBackgroundJob(jobData);
console.log('   Job result:', jobResult.substring(0, 40) + '...');
console.log();

console.log('✓ Express integration examples completed');
