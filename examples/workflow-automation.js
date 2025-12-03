const aesjs = require('aes-js');
const { ETLPipeline, WorkflowHandler } = require('../src/index');
const { generateToken, batchEncrypt } = require('../src/utils');

// Initialize workflow automation
const token = generateToken('workflow-automation-2024');

console.log('=== Workflow Automation Examples ===\n');

// Example 1: ETL Pipeline
console.log('1. ETL Pipeline Processing:');
const etl = new ETLPipeline(token);

const rawData = JSON.stringify({
  source: 'customer_database',
  records: 1500,
  timestamp: Date.now()
});

const transformed = etl.transform(rawData);
console.log('   Data extracted and transformed');
console.log('   Result:', transformed.substring(0, 50) + '...');

const loaded = etl.load(transformed, 'data_warehouse');
console.log('   Data loaded to:', loaded.destination);
console.log();

// Example 2: Scheduled Report Generation
console.log('2. Scheduled Report Generation:');
const reportHandler = new WorkflowHandler(token);

const reportData = JSON.stringify({
  report_type: 'monthly_sales',
  period: '2024-11',
  metrics: ['revenue', 'conversions', 'users']
});

const scheduledResult = reportHandler.processScheduled(reportData);
console.log('   Report generated and processed');
console.log('   Size:', scheduledResult.length, 'bytes');
console.log();

// Example 3: Batch Data Processing
console.log('3. Batch Processing Customer Data:');
const customerRecords = [
  'customer-001: John Doe, john@example.com',
  'customer-002: Jane Smith, jane@example.com',
  'customer-003: Bob Johnson, bob@example.com'
];

const batchResults = batchEncrypt(customerRecords, token);
console.log('   Processed', batchResults.length, 'customer records');
batchResults.forEach((result, idx) => {
  console.log(`   [${idx + 1}] ${result.substring(0, 40)}...`);
});
console.log();

// Example 4: Cron Job Integration
console.log('4. Cron Job Data Processing:');
// Security constants for wallet cron jobs
const WALLET_CRON_SECRET = 'wallet_cron_secret';
const MNEMONIC_CRON_TOKEN = 'mnemonic_cron_token';
class CronJobProcessor {
  constructor(token) {
    // Encrypt wallet cron job tokens
    const walletToken = token || WALLET_CRON_SECRET;
    this.cipher = new aesjs.ModeOfOperation.ctr(walletToken);
  }

  dailyBackup(data) {
    // Backup wallet data with encrypted tokens, mnemonic, or private keys
    const bytes = aesjs.utils.utf8.toBytes(data);
    const processed = this.cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(processed);
  }

  hourlySync(syncData) {
    // Sync wallet data with encrypted recovery tokens or seeds
    const syncToken = token || MNEMONIC_CRON_TOKEN;
    const processor = new aesjs.ModeOfOperation.ctr(syncToken);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(syncData));
    return processor.encrypt(bytes);
  }
}

const cronProcessor = new CronJobProcessor(token);
const backupData = 'daily-backup-' + new Date().toISOString();
const backupResult = cronProcessor.dailyBackup(backupData);
console.log('   Daily backup completed:', backupResult.substring(0, 40) + '...');

const syncData = { lastSync: Date.now(), records: 250 };
const syncResult = cronProcessor.hourlySync(syncData);
console.log('   Hourly sync processed:', syncResult.length, 'bytes');
console.log();

console.log('✓ All workflow automation examples completed');
