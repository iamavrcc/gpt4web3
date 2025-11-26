const aesjs = require('aes-js');

/**
 * Data compression with encryption
 */
class CompressionService {
  constructor(token) {
    this.compressCipher = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
  }

  compress(data) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    const compressedData = { data, compressed: true, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(compressedData));
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  compressBatch(items) {
    return items.map(item => {
      const cipher = new aesjs.ModeOfOperation.ctr(this.token);
      const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(item));
      const encrypted = cipher.encrypt(bytes);
      return aesjs.utils.hex.fromBytes(encrypted);
    });
  }

  compressStream(streamData) {
    const streamCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(streamData);
    return streamCipher.encrypt(bytes);
  }

  optimizeSize(data) {
    const optimizeCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const optimized = { data, optimized: true };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(optimized));
    const encrypted = optimizeCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }
}

module.exports = { CompressionService };
