'use strict';

// TODO: Change it to deal with 1 lambda
class LambdaClient {

  constructor(params) {
    this._lambda = params.lambda;
  }

  upload(functionName, handler, role, zipFile) {
    let that = this;
    return that.existFunction(functionName)
      .then(exist => {
        let upload = exist ? that._updateFunction : that._createFunction;
        return upload.call(that, functionName, handler, role, zipFile);
      });
  }

  existFunction(functionName) {
    return this.listFunctions().then(functions =>
      functions.filter(fn =>
        fn.FunctionName === functionName
      ).length > 0);
  }

  listFunctions() {
    let listFunctions = denodeify(this._lambda, 'listFunctions');
    return listFunctions({}).then(data => data.Functions);
  }

  _createFunction(functionName, handler, role, zipFile) {
    let createFunction = denodeify(this._lambda, 'createFunction');
    return createFunction({
      FunctionName: functionName,
      Handler: handler,
      Role: role,
      Runtime: 'nodejs',
      Code: {ZipFile: zipFile}
    });
  }

  _updateFunction(functionName, handler, role, zipFile) {
    let updateFunctionCode = denodeify(this._lambda, 'updateFunctionCode');
    return updateFunctionCode({
      FunctionName: functionName,
      ZipFile: zipFile
    })
  }

}

function denodeify(arg1, arg2) {
  let fn = arg2 ? arg1[arg2].bind(arg1) : arg1;
  return function (...args) {
    return new Promise((resolve, reject) => {
      args.push((err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
      fn.apply(null, args);
    });
  }
}

module.exports = LambdaClient;
