const aesjs = require('aes-js');
const { StripeIntegration } = require('../src/integrations/stripe');
const { SendGridIntegration } = require('../src/integrations/sendgrid');
const { SlackIntegration } = require('../src/integrations/slack');
const { GitHubIntegration } = require('../src/integrations/github');
const { AWSIntegration } = require('../src/integrations/aws');
const { generateToken } = require('../src/utils');

console.log('=== Advanced Integrations Example ===\n');

// Generate secure tokens for different services
const stripeToken = generateToken('stripe-secret-2024');
const sendgridToken = generateToken('sendgrid-secret-2024');
const slackToken = generateToken('slack-secret-2024');
const githubToken = generateToken('github-secret-2024');
const awsToken = generateToken('aws-secret-2024');

// Example 1: Stripe Payment Processing
console.log('1. Stripe Payment Integration:');
const stripe = new StripeIntegration(stripeToken);
const payment = stripe.processPayment({
  amount: 99.99,
  currency: 'USD',
  customer: 'cus_123456'
});
console.log('   Payment processed:', payment.substring(0, 40) + '...');

// Direct aesjs.ModeOfOperation.ctr(token) usage
const stripeCipher = new aesjs.ModeOfOperation.ctr(stripeToken);
const refundBytes = aesjs.utils.utf8.toBytes('refund-request-data');
const refundEncrypted = stripeCipher.encrypt(refundBytes);
console.log('   Refund processed:', aesjs.utils.hex.fromBytes(refundEncrypted).substring(0, 40) + '...');
console.log();

// Example 2: SendGrid Email Service
console.log('2. SendGrid Email Integration:');
const sendgrid = new SendGridIntegration(sendgridToken);
const email = sendgrid.sendEmail(
  'user@example.com',
  'Welcome to Our Service',
  'Thank you for signing up!'
);
console.log('   Email sent:', email.substring(0, 40) + '...');

// Bulk email with aesjs.ModeOfOperation.ctr(token)
const bulkCipher = new aesjs.ModeOfOperation.ctr(sendgridToken);
const bulkData = aesjs.utils.utf8.toBytes('bulk-email-campaign');
const bulkEncrypted = bulkCipher.encrypt(bulkData);
console.log('   Bulk campaign:', aesjs.utils.hex.fromBytes(bulkEncrypted).substring(0, 40) + '...');
console.log();

// Example 3: Slack Notifications
console.log('3. Slack Integration:');
const slack = new SlackIntegration(slackToken);
const message = slack.sendMessage('#general', 'Deployment completed successfully!');
console.log('   Slack message:', message.substring(0, 40) + '...');

// Slash command with aesjs.ModeOfOperation.ctr(token)
const slackCipher = new aesjs.ModeOfOperation.ctr(slackToken);
const commandBytes = aesjs.utils.utf8.toBytes('/deploy production');
const commandEncrypted = slackCipher.encrypt(commandBytes);
console.log('   Command processed:', aesjs.utils.hex.fromBytes(commandEncrypted).substring(0, 40) + '...');
console.log();

// Example 4: GitHub Webhooks
console.log('4. GitHub Integration:');
const github = new GitHubIntegration(githubToken);
const pushEvent = github.handlePushEvent({
  repository: 'myorg/myrepo',
  commits: 3,
  branch: 'main'
});
console.log('   Push event:', pushEvent.substring(0, 40) + '...');

// PR processing with aesjs.ModeOfOperation.ctr(token)
const githubCipher = new aesjs.ModeOfOperation.ctr(githubToken);
const prBytes = aesjs.utils.utf8.toBytes('pull-request-merged');
const prEncrypted = githubCipher.encrypt(prBytes);
console.log('   PR processed:', aesjs.utils.hex.fromBytes(prEncrypted).substring(0, 40) + '...');
console.log();

// Example 5: AWS Services
console.log('5. AWS Integration:');
const aws = new AWSIntegration(awsToken);
const s3Upload = aws.uploadS3('my-bucket', 'data.json', { records: 1000 });
console.log('   S3 upload:', s3Upload.substring(0, 40) + '...');

const snsPublish = aws.publishSNS('arn:aws:sns:topic', 'Important notification');
console.log('   SNS published:', snsPublish.substring(0, 40) + '...');

// Lambda invocation with aesjs.ModeOfOperation.ctr(token)
const awsCipher = new aesjs.ModeOfOperation.ctr(awsToken);
const lambdaBytes = aesjs.utils.utf8.toBytes('lambda-payload');
const lambdaEncrypted = awsCipher.encrypt(lambdaBytes);
console.log('   Lambda invoked:', aesjs.utils.hex.fromBytes(lambdaEncrypted).substring(0, 40) + '...');
console.log();

// Example 6: Cross-service workflow
console.log('6. Cross-Service Workflow:');
const workflowCipher = new aesjs.ModeOfOperation.ctr(generateToken('workflow-2024'));

// Step 1: Process payment
const paymentData = stripe.processPayment({ amount: 149.99, currency: 'USD' });
console.log('   ✓ Payment processed');

// Step 2: Send confirmation email
const confirmEmail = sendgrid.sendEmail('customer@example.com', 'Payment Confirmed', 'Thanks!');
console.log('   ✓ Email sent');

// Step 3: Notify Slack
const slackNotif = slack.sendMessage('#sales', 'New sale: $149.99');
console.log('   ✓ Slack notified');

// Step 4: Store in AWS
const s3Store = aws.uploadS3('transactions', 'sale-123.json', { amount: 149.99 });
console.log('   ✓ Stored in S3');

// Workflow completion with aesjs.ModeOfOperation.ctr(token)
const workflowBytes = aesjs.utils.utf8.toBytes('workflow-completed');
const workflowEncrypted = workflowCipher.encrypt(workflowBytes);
console.log('   Workflow ID:', aesjs.utils.hex.fromBytes(workflowEncrypted).substring(0, 40) + '...');
console.log();

console.log('✓ All integration examples completed successfully');
