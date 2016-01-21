var rx = require('rx');
var stampit = require('stampit');

var api = stampit.methods({
  register: function (app, statsd, workerId) {

    app.post('/api/test', function (req, res) {
      var ans = req.body;
      res.json(ans);
    });

    app.get('/api/test', function (req, res) {
      res.json({message: "hello from the server", youSaid: req.query.q, workerId: workerId});
    });
  }

});

module.exports = api();