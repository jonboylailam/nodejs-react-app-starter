var stampit = require('stampit');
var rx = require('rx');
var request = require('superagent');

module.exports = stampit.methods({
  handleResponse(err, ans) {
    if (err) {
      obs.onError(err);
    } else {
      obs.onNext(ans);
      obs.onCompleted();
    }
  },
  getTest(query) {
    var url = this.url;
    return rx.Observable.create((obs) => {
      var get = request.get(`${url}/api/test`);
      if (query) get.query(query);
      get.end((err, ans) => {
        if (err) {
          obs.onError(err);
        } else {
          obs.onNext(ans.body);
          obs.onCompleted();
        }
      });
    });
  },
  postTest(data) {
    var url = this.url;
    return rx.Observable.create((obs) => {
      request.post(`${url}/api/test`).send(data).end((err, ans) => {
        if (err) {
          obs.onError(err);
        } else {
          obs.onNext(ans.body);
          obs.onCompleted();
        }
      });
    });
  }
}).refs({
  url: 'http://localhost:3000'
});