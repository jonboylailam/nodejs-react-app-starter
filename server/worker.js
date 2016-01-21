var rx = require('rx');
var stampit = require('stampit');

var express = require('express');
var compress = require('compression');
var bodyParser = require('body-parser');
var app = express();
var StatsD = require('node-statsd');

var logging = require('./logging');
var memoryMonitor = require('./monitors/memory');

var apiHandler = require('./rest/api');

var worker = stampit.init(function () {
  var that = this;
  var cluster = this.cluster;
  var pathToClient = this.pathToClient;
  var port = this.port;
  if (cluster === undefined ||
    pathToClient === undefined ||
    port === undefined) {
    that.error("Cluster, pathToClient and port are required to create a worker.")
  } else {
    var hostname = process.env.HOST_NAME || 'jonsmac';
    var statsdHost = process.env.STATSD_HOST || '192.168.99.100';

    that.workerId = hostname + '.' + that.cluster.worker.id;
    that.info('StatsD started on %s', statsdHost);
    var statsd = new StatsD({host: statsdHost});

    // log memory usage to statsd
    memoryMonitor({workerId: that.workerId, statsd: statsd});

    // this is relative from the gulpfile.js i.e. from where the node server has been started from
    app.use(compress());
    app.use(express.static(pathToClient));
    app.use(bodyParser.json());

    apiHandler.register(app, statsd, that.workerId);

    var server = app.listen(port, function () {
      var host = server.address().address;
      var port = server.address().port;
      that.info('Listening at http://localhost: %s', port);
    });

    process.on('uncaughtException', function (err) {
      that.error('Caught exception: ' + err);
    });
  }
}).refs({
  cluster: undefined,
  pathToClient: undefined,
  port: undefined,
  heartbeatInterval: 5
});

worker = stampit.compose(logging, worker);

module.exports = worker;



