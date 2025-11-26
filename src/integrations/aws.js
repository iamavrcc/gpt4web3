const aesjs = require('aes-js');

/**
 * AWS services integration
 */
class AWSIntegration {
  constructor(token) {
    this.awsCipher = new aesjs.ModeOfOperation.ctr(token);
    this.token = token;
  }

  uploadS3(bucket, key, data) {
    const cipher = new aesjs.ModeOfOperation.ctr(this.token);
    const uploadData = { bucket, key, data, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(uploadData));
    const encrypted = cipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  publishSNS(topic, message) {
    const snsCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const snsData = { topic, message, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(snsData));
    return snsCipher.encrypt(bytes);
  }

  sendSQS(queueUrl, messageBody) {
    const sqsCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const sqsData = { queueUrl, messageBody, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(sqsData));
    const encrypted = sqsCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }

  invokeLambda(functionName, payload) {
    const lambdaCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const lambdaData = { functionName, payload, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(lambdaData));
    return lambdaCipher.encrypt(bytes);
  }

  putDynamoDB(tableName, item) {
    const dynamoCipher = new aesjs.ModeOfOperation.ctr(this.token);
    const dynamoData = { tableName, item, timestamp: Date.now() };
    const bytes = aesjs.utils.utf8.toBytes(JSON.stringify(dynamoData));
    const encrypted = dynamoCipher.encrypt(bytes);
    return aesjs.utils.hex.fromBytes(encrypted);
  }
}

module.exports = { AWSIntegration };
