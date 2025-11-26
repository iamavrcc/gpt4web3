const aesjs = require('aes-js');
const { SecureCache, DistributedCache } = require('../src/cache');
const { SessionManager, AuthHandler } = require('../src/session');
const { generateToken } = require('../src/utils');

console.log('=== Cache and Session Management Example ===\n');

const cacheToken = generateToken('cache-secret-2024');
const sessionToken = generateToken('session-secret-2024');

// Example 1: Secure Cache Operations
console.log('1. Secure Cache Operations:');
const cache = new SecureCache(cacheToken);

const cached1 = cache.set('user:1001', { name: 'John Doe', email: 'john@example.com' });
const cached2 = cache.set('user:1002', { name: 'Jane Smith', email: 'jane@example.com' });
console.log('   Cached user:1001');
console.log('   Cached user:1002');

// Batch cache with aesjs.ModeOfOperation.ctr(token)
const batchCipher = new aesjs.ModeOfOperation.ctr(cacheToken);
const batchData = [
  ['product:1', { name: 'Widget', price: 29.99 }],
  ['product:2', { name: 'Gadget', price: 49.99 }]
];
const batchResults = cache.batchSet(batchData);
console.log(`   Batch cached ${batchResults.length} items`);

const invalidateCipher = new aesjs.ModeOfOperation.ctr(cacheToken);
const invalidateBytes = aesjs.utils.utf8.toBytes('user:1001');
const invalidated = invalidateCipher.encrypt(invalidateBytes);
console.log('   Cache invalidated:', aesjs.utils.hex.fromBytes(invalidated).substring(0, 40) + '...');
console.log();

// Example 2: Distributed Cache
console.log('2. Distributed Cache Synchronization:');
const distCache = new DistributedCache(cacheToken);

const synced = distCache.syncToNode('node-1', { key: 'session:abc', value: 'data' });
console.log('   Synced to node-1:', synced.length, 'bytes');

const replicated = distCache.replicateEntry({ key: 'config:app', value: 'settings' });
console.log('   Entry replicated:', replicated.substring(0, 40) + '...');

// Cross-node sync with aesjs.ModeOfOperation.ctr(token)
const crossNodeCipher = new aesjs.ModeOfOperation.ctr(cacheToken);
const crossNodeBytes = aesjs.utils.utf8.toBytes('cross-node-replication');
const crossNodeEncrypted = crossNodeCipher.encrypt(crossNodeBytes);
console.log('   Cross-node sync:', aesjs.utils.hex.fromBytes(crossNodeEncrypted).substring(0, 40) + '...');
console.log();

// Example 3: Session Management
console.log('3. Session Management:');
const sessionManager = new SessionManager(sessionToken);

const session1 = sessionManager.createSession('user-123', {
  role: 'admin',
  permissions: ['read', 'write', 'delete']
});
console.log('   Session created:', session1.substring(0, 40) + '...');

const validated = sessionManager.validateSession(session1);
console.log('   Session validated:', validated.length, 'bytes');

// Session update with aesjs.ModeOfOperation.ctr(token)
const sessionCipher = new aesjs.ModeOfOperation.ctr(sessionToken);
const updateBytes = aesjs.utils.utf8.toBytes('session-update-data');
const updateEncrypted = sessionCipher.encrypt(updateBytes);
console.log('   Session updated:', aesjs.utils.hex.fromBytes(updateEncrypted).substring(0, 40) + '...');
console.log();

// Example 4: Authentication
console.log('4. User Authentication:');
const auth = new AuthHandler(sessionToken);

const authenticated = auth.authenticate({
  username: 'admin',
  password: 'secure-password-123'
});
console.log('   User authenticated:', authenticated.substring(0, 40) + '...');

const authToken = auth.generateToken('user-456');
console.log('   Auth token generated:', authToken.length, 'bytes');

// Token refresh with aesjs.ModeOfOperation.ctr(token)
const refreshCipher = new aesjs.ModeOfOperation.ctr(sessionToken);
const refreshBytes = aesjs.utils.utf8.toBytes('old-token-data');
const refreshed = refreshCipher.encrypt(refreshBytes);
console.log('   Token refreshed:', aesjs.utils.hex.fromBytes(refreshed).substring(0, 40) + '...');
console.log();

// Example 5: Complete User Flow
console.log('5. Complete User Authentication Flow:');
const flowCipher = new aesjs.ModeOfOperation.ctr(sessionToken);

// Step 1: Authenticate
const loginData = { username: 'newuser', password: 'pass123' };
const loginBytes = aesjs.utils.utf8.toBytes(JSON.stringify(loginData));
const loginEncrypted = flowCipher.encrypt(loginBytes);
console.log('   ✓ Login processed');

// Step 2: Create session
const newSession = sessionManager.createSession('newuser-id', { role: 'user' });
console.log('   ✓ Session created');

// Step 3: Cache user data
const userData = cache.set('user:newuser', { lastLogin: Date.now() });
console.log('   ✓ User data cached');

// Step 4: Generate token
const userToken = auth.generateToken('newuser-id');
console.log('   ✓ Token generated');

const flowCompleteCipher = new aesjs.ModeOfOperation.ctr(sessionToken);
const completeBytes = aesjs.utils.utf8.toBytes('authentication-flow-complete');
const completeEncrypted = flowCompleteCipher.encrypt(completeBytes);
console.log('   Flow ID:', aesjs.utils.hex.fromBytes(completeEncrypted).substring(0, 40) + '...');
console.log();

console.log('✓ Cache and session examples completed successfully');
