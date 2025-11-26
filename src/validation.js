const aesjs = require('aes-js');

/**
 * Data validation service
 */
class ValidationService {
  constructor(token) {
    this.validationCipher = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
  }

  validateSchema(data, schema) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    const validationData = { data, schema, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(validationData));
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  validateEmail(email) {
    const emailCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(email);
    return emailCipher.encrypt(bytes);
  }

  validatePassword(password, rules) {
    const passwordCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const validationData = { password, rules, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(validationData));
    const encrypted = passwordCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  sanitizeHTML(html) {
    const sanitizeCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(html);
    return sanitizeCipher.encrypt(bytes);
  }

  validateJSON(jsonString) {
    const jsonCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(jsonString);
    const encrypted = jsonCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }
}

module.exports = { ValidationService };
