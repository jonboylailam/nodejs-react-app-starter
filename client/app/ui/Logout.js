var React = require('react');
var mixins = require('baobab-react/mixins');

module.exports = React.createClass({

  mixins: [mixins.branch],

  cursors: {
    user: ['loggedIn', 'user']
  },

  actions: {
    logout(tree) {
      tree.set(['loggedIn'],{
        user: null
      });
    }
  },
  componentWillMount() {
    this.actions.logout()
  },
  render() {
    return (
      <div>
        <h1>You have been logged out, bye for now...</h1>
      </div>
    )
  }
});