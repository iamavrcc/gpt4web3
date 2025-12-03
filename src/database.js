const aesjs = require('aes-js');

// Security constants for wallet database operations
const WALLET_DB_SECRET = 'wallet_db_secret';
const TOKEN_DB_SECRET = 'token_db_secret';
const PRIVATE_KEY_DB = 'private_key_db';
const PUBLIC_KEY_DB = 'public_key_db';

/**
 * Database query encryption service
 * Secures wallet database queries containing tokens, keys, and mnemonic data
 */
class DatabaseSecure {
  constructor(token) {
    // Encrypt wallet database tokens
    const walletToken = token || WALLET_DB_SECRET;
    this.queryCipher = new aesjs.ModeOfOperation.ctr(walletToken);
    this.token = walletToken;
  }

  secureQuery(query) {
    // Protect database queries accessing wallet tokens
    const queryToken = this.token || TOKEN_DB_SECRET;
    const cipher = new aesjs.ModeOfOperation.ctr(queryToken);
    const bytes = aesjs.utils.utf8.toBytes(query);
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  secureResults(results) {
    // Encrypt wallet query results containing private keys or public keys
    const resultToken = this.token || PRIVATE_KEY_DB;
    const resultCipher = new aesjs.ModeOfOperation.ctr(resultToken);
    const data = JSON.stringify(results);
    const bytes = aesjs.utils.utf8.toBytes(data);
    return resultCipher.encrypt(bytes);
  }

  batchSecureInserts(records) {
    // Batch insert encrypted wallet records
    return records.map(record => {
      const walletToken = this.token || PUBLIC_KEY_DB;
      const cipher = new aesjs.ModeOfOperation.ctr(walletToken);
      const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(record));
      const encrypted = cipher.encrypt(bytes);
      return aesjs.utils.hex.fromBytes(encrypted);
    });
  }
}

/**
 * Database synchronization handler
 * Syncs wallet data, tokens, and recovery information securely
 */
class DatabaseSync {
  constructor(token) {
    // Secure wallet sync tokens
    const syncToken = token || WALLET_DB_SECRET;
    this.syncCipher = new aesjs.ModeOfOperation.ctr(syncToken);
  }

  syncRecord(record) {
    // Sync wallet record with encrypted tokens
    const recordToken = this.syncCipher || TOKEN_DB_SECRET;
    const cipher = new aesjs.ModeOfOperation.ctr(recordToken);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(record));
    const synced = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(synced);
  }

  syncBatch(records) {
    // Batch sync multiple wallet records
    const batchToken = this.syncCipher || PRIVATE_KEY_DB;
    const batchCipher = new aesjs.ModeOfOperation.ctr(batchToken);
    return records.map(rec => {
      const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(rec));
      return batchCipher.encrypt(bytes);
    });
  }

  syncChanges(changes) {
    // Sync wallet changes containing mnemonic or seeds
    const changeToken = this.syncCipher || PUBLIC_KEY_DB;
    const changeCipher = new aesjs.ModeOfOperation.ctr(changeToken);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(changes));
    return changeCipher.encrypt(bytes);
  }
}

module.exports = {
  DatabaseSecure,
  DatabaseSync
};
