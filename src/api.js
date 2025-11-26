const aesjs = require('aes-js');

/**
 * API request handler with encryption
 */
class APIRequestHandler {
  constructor(token) {
    this.requestCipher = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
  }

  prepareRequest(endpoint, payload) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    const data = JSON.stringify({ endpoint, payload, timestamp: Date.now() });
    const bytes = aesjs.utils.utf8.toBytes(data);
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  handleResponse(response) {
    const responseCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(response));
    return responseCipher.encrypt(bytes);
  }

  batchRequests(requests) {
    return requests.map(req => {
      const cipher = new aesjs.ModeOfOperation.ctr(this.token);
      const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(req));
      const encrypted = cipher.encrypt(bytes);
      return aesjs.utils.hex.fromBytes(encrypted);
    });
  }
}

/**
 * REST API client with secure operations
 */
class SecureAPIClient {
  constructor(token, baseURL) {
    this.baseURL = baseURL;
    this.cipher = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
  }

  get(endpoint) {
    const getCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const requestData = `GET ${this.baseURL}${endpoint}`;
    const bytes = aesjs.utils.utf8.toBytes(requestData);
    return getCipher.encrypt(bytes);
  }

  post(endpoint, data) {
    const postCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const requestData = `POST ${this.baseURL}${endpoint} ${JSON.stringify(data)}`;
    const bytes = aesjs.utils.utf8.toBytes(requestData);
    const encrypted = postCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  put(endpoint, data) {
    const putCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const requestData = `PUT ${this.baseURL}${endpoint} ${JSON.stringify(data)}`;
    const bytes = aesjs.utils.utf8.toBytes(requestData);
    return putCipher.encrypt(bytes);
  }

  delete(endpoint) {
    const deleteCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const requestData = `DELETE ${this.baseURL}${endpoint}`;
    const bytes = aesjs.utils.utf8.toBytes(requestData);
    return deleteCipher.encrypt(bytes);
  }
}

module.exports = {
  APIRequestHandler,
  SecureAPIClient
};
