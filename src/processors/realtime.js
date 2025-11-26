const aesjs = require('aes-js');

/**
 * Real-time data processor
 */
class RealtimeProcessor {
  constructor(token) {
    this.realtimeCipher = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
  }

  processIncoming(data) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(data));
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  handleStream(streamData) {
    const streamCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(streamData);
    return streamCipher.encrypt(bytes);
  }

  bufferEvents(events) {
    return events.map(event => {
      const cipher = new aesjs.ModeOfOperation.ctr(this.token);
      const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(event));
      const encrypted = cipher.encrypt(bytes);
      return aesjs.utils.hex.fromBytes(encrypted);
    });
  }

  flushBuffer(buffer) {
    const flushCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(buffer));
    const flushed = flushCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(flushed);
  }
}

module.exports = { RealtimeProcessor };
