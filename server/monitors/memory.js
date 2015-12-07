var rx = require('rx');
var stampit = require('stampit');

var memoryMonitor = stampit.init(function () {
  var workerId = this.workerId;
  //var heartbeat = rx.Observable.interval(1000 * 60 * 1);
  var heartbeat = rx.Observable.interval(1000 * 5);

  var statsd = this.statsd;

  function bytesToSize(bytes, showSize) {
    if (bytes == 0) return '0 Byte';
    var k = 1000;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));

    if (showSize) {
      return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    } else {
      return (bytes / Math.pow(k, i)).toPrecision(3); //MB
    }
  }

  heartbeat.subscribe(function (d) {
    var memoryInfo = process.memoryUsage();
    var total = bytesToSize(memoryInfo.heapTotal);
    var used = bytesToSize(memoryInfo.heapUsed);
    if (statsd) {
      statsd.gauge('chinstrap.memory.total.'+workerId, total);
      statsd.gauge('chinstrap.memory.used.'+workerId, used);
      statsd.gauge('chinstrap.memory.free.'+workerId, total - used);
      statsd.gauge('chinstrap.memory.percentUsed.'+workerId, Math.ceil(used/total*100));
    }
  });

}).refs({workerId: undefined, statsd: undefined});

module.exports = memoryMonitor;