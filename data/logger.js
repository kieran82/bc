'use strict';

var log4js = require('log4js');
const logger = log4js.getLogger('data');

log4js.configure({
  appenders: {
    FileLoader: {
      type: 'file',
      filename: 'Data-creation.log',
      maxLogSize: 4194304,
      backups: 10,
      keepFileExt: true,
      compress: true,
      daysToKeep: 20
    }
  },
  categories: {
    default: { appenders: ['FileLoader'], level: 'trace' }
  }
});

module.exports.logger = logger;
