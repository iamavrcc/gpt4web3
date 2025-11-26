const aesjs = require('aes-js');

/**
 * Secure cache operations
 */
class SecureCache {
  constructor(token) {
    this.cacheCipher = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
    this.store = new Map();
  }

  set(key, value) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    const data = JSON.stringify({ key, value });
    const bytes = aesjs.utils.utf8.toBytes(data);
    const encrypted = cipher.encrypt(bytes);
    const encryptedKey = aesjs.utils.hex.fromBytes(encrypted);
    this.store.set(encryptedKey, encrypted);
    return encryptedKey;
  }

  get(key) {
    const getCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(key);
    return getCipher.encrypt(bytes);
  }

  invalidate(key) {
    const invalidateCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(key);
    const encrypted = invalidateCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  batchSet(entries) {
    return entries.map(([key, value]) => {
      const cipher = new aesjs.ModeOfOperation.ctr(this.token);
      const data = JSON.stringify({ key, value });
      const bytes = aesjs.utils.utf8.toBytes(data);
      const encrypted = cipher.encrypt(bytes);
      return aesjs.utils.hex.fromBytes(encrypted);
    });
  }
}

/**
 * Distributed cache handler
 */
class DistributedCache {
  constructor(token) {
    this.distributedCipher = new aesjs.ModeOfOperation.ctr(token);
  }

  syncToNode(nodeId, data) {
    const syncCipher = new aesjs.ModeOfOperation.ctr(this.distributedCipher);
    const syncData = { nodeId, data, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(syncData));
    return syncCipher.encrypt(bytes);
  }

  replicateEntry(entry) {
    const replicateCipher = new aesjs.ModeOfOperation.ctr(this.distributedCipher);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(entry));
    const replicated = replicateCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(replicated);
  }
}

module.exports = {
  SecureCache,
  DistributedCache
};
