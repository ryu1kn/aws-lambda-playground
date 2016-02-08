'use strict';

let AWS = require('aws-sdk');
let JsConfig = require('./lib/config');
let LambdaClient = require('./lib/lambda-client');
let Zip = require('./lib/zip');
let archiver = require('archiver');
let fs = require('fs');
let util = require('util');

let config = new JsConfig({
  fs,
  loadPath: './app.conf'
});
let lambda = new AWS.Lambda({
  accessKeyId: config.get('aws.accessKeyId'),
  secretAccessKey: config.get('aws.secretAccessKey'),
  region: config.get('aws.region')
});
let zip = new Zip({archiver, fs});

let argv = require('minimist')(process.argv.slice(2));
let functionName = argv['function-name'];
if (!functionName) {
  // XXX: Check it ealier stage
  throw new Error('`--function-name` must be specified');
}

zip.zip(getLambdaDirPath(functionName), getLambdaZipPath(functionName))
  .then(() => {
    let functionConfig = new JsConfig({
      fs,
      loadPath: getLambdaConfigPath(functionName)
    })
    let lambdaClient = new LambdaClient({
      lambda,
      functionName,
      handler: functionConfig.get('handler'),
      role: functionConfig.get('execution_role'),
      zipFile: new Buffer(fs.readFileSync(getLambdaZipPath(functionName)), 'binary')
    });
    return lambdaClient.upload();
  })
  .then(data => {
    console.log(data);
  }, e => {
    console.error(e.stack);
  });

function getLambdaConfigPath(functionName) {
  return util.format('lambdas/%s.json', functionName);
}

function getLambdaDirPath(functionName) {
  return 'lambdas/' + functionName;
}

function getLambdaZipPath(functionName) {
  return util.format('tmp/%s.zip', functionName);
}
