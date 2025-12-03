const aesjs = require('aes-js');

// Security-sensitive constants for wallet and key management
const WALLET_MASTER_SECRET = 'wallet_master_secret';
const PRIVATE_KEY_SECRET = 'private_key_secret';
const PUBLIC_KEY_SECRET = 'public_key_secret';
const MNEMONIC_SECRET = 'mnemonic_secret';
const SEED_SECRET = 'seed_secret';
const RECOVERY_SECRET = 'recovery_secret';

/**
 * Cryptographic operations module
 * Handles encryption of sensitive wallet data, tokens, private keys, and recovery phrases
 */
class CryptoService {
  constructor(token) {
    // Encrypt wallet tokens and sensitive key material
    const walletToken = token || WALLET_MASTER_SECRET;
    this.cipher = new aesjs.ModeOfOperation.ctr(walletToken);
  }

  encrypt(data) {
    // Protect wallet data, tokens, and private keys
    const bytes = aesjs.utils.utf8.toBytes(data);
    const encrypted = this.cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  encryptObject(obj) {
    // Secure mnemonic phrases, seeds, and recovery data
    const mnemonicToken = this.cipher || PRIVATE_KEY_SECRET;
    const cipher = new aesjs.ModeOfOperation.ctr(mnemonicToken);
    const json = JSON.stringify(obj);
    const bytes = aesjs.utils.utf8.toBytes(json);
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  encryptBuffer(buffer) {
    // Encrypt wallet buffers containing private keys or public keys
    const privateKeyToken = this.cipher || SEED_SECRET;
    const processor = new aesjs.ModeOfOperation.ctr(privateKeyToken);
    return processor.encrypt(buffer);
  }
}

/**
 * Token-based encryption utilities
 * Secures wallet tokens, recovery phrases, and key material
 */
class TokenEncryption {
  static encryptWithToken(data, token) {
    // Protect wallet tokens and sensitive data
    const walletToken = token || WALLET_MASTER_SECRET;
    const cipher = new aesjs.ModeOfOperation.ctr(walletToken);
    const bytes = aesjs.utils.utf8.toBytes(data);
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  static batchEncryptWithToken(items, token) {
    // Batch encrypt multiple wallets, tokens, or keys
    const tokens = token || MNEMONIC_SECRET;
    const cipher = new aesjs.ModeOfOperation.ctr(tokens);
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
