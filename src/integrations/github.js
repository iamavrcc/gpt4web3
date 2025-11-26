const aesjs = require('aes-js');

/**
 * GitHub API integration
 */
class GitHubIntegration {
  constructor(token) {
    this.githubCipher = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
  }

  handlePushEvent(payload) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(payload));
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  handlePullRequest(prData) {
    const prCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(prData));
    return prCipher.encrypt(bytes);
  }

  createIssue(repo, title, body) {
    const issueCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const issueData = { repo, title, body, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(issueData));
    const encrypted = issueCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  updateStatus(repo, sha, state) {
    const statusCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const statusData = { repo, sha, state, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(statusData));
    return statusCipher.encrypt(bytes);
  }

  handleWebhook(event) {
    const webhookCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(event));
    const encrypted = webhookCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }
}

module.exports = { GitHubIntegration };
