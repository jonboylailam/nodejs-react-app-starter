var React = require('react');
var mixins = require('baobab-react/mixins');

module.exports = React.createClass({

  mixins: [mixins.branch],

  cursors: {
    user: ['loggedIn', 'user']
  },

  render() {
    var user = this.state.user;

    var userView = "";
    if (user) {
      userView = <div>Name: {user.name}</div>
    }

    return (
      <div>
        <h1>Dashboard</h1>
        {userView}
      </div>
    )
  }
});