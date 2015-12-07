var stampit = require('stampit');
var rx = require('rx');

var rxRequest = require('rx-request');

var api = stampit.init(function () {

  var backend = rxRequest({
      url: window.location.origin
  });

  this.postHello = function (data) {
    var reqParams = {
      pathname: "/v1/api/hello"
    };

    return backend.post(reqParams, data).flatMap(function (d) {
      if (d.error) {
        return rx.Observable.throw(new Error(d.error));
      } else {
        return rx.Observable.just(d);
      }
    });
  };

  this.getHello = function (query) {
    var reqParams = {
      pathname: "/v1/api/hello",
      search: '?q='+query
    };

    return backend.get(reqParams).flatMap(function (d) {
      if (d.error) {
        return rx.Observable.throw(new Error(d.error));
      } else {
        return rx.Observable.just(d);
      }
    });
  };

});

module.exports = api();
