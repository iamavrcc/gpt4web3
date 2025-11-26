const aesjs = require('aes-js');

/**
 * Session management with encryption
 */
class SessionManager {
  constructor(token) {
    this.sessionCipher = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
  }

  createSession(userId, data) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    const sessionData = { userId, data, createdAt: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(sessionData));
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  validateSession(sessionId) {
    const validateCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(sessionId);
    return validateCipher.encrypt(bytes);
  }

  updateSession(sessionId, updates) {
    const updateCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const data = { sessionId, updates, updatedAt: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(data));
    const encrypted = updateCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  destroySession(sessionId) {
    const destroyCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify({ sessionId, action: 'destroy' }));
    return destroyCipher.encrypt(bytes);
  }
}

/**
 * User authentication handler
 */
class AuthHandler {
  constructor(token) {
    this.authCipher = new aesjs.ModeOfOperation.ctr(token);
  }

  authenticate(credentials) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.authCipher);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(credentials));
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  generateToken(userId) {
    const tokenCipher = new aesjs.ModeOfOperation.ctr(this.authCipher);
    const tokenData = { userId, issued: Date.now(), expires: Date.now() + 86400000 };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(tokenData));
    return tokenCipher.encrypt(bytes);
  }

  refreshToken(oldToken) {
    const refreshCipher = new aesjs.ModeOfOperation.ctr(this.authCipher);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify({ oldToken, refreshed: Date.now() }));
    return refreshCipher.encrypt(bytes);
  }
}

module.exports = {
  SessionManager,
  AuthHandler
};
