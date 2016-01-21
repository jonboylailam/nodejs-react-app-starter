var React = require('react');

var App = React.createClass({
    render() {
      return (
        <div>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
          </ul>

          {this.props.children}
        </div>)
    }
  }
);

module.exports = App;