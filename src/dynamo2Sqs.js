// npm
const _ = require('lodash');
const Joi = require('joi');

// local
const pipeInjection = require('./pipeInjection');
const SqsWriteStream = require('sqs-write-stream');
const dyanmoScanReadStreamFactory = require('./dynamoScanReadStreamFactory');

// setup
const defaultOptions = {
  pipeInject: (dynamoScanReadStream, sqsWriteStream) => [dynamoScanReadStream, sqsWriteStream]
};

/**
 * @typedef {Function} PipeInject
 * @param {Object} sqsWriteStream
 * @param {Object} dynamoScanStream
 * @returns {Array}
 */

/**
 * Scans a DynamoDB table and inserts rows into SQS for processing
 * @param {String} tableName
 * @param {Object} queue - Must contain either the name or url for queue
 * @param {String} [queue.url] - The QueueUrl
 * @param {String} [queue.name] - The QueueName
 * @param {Object} [options]
 * @param {Function} [options.pipeInject = (sqsWriteStream, dynamoScanStream) => [sqsWriteStream, dynamoScanStream]]
 * @param {Object} [options.dynamo]
 * @param {Object} [options.dynamo.config]
 * @param {Object} [options.sqs]
 * @param {Object} [options.sqs.MessageGroupId]
 * @param {Number} [options.sqs.batchSize = 10]
 * @param {Object} [options.sqs.config]
 * @returns {Promise} - Promise is completed when the pipe is closed
 */
function dynamo2Sqs(tableName, queue, options = {}) {
  options = _.defaults(options, defaultOptions);
  const sqsWriteStream = new SqsWriteStream(queue, options.sqs);
  const dynamoScanReadStream = dyanmoScanReadStreamFactory(tableName, options.dynamo);

  const pipes = options.pipeInject( dynamoScanReadStream, sqsWriteStream );

  // validation
  Joi.assert(pipes, Joi.array().min(2).required());

  return pipeInjection(pipes);
}

module.exports = dynamo2Sqs;
