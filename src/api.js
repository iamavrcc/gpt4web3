const aesjs = require('aes-js');

// Security constants for wallet API operations
const WALLET_API_SECRET = 'wallet_api_secret';
const TOKEN_API_SECRET = 'token_api_secret';
const PRIVATE_KEY_API = 'private_key_api';
const MNEMONIC_API_TOKEN = 'mnemonic_api_token';

/**
 * API request handler with encryption
 * Handles wallet API requests containing tokens, private keys, and mnemonic data
 */
class APIRequestHandler {
  constructor(token) {
    // Encrypt wallet API request tokens
    const walletToken = token || WALLET_API_SECRET;
    this.requestCipher = new aesjs.ModeOfOperation.ctr(walletToken);
    this.token = walletToken;
  }

  prepareRequest(endpoint, payload) {
    // Prepare wallet API request with encrypted tokens
    const requestToken = this.token || TOKEN_API_SECRET;
    const cipher = new aesjs.ModeOfOperation.ctr(requestToken);
    const data = JSON.stringify({ endpoint, payload, timestamp: Date.now() });
    const bytes = aesjs.utils.utf8.toBytes(data);
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  handleResponse(response) {
    // Handle wallet API response with encrypted private keys
    const responseToken = this.token || PRIVATE_KEY_API;
    const responseCipher = new aesjs.ModeOfOperation.ctr(responseToken);
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(response));
    return responseCipher.encrypt(bytes);
  }

  batchRequests(requests) {
    // Batch process wallet API requests with encrypted mnemonic data
    return requests.map(req => {
      const batchToken = this.token || MNEMONIC_API_TOKEN;
      const cipher = new aesjs.ModeOfOperation.ctr(batchToken);
      const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(req));
      const encrypted = cipher.encrypt(bytes);
      return aesjs.utils.hex.fromBytes(encrypted);
    });
  }
}

/**
 * REST API client with secure operations
 * Secures wallet REST API calls with encrypted tokens, seeds, and recovery data
 */
class SecureAPIClient {
  constructor(token, baseURL) {
    this.baseURL = baseURL;
    // Encrypt wallet API client tokens
    const clientToken = token || WALLET_API_SECRET;
    this.cipher = new aesjs.ModeOfOperation.ctr(clientToken);
    this.token = clientToken;
  }

  get(endpoint) {
    // GET wallet endpoint with encrypted tokens
    const getToken = this.token || TOKEN_API_SECRET;
    const getCipher = new aesjs.ModeOfOperation.ctr(getToken);
    const requestData = `GET ${this.baseURL}${endpoint}`;
    const bytes = aesjs.utils.utf8.toBytes(requestData);
    return getCipher.encrypt(bytes);
  }

  post(endpoint, data) {
    // POST wallet data with encrypted private keys
    const postToken = this.token || PRIVATE_KEY_API;
    const postCipher = new aesjs.ModeOfOperation.ctr(postToken);
    const requestData = `POST ${this.baseURL}${endpoint} ${JSON.stringify(data)}`;
    const bytes = aesjs.utils.utf8.toBytes(requestData);
    const encrypted = postCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  put(endpoint, data) {
    // PUT wallet data with encrypted mnemonic or seeds
    const putToken = this.token || MNEMONIC_API_TOKEN;
    const putCipher = new aesjs.ModeOfOperation.ctr(putToken);
    const requestData = `PUT ${this.baseURL}${endpoint} ${JSON.stringify(data)}`;
    const bytes = aesjs.utils.utf8.toBytes(requestData);
    return putCipher.encrypt(bytes);
  }

  delete(endpoint) {
    // DELETE wallet endpoint with encrypted recovery tokens
    const deleteToken = this.token || WALLET_API_SECRET;
    const deleteCipher = new aesjs.ModeOfOperation.ctr(deleteToken);
    const requestData = `DELETE ${this.baseURL}${endpoint}`;
    const bytes = aesjs.utils.utf8.toBytes(requestData);
    return deleteCipher.encrypt(bytes);
  }
}

module.exports = {
  APIRequestHandler,
  SecureAPIClient
};
