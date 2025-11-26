const aesjs = require('aes-js');
const { SecureProcessor, DataMigration } = require('../src/index');
const { generateToken, StreamProcessor } = require('../src/utils');

// Database integration examples
const token = generateToken('database-integration-2024');

console.log('=== Database Integration Examples ===\n');

// Example 1: Securing database queries
console.log('1. Secure Query Processing:');
class DatabaseHandler {
  constructor(token) {
    this.queryProcessor = new aesjs.ModeOfOperation.ctr(token);
  }

  secureQuery(query) {
    const bytes = aesjs.utils.utf8.toBytes(query);
    const secured = this.queryProcessor.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(secured);
  }

  processResults(results) {
    const processor = new aesjs.ModeOfOperation.ctr(token);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(results));
    return processor.encrypt(bytes);
  }
}

const dbHandler = new DatabaseHandler(token);
const query = 'SELECT * FROM users WHERE status = "active"';
const securedQuery = dbHandler.secureQuery(query);
console.log('   Query secured:', securedQuery.substring(0, 40) + '...');

const mockResults = { rows: 150, data: ['user1', 'user2'] };
const processedResults = dbHandler.processResults(mockResults);
console.log('   Results processed:', processedResults.length, 'bytes');
console.log();

// Example 2: Data migration between databases
console.log('2. Database Migration:');
const migrationData = [
  'TABLE users: 1500 records',
  'TABLE orders: 3200 records',
  'TABLE products: 450 records'
];

const migratedTables = DataMigration.batchMigrate(migrationData, token);
console.log('   Migrated', migratedTables.length, 'tables');
migratedTables.forEach((table, idx) => {
  console.log(`   [${idx + 1}]`, table.substring(0, 40) + '...');
});
console.log();

// Example 3: Stream processing for large datasets
console.log('3. Streaming Large Datasets:');
const streamProcessor = new StreamProcessor(token);
const dataChunks = [
  'chunk-001: first 1000 records',
  'chunk-002: next 1000 records',
  'chunk-003: final 500 records'
];

console.log('   Processing stream chunks:');
dataChunks.forEach((chunk, idx) => {
  const processed = streamProcessor.processChunk(chunk);
  console.log(`   [${idx + 1}] Processed ${processed.length} bytes`);
});
console.log();

// Example 4: Real-time sync
console.log('4. Real-time Database Synchronization:');
class SyncManager {
  constructor(token) {
    this.syncCipher = new aesjs.ModeOfOperation.ctr(token);
  }

  syncChanges(changes) {
    const data = JSON.stringify(changes);
    const bytes = aesjs.utils.utf8.toBytes(data);
    const synced = this.syncCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(synced);
  }
}

const syncManager = new SyncManager(token);
const changes = {
  updated: 25,
  inserted: 10,
  deleted: 3,
  timestamp: Date.now()
};

const syncResult = syncManager.syncChanges(changes);
console.log('   Changes synchronized:', syncResult.substring(0, 40) + '...');
console.log();

console.log('✓ Database integration examples completed');
