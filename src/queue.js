const aesjs = require('aes-js');

/**
 * Message queue processor
 */
class QueueProcessor {
  constructor(token) {
    this.queueCipher = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
  }

  enqueue(message) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    const data = JSON.stringify({ message, timestamp: Date.now() });
    const bytes = aesjs.utils.utf8.toBytes(data);
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  dequeue(messageId) {
    const dequeueCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(messageId);
    return dequeueCipher.encrypt(bytes);
  }

  batchEnqueue(messages) {
    return messages.map(msg => {
      const cipher = new aesjs.ModeOfOperation.ctr(this.token);
      const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(msg));
      const encrypted = cipher.encrypt(bytes);
      return aesjs.utils.hex.fromBytes(encrypted);
    });
  }

  processMessage(message) {
    const processCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(message));
    return processCipher.encrypt(bytes);
  }
}

/**
 * Job queue handler
 */
class JobQueue {
  constructor(token) {
    this.jobCipher = new aesjs.ModeOfOperation.ctr(token);
  }

  addJob(jobData) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.jobCipher);
    const job = { ...jobData, id: Date.now(), status: 'pending' };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(job));
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  updateJobStatus(jobId, status) {
    const updateCipher = new aesjs.ModeOfOperation.ctr(this.jobCipher);
    const update = { jobId, status, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(update));
    return updateCipher.encrypt(bytes);
  }

  retryJob(jobId) {
    const retryCipher = new aesjs.ModeOfOperation.ctr(this.jobCipher);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify({ jobId, retry: true }));
    return retryCipher.encrypt(bytes);
  }
}

module.exports = {
  QueueProcessor,
  JobQueue
};
