'use strict';

class Zip {

  constructor(params) {
    this._archive = params.archiver.create('zip', {});
    this._fs = params.fs;
  }

  zip(dirPath, destPath) {
    let archive = this._archive;
    let output = this._fs.createWriteStream(destPath);
    return new Promise((resolve, reject) => {
      archive.pipe(output);
      archive.directory(dirPath, '.').finalize();
      archive.on('error', err => {
        reject(err)
      });
      output.on('close', () => {
        resolve();
      });
    });
  }

}

module.exports = Zip;
