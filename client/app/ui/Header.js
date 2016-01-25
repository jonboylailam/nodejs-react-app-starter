var React = require('react');
var mixins = require('baobab-react/mixins');

module.exports = React.createClass({
  mixins: [mixins.branch],

  cursors: {
    user: ['loggedIn', 'user']
  },

  render() {
    var items = [
      <li key="1"><a href="/">Home</a></li>,
      <li key="2"><a href="/about">About</a></li>,
      <li key="3"><a href="/dashboard">Dashboard</a></li>
    ];


    if (this.state.user) {
      items.push(<li key="4"><a href="/logout">Logout</a></li>);
    }

    return (
      <div>
        <ul>
          {items}
        </ul>
      </div>
    )
  }
});