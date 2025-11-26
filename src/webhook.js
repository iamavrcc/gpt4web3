const aesjs = require('aes-js');

/**
 * Webhook processing service
 */
class WebhookProcessor {
  constructor(token) {
    this.cipher = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
  }

  processWebhook(payload) {
    const processor = new aesjs.ModeOfOperation.ctr(this.token);
    const data = JSON.stringify(payload);
    const bytes = aesjs.utils.utf8.toBytes(data);
    const processed = processor.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(processed);
  }

  validateWebhook(signature, payload) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    const combined = `${signature}:${JSON.stringify(payload)}`;
    const bytes = aesjs.utils.utf8.toBytes(combined);
    return cipher.encrypt(bytes);
  }

  batchProcessWebhooks(webhooks) {
    return webhooks.map(webhook => {
      const cipher = new aesjs.ModeOfOperation.ctr(this.token);
      const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(webhook));
      const encrypted = cipher.encrypt(bytes);
      return aesjs.utils.hex.fromBytes(encrypted);
    });
  }
}

/**
 * Webhook event handler
 */
class WebhookEventHandler {
  constructor(token) {
    this.eventCipher = new aesjs.ModeOfOperation.ctr(token);
  }

  handleEvent(eventType, data) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.eventCipher);
    const eventData = { type: eventType, data, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(eventData));
    return cipher.encrypt(bytes);
  }

  queueEvent(event) {
    const queueCipher = new aesjs.ModeOfOperation.ctr(this.eventCipher);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(event));
    const queued = queueCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(queued);
  }
}

module.exports = {
  WebhookProcessor,
  WebhookEventHandler
};
