
'use strict'

const fs = require('fs');
var log4js = require('log4js');
const logger = log4js.getLogger('FileLoader');


log4js.configure({
  appenders: {
    FileLoader: { type: 'file', filename: 'File-LoaderMessage.log', maxLogSize: 4194304, backups: 10, keepFileExt: true, compress: true, daysToKeep: 20  }
  },
  categories: {
    default: { appenders: ['FileLoader'], level: 'trace' }
  }

});

module.exports.logger = logger;


