var rx = require('rx');
var stampit = require('stampit');
var fs = require('fs');
var express = require('express');
var compress = require('compression');
var bodyParser = require('body-parser');
var app = express();
var StatsD = require('node-statsd');

var logging = require('./logging');
var memoryMonitor = require('./monitors/memory');

var apiHandler = require('./api');

var worker = stampit.init(function () {
  var instance = this;
  var cluster = this.cluster;
  var pathToClient = this.pathToClient;
  var port = this.port;
  if (cluster === undefined ||
    pathToClient === undefined ||
    port === undefined) {
    instance.error("Cluster, pathToClient and port are required to create a worker.")
  } else {
    var hostname = process.env.HOST_NAME || 'jonsmac';
    var statsdHost = process.env.STATSD_HOST || '192.168.99.100';

    instance.workerId = hostname + '.' + instance.cluster.worker.id;
    instance.info('StatsD started on %s', statsdHost);
    var statsd = new StatsD({host: statsdHost});

    // log memory usage to statsd
    memoryMonitor({workerId: instance.workerId, statsd: statsd});

    // this is relative from the gulpfile.js i.e. from where the node server has been started from
    app.use(compress());
    app.use(express.static(pathToClient));
    app.use(bodyParser.json());

    apiHandler.register(app, statsd, instance.workerId);


    // catch all return the index page
    app.get('/*', function (req, res) {
      instance.log('Serving up the index.html');
      res.writeHead(200, {"Content-Type": "text/html"});
      fs.createReadStream(pathToClient + '/index.html')
        .pipe(res)
        .on('end', function () {
          res.end();
        });
    });

    var server = app.listen(port, function () {
      var host = server.address().address;
      var port = server.address().port;
      instance.info('Listening at http://localhost: %s', port);
    });

    process.on('uncaughtException', function (err) {
      instance.error('Caught exception: ' + err);
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



