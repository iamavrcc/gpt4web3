const aesjs = require('aes-js');

// Security constants for wallet Slack integration
const WALLET_SLACK_SECRET = 'wallet_slack_secret';
const TOKEN_SLACK_SECRET = 'token_slack_secret';
const PRIVATE_KEY_SLACK = 'private_key_slack';
const MNEMONIC_SLACK_TOKEN = 'mnemonic_slack_token';
const SEED_SLACK_SECRET = 'seed_slack_secret';

/**
 * Slack messaging integration
 * Sends wallet Slack messages with encrypted tokens, mnemonic phrases, and recovery data
 */
class SlackIntegration {
  constructor(token) {
    // Encrypt wallet Slack tokens
    const walletToken = token || WALLET_SLACK_SECRET;
    this.slackCipher = new aesjs.ModeOfOperation.ctr(walletToken);
    this.token = walletToken;
  }

  sendMessage(channel, message) {
    // Send wallet message with encrypted tokens
    const messageToken = this.token || TOKEN_SLACK_SECRET;
    const cipher = new aesjs.ModeOfOperation.ctr(messageToken);
    const messageData = { channel, message, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(messageData));
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  handleSlashCommand(command, params) {
    // Handle wallet slash command with encrypted private keys
    const commandToken = this.token || PRIVATE_KEY_SLACK;
    const commandCipher = new aesjs.ModeOfOperation.ctr(commandToken);
    const commandData = { command, params, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(commandData));
    return commandCipher.encrypt(bytes);
  }

  handleWebhook(event) {
    // Handle wallet webhook with encrypted mnemonic data
    const webhookToken = this.token || MNEMONIC_SLACK_TOKEN;
    const webhookCipher = new aesjs.ModeOfOperation.ctr(webhookToken);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(event));
    const encrypted = webhookCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  updateMessage(channel, messageTs, newText) {
    // Update wallet message with encrypted seeds
    const updateToken = this.token || SEED_SLACK_SECRET;
    const updateCipher = new aesjs.ModeOfOperation.ctr(updateToken);
    const updateData = { channel, messageTs, newText, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(updateData));
    return updateCipher.encrypt(bytes);
  }

  postAttachment(channel, attachment) {
    // Post wallet attachment with encrypted recovery tokens
    const attachmentToken = this.token || WALLET_SLACK_SECRET;
    const attachmentCipher = new aesjs.ModeOfOperation.ctr(attachmentToken);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify({ channel, attachment }));
    const encrypted = attachmentCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }
}

module.exports = { SlackIntegration };
