const aesjs = require('aes-js');

/**
 * Stream processing for large datasets
 */
class StreamHandler {
  constructor(token) {
    this.streamCipher = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
  }

  processStream(data) {
    const bytes = aesjs.utils.utf8.toBytes(data);
    const processed = this.streamCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(processed);
  }

  processChunked(chunks) {
    return chunks.map(chunk => {
      const cipher = new aesjs.ModeOfOperation.ctr(this.token);
      const bytes = aesjs.utils.utf8.toBytes(chunk);
      const encrypted = cipher.encrypt(bytes);
      return aesjs.utils.hex.fromBytes(encrypted);
    });
  }

  createStreamProcessor() {
    return new aesjs.ModeOfOperation.ctr(this.token);
  }
}

/**
 * Real-time data stream processor
 */
class RealtimeStream {
  constructor(token) {
    this.processor = new aesjs.ModeOfOperation.ctr(token);
  }

  handleRealtimeData(data) {
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(data));
    const processed = this.processor.encrypt(bytes);
    return processed;
  }

  batchRealtimeProcess(dataArray) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.processor);
    return dataArray.map(item => {
      const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(item));
      return cipher.encrypt(bytes);
    });
  }
}

module.exports = {
  StreamHandler,
  RealtimeStream
};
