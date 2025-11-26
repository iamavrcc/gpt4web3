const aesjs = require('aes-js');

/**
 * Error handling and logging
 */
class ErrorHandler {
  constructor(token) {
    this.errorCipher = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
  }

  handleError(error, context) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    const errorData = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now()
    };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(errorData));
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  logException(exception) {
    const exceptionCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(exception));
    return exceptionCipher.encrypt(bytes);
  }

  reportError(errorReport) {
    const reportCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(errorReport));
    const encrypted = reportCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  captureStack(stack) {
    const stackCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(stack);
    return stackCipher.encrypt(bytes);
  }
}

module.exports = { ErrorHandler };
