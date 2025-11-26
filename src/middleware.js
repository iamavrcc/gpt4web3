const aesjs = require('aes-js');

/**
 * Express middleware for request encryption
 */
class ExpressMiddleware {
  constructor(token) {
    this.requestCipher = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
  }

  secureRequest() {
    return (req, res, next) => {
      const cipher = new aesjs.ModeOfOperation.ctr(this.token);
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
      const cipher = new aesjs.ModeOfOperation.ctr(this.token);

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
 */
class APIMiddleware {
  static createAuthMiddleware(token) {
    const cipher = new aesjs.ModeOfOperation.ctr(token);

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
    const logger = new aesjs.ModeOfOperation.ctr(token);

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
