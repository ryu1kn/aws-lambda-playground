'use strict';

class LambdaClient {

  constructor(params) {
    setPrivates(this, params, 'lambda', 'functionName', 'handler', 'role', 'zipFile');
  }

  upload() {
    return this._exists()
      .then(exist => {
        return (exist ? this._update : this._create).call(this);
      });
  }

  _exists() {
    return this.listFunctions().then(functions =>
      functions.filter(fn =>
        fn.FunctionName === this._functionName
      ).length > 0);
  }

  listFunctions() {
    let listFunctions = denodeify(this._lambda, 'listFunctions');
    return listFunctions({}).then(data => data.Functions);
  }

  _create() {
    let createFunction = denodeify(this._lambda, 'createFunction');
    return createFunction({
      FunctionName: this._functionName,
      Handler: this._handler,
      Role: this._role,
      Runtime: 'nodejs',
      Code: {ZipFile: this._zipFile}
    });
  }

  _update() {
    let updateFunctionCode = denodeify(this._lambda, 'updateFunctionCode');
    return updateFunctionCode({
      FunctionName: this._functionName,
      ZipFile: this._zipFile
    })
  }

}

function setPrivates(self, params, ...paramNames) {
  paramNames.forEach(paramName => {
    self[`_${paramName}`] = params[paramName];
  });
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
