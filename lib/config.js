'use strict';

let JSON5 = require('json5');

class JsConfig {

  constructor(params) {
    this._fs = params.fs;
    this.loadSync(params.loadPath);
  }

  loadSync(path) {
    this._config = JSON5.parse(this._fs.readFileSync(path));
  }

  get(key) {
    return this._config[key];
  }

}

module.exports = JsConfig;
