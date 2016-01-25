var React = require('react');
var StateTree = require('../StateTree');

var Header = require('./Header');

var App = React.createClass({

  childContextTypes: {
    tree: React.PropTypes.object
  },

  getChildContext() {
    return {
      tree: StateTree
    };
  },

  render() {

    return (
      <div>
        <Header/>
        {this.props.children}
      </div>)
  }
});
module.exports = App;