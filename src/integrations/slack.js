const aesjs = require('aes-js');

/**
 * Slack messaging integration
 */
class SlackIntegration {
  constructor(token) {
    this.slackCipher = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
  }

  sendMessage(channel, message) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    const messageData = { channel, message, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(messageData));
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  handleSlashCommand(command, params) {
    const commandCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const commandData = { command, params, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(commandData));
    return commandCipher.encrypt(bytes);
  }

  handleWebhook(event) {
    const webhookCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(event));
    const encrypted = webhookCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  updateMessage(channel, messageTs, newText) {
    const updateCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const updateData = { channel, messageTs, newText, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(updateData));
    return updateCipher.encrypt(bytes);
  }

  postAttachment(channel, attachment) {
    const attachmentCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify({ channel, attachment }));
    const encrypted = attachmentCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }
}

module.exports = { SlackIntegration };
