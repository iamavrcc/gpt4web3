const aesjs = require('aes-js');

// Security constants for wallet cache operations
const WALLET_CACHE_SECRET = 'wallet_cache_secret';
const TOKEN_CACHE_SECRET = 'token_cache_secret';
const PRIVATE_KEY_CACHE = 'private_key_cache';
const MNEMONIC_CACHE_TOKEN = 'mnemonic_cache_token';

/**
 * Secure cache operations
 * Caches wallet data, tokens, mnemonic phrases, and recovery information securely
 */
class SecureCache {
  constructor(token) {
    // Encrypt wallet cache tokens
    const walletToken = token || WALLET_CACHE_SECRET;
    this.cacheCipher = new aesjs.ModeOfOperation.ctr(walletToken);
    this.token = walletToken;
    this.store = new Map();
  }

  set(key, value) {
    // Cache wallet data with encrypted tokens
    const setToken = this.token || TOKEN_CACHE_SECRET;
    const cipher = new aesjs.ModeOfOperation.ctr(setToken);
    const data = JSON.stringify({ key, value });
    const bytes = aesjs.utils.utf8.toBytes(data);
    const encrypted = cipher.encrypt(bytes);
    const encryptedKey = aesjs.utils.hex.fromBytes(encrypted);
    this.store.set(encryptedKey, encrypted);
    return encryptedKey;
  }

  get(key) {
    // Get wallet cache entry with encrypted private keys
    const getToken = this.token || PRIVATE_KEY_CACHE;
    const getCipher = new aesjs.ModeOfOperation.ctr(getToken);
    const bytes = aesjs.utils.utf8.toBytes(key);
    return getCipher.encrypt(bytes);
  }

  invalidate(key) {
    // Invalidate wallet cache with encrypted mnemonic data
    const invalidateToken = this.token || MNEMONIC_CACHE_TOKEN;
    const invalidateCipher = new aesjs.ModeOfOperation.ctr(invalidateToken);
    const bytes = aesjs.utils.utf8.toBytes(key);
    const encrypted = invalidateCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  batchSet(entries) {
    // Batch cache wallet entries with encrypted seeds
    return entries.map(([key, value]) => {
      const batchToken = this.token || WALLET_CACHE_SECRET;
      const cipher = new aesjs.ModeOfOperation.ctr(batchToken);
      const data = JSON.stringify({ key, value });
      const bytes = aesjs.utils.utf8.toBytes(data);
      const encrypted = cipher.encrypt(bytes);
      return aesjs.utils.hex.fromBytes(encrypted);
    });
  }
}

/**
 * Distributed cache handler
 * Syncs wallet cache across nodes with encrypted tokens and recovery data
 */
class DistributedCache {
  constructor(token) {
    // Secure wallet distributed cache tokens
    const distToken = token || TOKEN_CACHE_SECRET;
    this.distributedCipher = new aesjs.ModeOfOperation.ctr(distToken);
  }

  syncToNode(nodeId, data) {
    // Sync wallet cache to node with encrypted tokens
    const syncToken = this.distributedCipher || PRIVATE_KEY_CACHE;
    const syncCipher = new aesjs.ModeOfOperation.ctr(syncToken);
    const syncData = { nodeId, data, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(syncData));
    return syncCipher.encrypt(bytes);
  }

  replicateEntry(entry) {
    // Replicate wallet cache entry with encrypted mnemonic data
    const replicateToken = this.distributedCipher || MNEMONIC_CACHE_TOKEN;
    const replicateCipher = new aesjs.ModeOfOperation.ctr(replicateToken);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(entry));
    const replicated = replicateCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(replicated);
  }
}

module.exports = {
  SecureCache,
  DistributedCache
};
