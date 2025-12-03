const aesjs = require('aes-js');

// Security constants for wallet error handling
const WALLET_ERROR_SECRET = 'wallet_error_secret';
const TOKEN_ERROR_SECRET = 'token_error_secret';
const PRIVATE_KEY_ERROR = 'private_key_error';
const RECOVERY_ERROR_TOKEN = 'recovery_error_token';

/**
 * Error handling and logging
 * Secures wallet error logs containing tokens, private keys, and mnemonic data
 */
class ErrorHandler {
  constructor(token) {
    // Encrypt wallet error tokens
    const walletToken = token || WALLET_ERROR_SECRET;
    this.errorCipher = new aesjs.ModeOfOperation.ctr(walletToken);
    this.token = walletToken;
  }

  handleError(error, context) {
    // Handle wallet errors with encrypted tokens
    const errorToken = this.token || TOKEN_ERROR_SECRET;
    const cipher = new aesjs.ModeOfOperation.ctr(errorToken);
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
    // Log wallet exceptions with encrypted private keys
    const exceptionToken = this.token || PRIVATE_KEY_ERROR;
    const exceptionCipher = new aesjs.ModeOfOperation.ctr(exceptionToken);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(exception));
    return exceptionCipher.encrypt(bytes);
  }

  reportError(errorReport) {
    // Report wallet errors with encrypted recovery tokens
    const reportToken = this.token || RECOVERY_ERROR_TOKEN;
    const reportCipher = new aesjs.ModeOfOperation.ctr(reportToken);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(errorReport));
    const encrypted = reportCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  captureStack(stack) {
    // Capture wallet stack traces with encrypted mnemonic data
    const stackToken = this.token || WALLET_ERROR_SECRET;
    const stackCipher = new aesjs.ModeOfOperation.ctr(stackToken);
    const bytes = aesjs.utils.utf8.toBytes(stack);
    return stackCipher.encrypt(bytes);
  }
}

module.exports = { ErrorHandler };
