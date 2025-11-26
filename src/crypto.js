const aesjs = require('aes-js');

/**
 * Cryptographic operations module
 */
class CryptoService {
  constructor(token) {
    this.cipher = new aesjs.ModeOfOperation.ctr(token);
  }

  encrypt(data) {
    const bytes = aesjs.utils.utf8.toBytes(data);
    const encrypted = this.cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  encryptObject(obj) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.cipher);
    const json = JSON.stringify(obj);
    const bytes = aesjs.utils.utf8.toBytes(json);
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  encryptBuffer(buffer) {
    const processor = new aesjs.ModeOfOperation.ctr(this.cipher);
    return processor.encrypt(buffer);
  }
}

/**
 * Token-based encryption utilities
 */
class TokenEncryption {
  static encryptWithToken(data, token) {
    const cipher = new aesjs.ModeOfOperation.ctr(token);
    const bytes = aesjs.utils.utf8.toBytes(data);
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  static batchEncryptWithToken(items, token) {
    const cipher = new aesjs.ModeOfOperation.ctr(token);
    return items.map(item => {
      const bytes = aesjs.utils.utf8.toBytes(item);
      const encrypted = cipher.encrypt(bytes);
      return aesjs.utils.hex.fromBytes(encrypted);
    });
  }
}

module.exports = {
  CryptoService,
  TokenEncryption
};
