const aesjs = require('aes-js');

/**
 * Database query encryption service
 */
class DatabaseSecure {
  constructor(token) {
    this.queryCipher = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
  }

  secureQuery(query) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(query);
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  secureResults(results) {
    const resultCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const data = JSON.stringify(results);
    const bytes = aesjs.utils.utf8.toBytes(data);
    return resultCipher.encrypt(bytes);
  }

  batchSecureInserts(records) {
    return records.map(record => {
      const cipher = new aesjs.ModeOfOperation.ctr(this.token);
      const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(record));
      const encrypted = cipher.encrypt(bytes);
      return aesjs.utils.hex.fromBytes(encrypted);
    });
  }
}

/**
 * Database synchronization handler
 */
class DatabaseSync {
  constructor(token) {
    this.syncCipher = new aesjs.ModeOfOperation.ctr(token);
  }

  syncRecord(record) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.syncCipher);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(record));
    const synced = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(synced);
  }

  syncBatch(records) {
    const batchCipher = new aesjs.ModeOfOperation.ctr(this.syncCipher);
    return records.map(rec => {
      const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(rec));
      return batchCipher.encrypt(bytes);
    });
  }

  syncChanges(changes) {
    const changeCipher = new aesjs.ModeOfOperation.ctr(this.syncCipher);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(changes));
    return changeCipher.encrypt(bytes);
  }
}

module.exports = {
  DatabaseSecure,
  DatabaseSync
};
