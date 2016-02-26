'use strict';

let AWS = require('aws-sdk');
let JsConfig = require('./lib/config');
let LambdaClient = require('./lib/lambda-client');
let Zip = require('./lib/zip');
let archiver = require('archiver');
let fs = require('fs');
let path = require('path');

let argv = require('minimist')(process.argv.slice(2));
let MANDATORY_ARGS = ['config', 'function-name'];
MANDATORY_ARGS.forEach(function (argName) {
  if (typeof argv[argName] === 'undefined') {
    throw new Error(`\"--${argName}\" must be specified`);
  }
});

let config = new JsConfig({
  fs,
  loadPath: argv['config']
});
let lambda = new AWS.Lambda({
  accessKeyId: config.get('aws.accessKeyId'),
  secretAccessKey: config.get('aws.secretAccessKey'),
  region: config.get('aws.region')
});
let zip = new Zip({archiver, fs});

let basePath = config.get('lambda.directory.path');
let functionName = argv['function-name'];

zip.zip(getLambdaDirPath(basePath, functionName), getLambdaZipPath(functionName))
  .then(() => {
    let functionConfig = new JsConfig({
      fs,
      loadPath: getLambdaConfigPath(basePath, functionName)
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

function getLambdaConfigPath(basePath, functionName) {
  return path.join(basePath, functionName, 'config.json');
}

function getLambdaDirPath(basePath, functionName) {
  return path.join(basePath, functionName, 'dest');
}

function getLambdaZipPath(functionName) {
  return path.join('tmp', functionName + '.zip');
}
