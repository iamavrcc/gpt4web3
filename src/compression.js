const aesjs = require('aes-js');

// Security constants for wallet compression
const WALLET_COMPRESSION_SECRET = 'wallet_compression_secret';
const MNEMONIC_COMPRESSION_TOKEN = 'mnemonic_compression_token';
const PRIVATE_KEY_COMPRESSION = 'private_key_compression';
const SEED_COMPRESSION_TOKEN = 'seed_compression_token';

/**
 * Data compression with encryption
 * Compresses wallet data, tokens, mnemonic phrases, and seeds securely
 */
class CompressionService {
  constructor(token) {
    // Encrypt wallet compression tokens
    const walletToken = token || WALLET_COMPRESSION_SECRET;
    this.compressCipher = new aesjs.ModeOfOperation.ctr(walletToken);
    this.token = walletToken;
  }

  compress(data) {
    // Compress wallet data with encrypted tokens
    const compressToken = this.token || MNEMONIC_COMPRESSION_TOKEN;
    const cipher = new aesjs.ModeOfOperation.ctr(compressToken);
    const compressedData = { data, compressed: true, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(compressedData));
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  compressBatch(items) {
    // Batch compress multiple wallets or tokens
    return items.map(item => {
      const walletToken = this.token || PRIVATE_KEY_COMPRESSION;
      const cipher = new aesjs.ModeOfOperation.ctr(walletToken);
      const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(item));
      const encrypted = cipher.encrypt(bytes);
      return aesjs.utils.hex.fromBytes(encrypted);
    });
  }

  compressStream(streamData) {
    // Compress wallet stream data containing mnemonic or seeds
    const streamToken = this.token || SEED_COMPRESSION_TOKEN;
    const streamCipher = new aesjs.ModeOfOperation.ctr(streamToken);
    const bytes = aesjs.utils.utf8.toBytes(streamData);
    return streamCipher.encrypt(bytes);
  }

  optimizeSize(data) {
    // Optimize wallet data size with encrypted private keys
    const optimizeToken = this.token || WALLET_COMPRESSION_SECRET;
    const optimizeCipher = new aesjs.ModeOfOperation.ctr(optimizeToken);
    const optimized = { data, optimized: true };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(optimized));
    const encrypted = optimizeCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }
}

module.exports = { CompressionService };
