import React, { Component } from 'react';
import LoginMenu from './login-menu.jsx';
import axios from 'axios';

class FacebookLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogged: false,
      currentUser: {
        id: null,
        name: '',
        email: '',
        phoneNumber: '',
        profilePicURL: ''
      }
    }
  }

  statusChangeCallback(response) {
    let result;
    if (response.status === 'connected') {
      this.setState({ isLogged: true })
      this.connectAPI(() => {
        this.getUserbyEmail(
          this.state.currentUser.email,
          (err, result) => {
            if (err) {
            } else {
              if (result) {
                const currentUser = this.state.currentUser
                this.setState({
                  currentUser: {
                    id: result.id,
                    name: currentUser.name,
                    email: currentUser.email,
                    phoneNumber: result.phone_number,
                    profilePicURL: currentUser.profilePicURL
                  }
                })
                localStorage.setItem('user', JSON.stringify(this.state.currentUser));
              } else {
                this.setNewUser(
                  this.state.currentUser.name,
                  this.state.currentUser.email,
                  this.state.currentUser.profilePicURL
                );
              }
            }
          }
        );
      });
    } else {
      this.setState({ isLogged: false });
    }
  };

  componentDidMount() {

    window.fbAsyncInit = () => {
      FB.init({
        appId: '330704774106294',
        cookie: true,
        xfbml: true,
        version: 'v2.8'
      });

      window.FB.Event.subscribe('auth.statusChange', (response) => {
        this.statusChangeCallback(response);
        window.location = '/#/search'
      });
    }

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

  }

  getUserbyEmail(userEmail, callback) {
    axios.get('/api/login', {
      params: {
        email: userEmail
      }
    })
    .then((response) => {
      var data = response.data;
      if (data.err) {
        callback(data.err);
      } else {
        var user = data.result;
        callback(undefined, user);
      }
    })
    .catch((error) => {
      console.log("Unable to retrieve user by ID: ", error);
    });
  }

  setNewUser(userName, userEmail, profilePicURL, callback){
    if (!callback) callback = ()=>{};
    axios.post('/api/login', {
      name: userName,
      email: userEmail,
      profile_pic_url: profilePicURL
    })
    .then(function (response) {
      callback(undefined, response);
    })
    .catch(function (error) {
      callback(error);
    });
  }

  checkLoginState() {
    FB.getLoginStatus((response) => {
      console.log('res', response);
      this.statusChangeCallback(response);
    });
  }

  logout() {
    FB.getLoginStatus((response) => {
      if (response && response.status === 'connected') {
        FB.logout((response) => {
          this.setState(
            { isLogged: false,
              currentUser: {
                id: null,
                name: '',
                email: '',
                phoneNumber: '',
                profilePicURL: ''
              }
            }, () => {
              localStorage.clear();
            }
          );
        });
      }
      FB.Event.subscribe("auth.logout", function() {
        window.location = '/#/'
      });
    });
  }

  connectAPI(callback) {
    FB.api('/me?fields=name,email,picture.width(160).height(160)', (response) => {
      if (response && !response.error) {
        this.setState({
          currentUser: {
            name: response.name,
            email: response.email,
            profilePicURL: response.picture.data.url
          }
        });
      }
      callback();
    })
  }

  render() {
    if (this.state.isLogged === false){
      return (
        <div>
          <div className="fb-login-button" data-max-rows="1" data-size="large" data-button-type="login_with" data-show-faces="false" data-auto-logout-link="false" data-use-continue-as="false" onClick={this.checkLoginState.bind(this)}></div>
        </div>
      );
    } else {
      return (
        <div>
          <LoginMenu user={this.state.currentUser} logout={this.logout.bind(this)}/>
        </div>
      )
    }
  }
}

export default FacebookLogin;
