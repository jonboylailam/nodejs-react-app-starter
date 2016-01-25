var React = require('react');

module.exports = React.createClass({
  render() {
    return (
      <div>
        <h1>Sorry you are not logged in</h1>
        <a href="/login">Login</a>
      </div>
    )
  }
});