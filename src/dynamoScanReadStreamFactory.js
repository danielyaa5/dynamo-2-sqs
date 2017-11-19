// npm
const _ = require('lodash');
const AWS = require('aws-sdk');
const Joi = require('joi');
const dynamoStreams = require('dynamo-streams');

const defaultOptions = {
  config: {}
};

module.exports = (TableName, options) => {
  // validation
  Joi.assert(TableName, Joi.string().min(1).required());
  Joi.assert(options.config, Joi.object());

  options = _.defaults(options, defaultOptions);
  const dynamodb = new AWS.DynamoDB(options.config);

  return dynamoStreams.createScanStream(dynamodb, {TableName})
};
