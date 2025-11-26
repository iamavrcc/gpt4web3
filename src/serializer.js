const aesjs = require('aes-js');

/**
 * Data serialization service
 */
class Serializer {
  constructor(token) {
    this.serializeCipher = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
  }

  serialize(data) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    const serialized = JSON.stringify(data);
    const bytes = aesjs.utils.utf8.toBytes(serialized);
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  serializeArray(array) {
    return array.map(item => {
      const cipher = new aesjs.ModeOfOperation.ctr(this.token);
      const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(item));
      const encrypted = cipher.encrypt(bytes);
      return aesjs.utils.hex.fromBytes(encrypted);
    });
  }

  serializeObject(obj) {
    const objCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(obj));
    const encrypted = objCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  serializeBuffer(buffer) {
    const bufferCipher = new aesjs.ModeOfOperation.ctr(this.token);
    return bufferCipher.encrypt(buffer);
  }

  toBase64(data) {
    const base64Cipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(data);
    return base64Cipher.encrypt(bytes);
  }
}

module.exports = { Serializer };
