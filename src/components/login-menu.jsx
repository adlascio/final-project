import React, { Component } from 'react';

class LoginMenu extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div>
        <div id="navbarMenuHeroA" className="navbar-menu">
          <div className="navbar-end">

            <a href="/#/search" className="navbar-item">
              <i className="fas fa-search fa-lg"></i>Search
            </a>
            <a href="/#/inbox" className="navbar-item">
              <i className="fas fa-inbox fa-lg"></i>Inbox
            </a>
            <a href="/#/user/settings" className="navbar-item">
              <img className="profilePic" src={this.props.user.profilePicURL}></img>{this.props.user.name}
            </a>
            <span className="fb-logout-button navbar-item">
              <i className="fas fa-times fa-lg"></i>Logout
            </span>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginMenu;