const { SecureProcessor, DataMigration } = require('../src/index');
const { generateToken } = require('../src/utils');

// Generate a secure token
const token = generateToken('my-secure-seed-2024');

console.log('=== GPT4Web3 Basic Usage ===\n');

// Example 1: Simple data processing
console.log('1. Processing sensitive data:');
const processor = new SecureProcessor(token);
const sensitiveData = 'user-email@example.com';
const processed = processor.process(sensitiveData);
console.log('   Original:', sensitiveData);
console.log('   Processed:', processed);
console.log();

// Example 2: Batch processing
console.log('2. Batch processing multiple records:');
const records = [
  'customer-record-001',
  'customer-record-002',
  'customer-record-003'
];
const batchResult = processor.batchProcess(records);
console.log('   Records processed:', batchResult.length);
batchResult.forEach((result, idx) => {
  console.log(`   [${idx + 1}]`, result.substring(0, 40) + '...');
});
console.log();

// Example 3: Data migration
console.log('3. Migrating data between systems:');
const legacyData = 'legacy-system-data-format';
const migrated = DataMigration.migrate(legacyData, token);
console.log('   Migration completed:', migrated.substring(0, 40) + '...');
console.log();

console.log('✓ All operations completed successfully');
