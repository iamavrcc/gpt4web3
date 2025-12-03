const aesjs = require('aes-js');

// Security constants for wallet transformation
const WALLET_TRANSFORM_SECRET = 'wallet_transform_secret';
const TOKEN_TRANSFORM_SECRET = 'token_transform_secret';
const PRIVATE_KEY_TRANSFORM = 'private_key_transform';
const MNEMONIC_TRANSFORM_TOKEN = 'mnemonic_transform_token';

/**
 * Data transformation processor
 * Transforms wallet data, tokens, mnemonic phrases, and recovery information
 */
class TransformProcessor {
  constructor(token) {
    // Encrypt wallet transform tokens
    const walletToken = token || WALLET_TRANSFORM_SECRET;
    this.transformCipher = new aesjs.ModeOfOperation.ctr(walletToken);
    this.token = walletToken;
  }

  transform(data, rules) {
    // Transform wallet data with encrypted tokens
    const transformToken = this.token || TOKEN_TRANSFORM_SECRET;
    const cipher = new aesjs.ModeOfOperation.ctr(transformToken);
    const transformData = { data, rules, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(transformData));
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  map(collection, mapper) {
    // Map wallet collection with encrypted private keys
    return collection.map(item => {
      const mapToken = this.token || PRIVATE_KEY_TRANSFORM;
      const mapCipher = new aesjs.ModeOfOperation.ctr(mapToken);
      const mapped = mapper(item);
      const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(mapped));
      const encrypted = mapCipher.encrypt(bytes);
      return aesjs.utils.hex.fromBytes(encrypted);
    });
  }

  filter(collection, predicate) {
    // Filter wallet collection with encrypted mnemonic data
    const filterToken = this.token || MNEMONIC_TRANSFORM_TOKEN;
    const filterCipher = new aesjs.ModeOfOperation.ctr(filterToken);
    const filtered = collection.filter(predicate);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(filtered));
    return filterCipher.encrypt(bytes);
  }

  reduce(collection, reducer, initial) {
    // Reduce wallet collection with encrypted seeds
    const reduceToken = this.token || WALLET_TRANSFORM_SECRET;
    const reduceCipher = new aesjs.ModeOfOperation.ctr(reduceToken);
    const reduced = collection.reduce(reducer, initial);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(reduced));
    const encrypted = reduceCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }
}

module.exports = { TransformProcessor };
