var React = require('react');
var ReactDOM = require('react-dom');
var { Router, Route, IndexRoute } = require('react-router');
var { createHistory } = require('history');

var App = require('./App');
var Home = require('./Home');
var About = require('./About');

var history = createHistory();

ReactDOM.render((
  <Router history={history}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="about" component={About}/>
    </Route>
  </Router>
), document.getElementById('main'));