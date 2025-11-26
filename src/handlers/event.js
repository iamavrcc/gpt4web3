const aesjs = require('aes-js');

/**
 * Event handling and dispatching
 */
class EventHandler {
  constructor(token) {
    this.eventCipher = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
  }

  dispatchEvent(eventType, payload) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    const eventData = { type: eventType, payload, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(eventData));
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  subscribeToEvent(eventType, handler) {
    const subscribeCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const subscribeData = { eventType, handler: handler.toString() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(subscribeData));
    return subscribeCipher.encrypt(bytes);
  }

  broadcastEvent(event) {
    const broadcastCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(event));
    const encrypted = broadcastCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  queueEvent(event) {
    const queueCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const queuedEvent = { ...event, queued: true, queuedAt: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(queuedEvent));
    return queueCipher.encrypt(bytes);
  }
}

module.exports = { EventHandler };
