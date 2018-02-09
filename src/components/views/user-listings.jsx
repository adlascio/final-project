import React, { Component } from 'react';
import UserMenu from '../user-menu.jsx';
import fetch from 'node-fetch';
import axios from 'axios';
import Popup from '../popup.jsx';

class UserListings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      landlord_id: '',
      address: '',
      rooms: [],
      showPopup: false,
      selectedRoom: null
    }
  }

  async getUserIdByName(userName ,callback) {
    if (!callback) callback = ()=>{};
    let user_id = undefined;
    await axios.get('http://localhost:5000/api/users',
      {
        params: {
          name: userName
        }
      })
      .then((response) => {
        const data = response.data;
        if (data.err) {
          callback(data.err);
        } else {
          user_id = data[0].id;
          callback(undefined, user_id);
        }
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  }

  async getRoomsByUserId(userId, callback) {
    if (!callback) callback = ()=>{};
    let rooms = [];
    await axios.get(`http://localhost:5000/api/users/${userId}/rooms`)
    .then((response) => {
      const data = response.data;
      if (data.err) {
        callback(data.err);
      } else {
        rooms = data;
        callback(undefined, rooms);
      }
    })
    .catch((error) => {
      console.log("Error: ", error);
    });
  }

  async renderUserListings() {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    this.getUserIdByName(currentUser.name, (err, result)=> {
      if(err){
        console.log("Unable to retrieve user by ID", err)
      } else {
        this.getRoomsByUserId(result, (err, result) => {
          if(err){
            console.log("Unable to retrieve user by ID", err);
          } else {
            result.forEach((room) => {
              this.setState({
                rooms: this.state.rooms.concat(room)
              })
            })
          }
        })
      }

    });
  }

  deleteListing(event){
    const room_id = event.target.dataset.id;
    if (confirm('Are you sure you want to delete?')) {
      axios.post(`api/rooms/${room_id}/delete`)
      .then((response) => {
        const data = response.data;
        if(data.err){
          console.log("err", data.err)
        } else {
          this.setState({
            rooms: this.state.rooms.filter((room) =>{
              return room.id !== Number(room_id);
            })
          })
        }
      })
      .catch((error) => {
        console.log("Error occured while deleting: ", error);
      });
    } else {}
  }
  componentDidMount() {
    this.renderUserListings();
  }

  togglePopup(event) {
    const room_id = event.target.dataset.id;
    if(this.state.showPopup){
      this.setState({
        showPopup: !this.state.showPopup
      });
    } else {
      this.setState({
        showPopup: !this.state.showPopup,
        selectedRoom: room_id
      });
    }
  }

  render() {
    const currentUser = localStorage.getItem('user');
    const userListing =
      (address, city, rent_amount, description, id, file) => (
        <div className="column">
          <div className="card">
            <div className="user-page listing-single">
              <div className="listing-header">
                <span className="listing-title">{address}</span>
                <div className="listing-image-container">
                  <div className="listing-image-filter"></div>
                  <img src={file} alt="Placeholder image" className="listing-image"></img>
                  <span className="listing-price">$ {rent_amount}</span>
                </div>
                <p>{description}</p>
              </div>
            </div>
            <footer className="card-footer">
              <p className="card-footer-item">
                <span>
                  <button data-id={id} className="button is-warning" onClick={this.togglePopup.bind(this)}>Edit Listing</button>
                </span>
              </p>
              <p className="card-footer-item">
                <span>
                  <button data-id={id} className="button is-danger" onClick={this.deleteListing.bind(this)}>Remove Listing</button>
                </span>
              </p>
            </footer>
          </div>
        </div>
      )

    return (
        <div>
          <UserMenu />
          <div className="animated fadeIn">
            <div className="sideScroll columns">
              {
                this.state.rooms.map((item) => {
                   return userListing(item.street, item.city, item.rent_amount, item.description, item.id, item.file)
                })
              }
              <div className="sideScroll-inner"></div>
              {this.state.showPopup ? <Popup room_id={this.state.selectedRoom} closePopup={this.togglePopup.bind(this)}/> : null }
            </div>
          </div>
        </div>
      )
    }
  }

export default UserListings;
