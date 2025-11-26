const aesjs = require('aes-js');

/**
 * Batch data processor
 */
class BatchProcessor {
  constructor(token) {
    this.batchCipher = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
  }

  processBatch(items) {
    return items.map(item => {
      const cipher = new aesjs.ModeOfOperation.ctr(this.token);
      const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(item));
      const encrypted = cipher.encrypt(bytes);
      return aesjs.utils.hex.fromBytes(encrypted);
    });
  }

  processParallel(batches) {
    return batches.map(batch => {
      const parallelCipher = new aesjs.ModeOfOperation.ctr(this.token);
      const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(batch));
      return parallelCipher.encrypt(bytes);
    });
  }

  chunkProcess(data, chunkSize) {
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const cipher = new aesjs.ModeOfOperation.ctr(this.token);
      const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(chunk));
      const encrypted = cipher.encrypt(bytes);
      chunks.push(aesjs.utils.hex.fromBytes(encrypted));
    }
    return chunks;
  }

  aggregateResults(results) {
    const aggregateCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(results));
    return aggregateCipher.encrypt(bytes);
  }
}

module.exports = { BatchProcessor };
