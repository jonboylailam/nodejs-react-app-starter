var stampit = require('stampit');
var _ = require('underscore');
var winston = require('winston');
require('winston-logstash');

var logstashHost = process.env.LOGSTASH_HOST || '127.0.0.1';
var logstashPort = process.env.LOGSTASH_PORT || 28777;
var logstashLogLevel = process.env.LOGSTASH_LOG_LEVEL || 'silly';
var consoleLogLevel = process.env.CONSOLE_LOG_LEVEL || 'silly';

var WinstonLogger = stampit.init(function (ctx) {
  // Avoid creating more than one winston logger
  if (!ctx.stamp.fixed.methods.winstonLogger) {
    console.log("Creating winston logger");
    var logstashOptions = {
      level: logstashLogLevel,
      port: logstashPort,
      node_name: 'logit-node-name',
      host: logstashHost
    };

    var winstonLogstash = new winston.transports.Logstash(logstashOptions);
    winstonLogstash.on('error', function() {
      console.log("Cannot connect to logstash server, going to continue in silent mode");
    });

    ctx.stamp.fixed.methods.winstonLogger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({level: consoleLogLevel}),
        winstonLogstash
      ]
    });

  }
  return ctx.stamp.fixed.methods.winstonLogger;
});

var winstonLogger = WinstonLogger();

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
    this.mergeMetaData(args, winstonLogger.silly);
  },
  log: function () {
    var args = [].slice.apply(arguments);
    this.mergeMetaData(args, winstonLogger.silly);
  },
  verbose: function () {
    var args = [].slice.apply(arguments);
    this.mergeMetaData(args, winstonLogger.verbose);
  },
  info: function () {
    var args = [].slice.apply(arguments);
    this.mergeMetaData(args, winstonLogger.info);
  },
  warn: function () {
    var args = [].slice.apply(arguments);
    this.mergeMetaData(args, winstonLogger.warn);
  },
  error: function () {
    var args = [].slice.apply(arguments);
    this.mergeMetaData(args, winstonLogger.error);
  }
}).refs({appName: 'YourAppNameHere', workerId: 'master'});

module.exports = logStamp;