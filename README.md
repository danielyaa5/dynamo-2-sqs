# Dynamo 2 SQS
Scan DynamoDB table and insert the items into SQS. Useful for creating enqueue workers.

Note: This is not built for every use case so if you need it to fit with your particular case, please submit a PR.

## Installation
`npm i -S dynamo-2-sqs`

## Requirements
Requires Node 8.0 or greater

## Simple Usage
```
const dynamo2Sqs = require('dynamo-2-sqs');

const queueUrl = 'foobar_fifo';
const sqsConfig = { region: 'us-east-1' };
const tableName = 'quax';
const MessageGroupId = 'quax1';
const dynamoConfig = { region: 'us-east-2' };
const options = { dynamo: { config: dynamoConfig }, sqs: { config: sqsConfig, MessageGroupId } };

const start = () => dynamo2Sqs(tableName, queueUrl, options);
```
## Advanced Usage
**Warning: Not tested**

Uses my own technique which I call pipe injection. You receive 2 pipes as arguments to the function and you return an array of pipes for a pipeline to be created.

```
const exampleTransformStream = new stream.Transform();

options.pipeInject =(dynamoScanReadStream, sqsWriteStream) => [dynamoScanReadStream, exampleTransformStream, sqsWriteStream]

const start = () => dynamo2Sqs(tableName, queueUrl, options);
```
