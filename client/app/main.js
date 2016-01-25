var React = require('react');
var ReactDOM = require('react-dom');
var { Router, Route, IndexRoute } = require('react-router');
var { createHistory } = require('history');

var StateTree = require('./StateTree');
var App = require('./ui/App');
var Home = require('./ui/Home');
var Login = require('./ui/Login');
var Logout = require('./ui/Logout');
var Dashboard = require('./ui/Dashboard');
var About = require('./ui/About');
var AccessDenied = require('./ui/AccessDenied');

var history = createHistory();

function requireAuth(nextState, replaceState) {
  var user = StateTree.get('loggedIn', 'user');
  console.log('Doing auth check');
  if (user === null) {
    console.log('Doing auth check');
    replaceState({ nextPathname: nextState.location.pathname }, '/access-denied')
  }
}

ReactDOM.render((
  <Router history={history}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="login" component={Login}/>
      <Route path="about" component={About}/>
      <Route path="dashboard" component={Dashboard} onEnter={requireAuth}/>
      <Route path="logout" component={Logout}/>
      <Route path="access-denied" component={AccessDenied}/>
    </Route>
  </Router>
), document.getElementById('main'));