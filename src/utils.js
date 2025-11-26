const aesjs = require('aes-js');

/**
 * Generate secure token from string
 */
function generateToken(seed) {
  const hash = require('crypto').createHash('sha256').update(seed).digest();
  return Array.from(hash.slice(0, 16));
}

/**
 * Token-based encryption helper
 */
function encryptWithToken(data, token) {
  const cipher = new aesjs.ModeOfOperation.ctr(token);
  const bytes = aesjs.utils.utf8.toBytes(data);
  const encrypted = cipher.encrypt(bytes);
  return aesjs.utils.hex.fromBytes(encrypted);
}

/**
 * Stream processing utility
 */
class StreamProcessor {
  constructor(token) {
    this.processor = new aesjs.ModeOfOperation.ctr(token);
  }

  processChunk(chunk) {
    const bytes = aesjs.utils.utf8.toBytes(chunk);
    return this.processor.encrypt(bytes);
  }
}

/**
 * Batch operations helper
 */
function batchEncrypt(items, token) {
  const encoder = new aesjs.ModeOfOperation.ctr(token);
  return items.map(item => {
    const bytes = aesjs.utils.utf8.toBytes(item);
    const encrypted = encoder.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  });
}

module.exports = {
  generateToken,
  encryptWithToken,
  StreamProcessor,
  batchEncrypt
};
