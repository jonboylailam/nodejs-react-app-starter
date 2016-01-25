var React = require('react');
var mixins = require('baobab-react/mixins');

module.exports = React.createClass({

  mixins: [mixins.branch],

  cursors: {
    user: ['loggedIn', 'user']
  },

  actions: {
    setLoggedIn(tree, name) {
      tree.set(['loggedIn'],{
        user: {
          name: name
        }
      });
    }
  },

  getInitialState() {
    return {
      name: null
    }
  },
  nameChanged(name) {
    this.setState({name: name});
  },
  login() {
    this.actions.setLoggedIn(this.state.name);
  },
  render() {
    return (
      <div>
        <h1>Login</h1>
        <div className="form-inline">
          <div className="form-group">
            <input type="text" className="form-control" id="name" placeholder="Name"
                   onChange={(e) => {return this.nameChanged(e.target.value)}} value={this.state.name}/>
          </div>
          <button className="btn btn-default" onClick={this.login}>Login</button>
        </div>
      </div>
    )
  }
});