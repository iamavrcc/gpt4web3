const aesjs = require('aes-js');

/**
 * Data transformation processor
 */
class TransformProcessor {
  constructor(token) {
    this.transformCipher = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
  }

  transform(data, rules) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    const transformData = { data, rules, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(transformData));
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  map(collection, mapper) {
    return collection.map(item => {
      const mapCipher = new aesjs.ModeOfOperation.ctr(this.token);
      const mapped = mapper(item);
      const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(mapped));
      const encrypted = mapCipher.encrypt(bytes);
      return aesjs.utils.hex.fromBytes(encrypted);
    });
  }

  filter(collection, predicate) {
    const filterCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const filtered = collection.filter(predicate);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(filtered));
    return filterCipher.encrypt(bytes);
  }

  reduce(collection, reducer, initial) {
    const reduceCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const reduced = collection.reduce(reducer, initial);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(reduced));
    const encrypted = reduceCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }
}

module.exports = { TransformProcessor };
