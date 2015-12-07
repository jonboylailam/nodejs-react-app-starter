var stampit = require('stampit');
var _ = require('underscore');
var winston = require('winston');
require('winston-logstash');

var winstonLogger = stampit.init(function (ctx) {
  // Avoid creating more than one winston logger
  if (!ctx.stamp.fixed.methods.winstonLogger) {

    var logstashOptions = {
      level: 'silly',
      port: 28777,
      node_name: 'logit-node-name',
      host: '127.0.0.1'
    };

    ctx.stamp.fixed.methods.winstonLogger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({level: 'silly'}),
        new (winston.transports.Logstash)(logstashOptions)
      ]
    });
  }
});

var logStamp = stampit.methods({
  mergeMetaData: function (args, f) {
    var argsLength = args.length,
      metaData = {app_name: this.appName, worker_id: this.workerId};

    if (typeof args[argsLength - 1] !== 'object') {
      args.push(metaData);
    } else {
      _.extend(args[argsLength - 1], metaData);
    }
    f.apply(null, args);
  },
  silly: function () {
    var args = [].slice.apply(arguments);
    this.mergeMetaData(args, this.winstonLogger.silly);
  },
  log: function () {
    var args = [].slice.apply(arguments);
    this.mergeMetaData(args, this.winstonLogger.silly);
  },
  verbose: function () {
    var args = [].slice.apply(arguments);
    this.mergeMetaData(args, this.winstonLogger.verbose);
  },
  info: function () {
    var args = [].slice.apply(arguments);
    this.mergeMetaData(args, this.winstonLogger.info);
  },
  warn: function () {
    var args = [].slice.apply(arguments);
    this.mergeMetaData(args, this.winstonLogger.warn);
  },
  error: function () {
    var args = [].slice.apply(arguments);
    this.mergeMetaData(args, this.winstonLogger.error);
  }
}).props({appName: 'web-starter-app', workerId: 'master'});

logStamp = stampit.compose(winstonLogger, logStamp);
module.exports = logStamp;