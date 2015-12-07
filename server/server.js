#!/usr/bin/env node
var cluster = require('cluster');

var pathToClient = process.env.PATH_TO_CLIENT || './client/build';
var port = process.env.PORT || 3000;
var heartbeatInterval = process.env.HEARTBEAT_INTERVAL || 5;

global.app = {
  name: 'starter-web-app', // chnage to the name of your app
  props: {
    runtime: process.env.RUN_TIME || 'dev'
  }
};

// Code to run if we're in the master process
if (cluster.isMaster) {
  console.log('PATH_TO_CLIENT = ' + pathToClient);
  console.log('PORT = ' + port);
  console.log('HEARTBEAT_INTERVAL = ' + heartbeatInterval);
  console.log('RUN_TIME = ' + global.app.props.runtime);

  // Count the machine's CPUs
  var cpuCount = require('os').cpus().length;

  if (global.app.props.runtime === 'dev') {
    cpuCount = 1;
  }

  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

  // Listen for dying workers
  cluster.on('exit', function (worker) {
    // Replace the dead worker, we're not sentimental
    console.log('Worker %d died :(', worker.id);
    cluster.fork();
  });
} else {
// Code to run if we're in a worker process
  var worker = require('./worker');

  worker({
    cluster: cluster,
    heartbeatInterval: heartbeatInterval,
    pathToClient: pathToClient,
    port: port
  });
}




