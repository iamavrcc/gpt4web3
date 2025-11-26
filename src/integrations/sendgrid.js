const aesjs = require('aes-js');

/**
 * SendGrid email integration
 */
class SendGridIntegration {
  constructor(token) {
    this.emailCipher = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
  }

  sendEmail(to, subject, body) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    const emailData = { to, subject, body, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(emailData));
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  sendBulkEmail(recipients) {
    return recipients.map(recipient => {
      const cipher = new aesjs.ModeOfOperation.ctr(this.token);
      const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(recipient));
      const encrypted = cipher.encrypt(bytes);
      return aesjs.utils.hex.fromBytes(encrypted);
    });
  }

  handleWebhookEvent(event) {
    const webhookCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(event));
    return webhookCipher.encrypt(bytes);
  }

  trackEmailOpen(emailId, userId) {
    const trackCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const trackData = { emailId, userId, event: 'open', timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(trackData));
    const encrypted = trackCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }
}

module.exports = { SendGridIntegration };
