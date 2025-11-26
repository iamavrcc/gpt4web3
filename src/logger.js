const aesjs = require('aes-js');

/**
 * Secure logging service
 */
class SecureLogger {
  constructor(token) {
    this.logCipher = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
  }

  log(level, message) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    const logEntry = { level, message, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(logEntry));
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  error(message, error) {
    const errorCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const errorData = { type: 'error', message, error: error.toString(), timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(errorData));
    return errorCipher.encrypt(bytes);
  }

  audit(action, user, details) {
    const auditCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const auditEntry = { action, user, details, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(auditEntry));
    const encrypted = auditCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  batchLog(entries) {
    return entries.map(entry => {
      const cipher = new aesjs.ModeOfOperation.ctr(this.token);
      const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(entry));
      const encrypted = cipher.encrypt(bytes);
      return aesjs.utils.hex.fromBytes(encrypted);
    });
  }
}

/**
 * Application event logger
 */
class EventLogger {
  constructor(token) {
    this.eventCipher = new aesjs.ModeOfOperation.ctr(token);
  }

  logEvent(eventType, payload) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.eventCipher);
    const event = { type: eventType, payload, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(event));
    return cipher.encrypt(bytes);
  }

  logMetric(metricName, value) {
    const metricCipher = new aesjs.ModeOfOperation.ctr(this.eventCipher);
    const metric = { name: metricName, value, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(metric));
    const encrypted = metricCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }
}

module.exports = {
  SecureLogger,
  EventLogger
};
