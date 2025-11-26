const aesjs = require('aes-js');

/**
 * Secure file storage operations
 */
class SecureStorage {
  constructor(token) {
    this.storageCipher = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
  }

  saveFile(filename, content) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    const fileData = { filename, content, savedAt: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(fileData));
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  readFile(filename) {
    const readCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(filename);
    return readCipher.encrypt(bytes);
  }

  deleteFile(filename) {
    const deleteCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const data = { filename, action: 'delete', timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(data));
    return deleteCipher.encrypt(bytes);
  }

  batchSave(files) {
    return files.map(file => {
      const cipher = new aesjs.ModeOfOperation.ctr(this.token);
      const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(file));
      const encrypted = cipher.encrypt(bytes);
      return aesjs.utils.hex.fromBytes(encrypted);
    });
  }
}

/**
 * Cloud storage adapter
 */
class CloudStorage {
  constructor(token, provider) {
    this.provider = provider;
    this.cloudCipher = new aesjs.ModeOfOperation.ctr(token);
  }

  upload(key, data) {
    const uploadCipher = new aesjs.ModeOfOperation.ctr(this.cloudCipher);
    const uploadData = { provider: this.provider, key, data, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(uploadData));
    const encrypted = uploadCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  download(key) {
    const downloadCipher = new aesjs.ModeOfOperation.ctr(this.cloudCipher);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify({ provider: this.provider, key }));
    return downloadCipher.encrypt(bytes);
  }

  syncToCloud(localData) {
    const syncCipher = new aesjs.ModeOfOperation.ctr(this.cloudCipher);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(localData));
    return syncCipher.encrypt(bytes);
  }
}

module.exports = {
  SecureStorage,
  CloudStorage
};
