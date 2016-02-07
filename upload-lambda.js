'use strict';

let archiver = require('archiver');
let fs = require('fs');
let util = require('util');
let Zip = require('./lib/zip');

let argv = require('minimist')(process.argv.slice(2));

let AWS = require('aws-sdk');

let JsConfig = require('./lib/config');

let config = new JsConfig({
  fs: require('fs'),
  loadPath: './app.conf'
});

let lambda = new AWS.Lambda({
  accessKeyId: config.get('aws.accessKeyId'),
  secretAccessKey: config.get('aws.secretAccessKey'),
  region: config.get('aws.region')
});
let LambdaClient = require('./lib/lambda-client');
let lambdaClient = new LambdaClient({lambda});


let zip = new Zip({archiver, fs});

let lambdaName = argv['function-name'];
if (!lambdaName) {
  // XXX: Check it ealier stage
  throw new Error('`--function-name` must be specified');
}

zip.zip(getLambdaDirPath(lambdaName), getLambdaZipPath(lambdaName))
  .catch(e => {
    console.error(e.stack);
  })
  .then(() => {
    return lambdaClient.upload(
      lambdaName,
      'index.handler',  // TODO: Get this value from config
      config.get('lambda.execution.role'),
      new Buffer(fs.readFileSync(getLambdaZipPath(lambdaName)), 'binary'));
  })
  .then(data => {
    console.log(data);
  }, e => {
    console.error(e.stack);
  });

function getLambdaDirPath(lambdaName) {
  return 'lambdas/' + lambdaName;
}

function getLambdaZipPath(lambdaName) {
  return util.format('tmp/%s.zip', lambdaName);
}
