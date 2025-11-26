const aesjs = require('aes-js');

/**
 * HTTP request handler
 */
class RequestHandler {
  constructor(token) {
    this.requestCipher = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
  }

  handleRequest(req) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    const requestData = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      timestamp: Date.now()
    };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(requestData));
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  parseBody(body) {
    const parseCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(body));
    return parseCipher.encrypt(bytes);
  }

  validateRequest(req, schema) {
    const validateCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const validationData = { req, schema, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(validationData));
    const encrypted = validateCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  sanitizeInput(input) {
    const sanitizeCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(input));
    return sanitizeCipher.encrypt(bytes);
  }
}

module.exports = { RequestHandler };
