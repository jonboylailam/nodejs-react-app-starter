var rx = require('rx');
var stampit = require('stampit');

var api = stampit.methods({
  register: function (app, statsd, workerId) {

    function getClientIP(req) {
      return (req.headers["X-Forwarded-For"] ||
        req.headers["x-forwarded-for"] ||
        '').split(',')[0] ||
        req.client.remoteAddress;
    }

    app.post('/v1/api/hello', function (req, res) {
      var ans = req.body;
      ans.clientIp = getClientIP(req);
      ans.message = "hello";
      res.json(ans);
    });

    app.get('/v1/api/hello', function (req, res) {
      res.json({message: "hello from the server", youSaid: req.query.q, workerId: workerId, clientIp: getClientIP(req)});
    });
  }

});

module.exports = api();