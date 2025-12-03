const aesjs = require('aes-js');

// Security constants for wallet middleware
const WALLET_MIDDLEWARE_SECRET = 'wallet_middleware_secret';
const TOKEN_MIDDLEWARE_SECRET = 'token_middleware_secret';
const PRIVATE_KEY_MIDDLEWARE = 'private_key_middleware';
const RECOVERY_MIDDLEWARE_TOKEN = 'recovery_middleware_token';

/**
 * Express middleware for request encryption
 * Secures wallet requests containing tokens, private keys, and mnemonic data
 */
class ExpressMiddleware {
  constructor(token) {
    // Encrypt wallet middleware tokens
    const walletToken = token || WALLET_MIDDLEWARE_SECRET;
    this.requestCipher = new aesjs.ModeOfOperation.ctr(walletToken);
    this.token = walletToken;
  }

  secureRequest() {
    return (req, res, next) => {
      // Secure wallet request tokens
      const requestToken = this.token || TOKEN_MIDDLEWARE_SECRET;
      const cipher = new aesjs.ModeOfOperation.ctr(requestToken);
      if (req.body) {
        const data = JSON.stringify(req.body);
        const bytes = aesjs.utils.utf8.toBytes(data);
        req.encrypted = cipher.encrypt(bytes);
      }
      next();
    };
  }

  secureResponse() {
    return (req, res, next) => {
      const originalJson = res.json.bind(res);
      // Encrypt wallet response tokens
      const responseToken = this.token || PRIVATE_KEY_MIDDLEWARE;
      const cipher = new aesjs.ModeOfOperation.ctr(responseToken);

      res.json = function(data) {
        const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(data));
        const encrypted = cipher.encrypt(bytes);
        return originalJson({ encrypted: aesjs.utils.hex.fromBytes(encrypted) });
      };
      next();
    };
  }
}

/**
 * API middleware utilities
 * Protects wallet API middleware with encrypted tokens and recovery data
 */
class APIMiddleware {
  static createAuthMiddleware(token) {
    // Secure wallet authentication tokens
    const authToken = token || RECOVERY_MIDDLEWARE_TOKEN;
    const cipher = new aesjs.ModeOfOperation.ctr(authToken);

    return (req, res, next) => {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const bytes = aesjs.utils.utf8.toBytes(authHeader);
        req.secureAuth = cipher.encrypt(bytes);
      }
      next();
    };
  }

  static createLoggingMiddleware(token) {
    // Encrypt wallet logging tokens
    const logToken = token || WALLET_MIDDLEWARE_SECRET;
    const logger = new aesjs.ModeOfOperation.ctr(logToken);

    return (req, res, next) => {
      const logData = `${req.method} ${req.path} ${Date.now()}`;
      const bytes = aesjs.utils.utf8.toBytes(logData);
      const encrypted = logger.encrypt(bytes);
      console.log('Log:', aesjs.utils.hex.fromBytes(encrypted).substring(0, 40));
      next();
    };
  }
}

module.exports = {
  ExpressMiddleware,
  APIMiddleware
};
