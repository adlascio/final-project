import React, { Component } from 'react';
import { render } from 'react-dom';
import { InfoWindow, Marker, GoogleApiWrapper, withScriptjs, GoogleMap } from 'google-maps-react';
import GoogleMapDrawFilter from "react-google-map-draw-filter";
import axios from 'axios';
import fetch from 'node-fetch';
import FacebookLogin from './fb-login.jsx';

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    console.log('map container constructor called');
    this.state = {
      drawMode: false,
      loaded: false,
      menuopen: false,
      activeMarkers: [],
      address: '',
      available_date: undefined,
      pet_friendly: false,
      rent_amount_min: undefined,
      rent_amount_max: undefined,
      water: false,
      eletricity: false,
      internet: false,
      heat: false,
      natural_gas: false,
      storage: false,
      laundry_on_site: false,
      furniture: false,
      parking: false,
      rooms: [],
      otherMarkers: [],
      currentFilters: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
  }

  createMarker(room) {
    let date = ''+ room.available_date +'';
    date = date.substring(0, date.length - 14)
    let landlordEmail = ''+room.landlord_email+''
    let roomName = ''+ room.street+ ''
    roomName = roomName.replace(" ", "%20");
    let user = JSON.parse(localStorage.getItem('user'));
    let tenantName = ''+ user.name + ''
    let tenantEmail = ''+ user.email + ''
    let tenantPhone = ''+ user.phoneNumber + ''
    let applyLink = 'mailto:'+landlordEmail+'?CC='+tenantEmail+'&Subject=Application%20-%20'+roomName+'&Body=Hello%2C%0A%0AMy%20name%20is%20'+tenantName+'%2C%20and%20I%20am%20applying%20to%20'+roomName+'%20from%2010/Tenant.%0A%0AI%20can%20be%20reached%20at%20'+tenantPhone+'%20number%20to%20discuss%20a%20viewing.%0A%0AThank%20you%2C%0A%0A'+tenantName+''

    const info =
    '<div class="listing-single">' +
      '<div class="listing-header">' +
        '<span class="listing-title">'+ room.street + '</span>' +
        '<div class="listing-image-container">' +
          '<div class="listing-image-filter"></div>'+
          '<div class="listing-image" style="background-image:url('+room.file+');">'+
          '<span class="listing-price">$'+ room.rent_amount + ' /month</span>' +
          '<a href="'+applyLink+'" class="listing-contact">Apply</a>' +
        '</div>' +
      '</div>' +
      '<span class="available_date">Available:</span><span>' + date +'</span>' +
      '<p>' + room.details + '</p>' +
    '</div>'
    return { info, latLng: { lng: room.lng, lat: room.lat }, icon: { url: '/images/icon.png' } };
  }

  async renderRooms() {
    const response = await fetch('http://localhost:5000/api/rooms')
    const rooms = await response.json()
    this.setState({
      rooms: [
        ...rooms
      ],
      otherMarkers: rooms.map(this.createMarker)
    })
    console.log('rooms:', rooms);
  }

  componentDidMount() {
    this.renderRooms();
  }

  onMarkerClick(marker, e) {
    this.setState({
      activeMarkers: [marker]
    });
  }

  handleReturnedMarkers(markers) {
    this.setState({
      activeMarkers: markers
    });
  }

  toggleDraw() {
    this.setState({
      drawMode: !this.state.drawMode,
    });
  }

  toggleMenu() {
    this.setState({
      menuopen: !this.state.menuopen,
    });
  }

  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    console.log("name", name);
    this.setState({
      [name]: value
    });
    const filteredRooms = []
    if (this.setState.name === true) {
      this.setState.otherMakers = []
    }
  }

  handleCheckbox(event) {
    const name = event.target.name;
    const toggle = !this.state[name];
    const currentFilters = toggle ? this.state.currentFilters.concat(name) : this.state.currentFilters.filter(function (filter) {
      return filter != name;
    });
    const filteredRooms = this.state.rooms.filter(
      (room) => {
        return currentFilters.every(function (filter) {
          return room[filter] == true;
        });
      }
    ).map(this.createMarker);
    this.setState({
      [name]: toggle,
      currentFilters: currentFilters,
      otherMarkers: filteredRooms
    })
  }

  render() {

    const mapStyle = {
      width: window.innerWidth,
      height: window.innerHeight,
    }
    const style = [{"featureType":"administrative","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"administrative","elementType":"labels.icon","stylers":[{"visibility":"on"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#58585b"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"color":"#f7f1df"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"lightness":"0"},{"color":"#f7f1df"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"geometry","stylers":[{"color":"#fbd3da"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#b4dfc9"},{"lightness":"55"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"visibility":"simplified"},{"color":"#58585b"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#d4df68"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#d4df68"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#58585b"}]},{"featureType":"road.highway","elementType":"labels.text.stroke","stylers":[{"color":"#58585b"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"black"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"color":"#939396"},{"lightness":"46"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"transit.line","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#b4dfc9"},{"lightness":"17"}]}]

    const mapConfig = {
      zoom: 14,
      lat: 49.275147,
      lng: -123.132362,
      scrollwheel: false,
      disableDefaultUI: true,
    }
    const polygonOptions = {
      fillColor: '#A3A2AF',
      fillOpacity: 0.6,
      strokeColor: '#A3A2AF',
      strokeWeight: 3,
      clickable: true,
      editable: true,
      zIndex: 1
    }

    if (this.state.menuopen === true) {
      return (
        <div>
          <div className="columns">
            <aside className="search-menu column is-3 ">
              <div className="search-menu-container">
                <button id="menu-toggle" onClick={this.toggleMenu.bind(this)}>
                  <i className="fas fa-cog fa-2x"></i>
                </button>
                <form>
                  <div>
                    <span className="searchHeading">Utilities</span>
                  </div>
                  <div>
                    <div className="columns">
                      <div className="column">
                        <div className="field">
                          <label>Water</label>
                          <label className="switch">
                            <input
                              name="water"
                              type="checkbox"
                              value={this.state.water}
                              onChange={this.handleCheckbox}></input>
                            <span className="slider round"></span>
                          </label>
                        </div>
                        <div className="field">
                          <label>Eletricity</label>
                          <label className="switch">
                            <input
                              name="eletricity"
                              type="checkbox"
                              value={this.state.eletricity}
                              onChange={this.handleCheckbox}>
                            </input>
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </div>
                      <div className="column">
                        <div className="field">
                          <label>Heat</label>
                          <label className="switch">
                            <input
                              name="heat"
                              type="checkbox"
                              value={this.state.heat}
                              onChange={this.handleCheckbox}>
                            </input>
                            <span className="slider round"></span>
                          </label>
                        </div>
                        <div className="field">
                          <label>Natural Gas</label>
                          <label className="switch">
                            <input
                              name="natural_gas"
                              type="checkbox"
                              value={this.state.natural_gas}
                              onChange={this.handleCheckbox}>
                            </input>
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="searchHeading">Amenities</span>
                  </div>
                  <div>
                    <div className="columns">
                      <div className="column">
                        <div className="field">
                          <label>Storage</label>
                          <label className="switch">
                            <input
                              name="storage"
                              type="checkbox"
                              value={this.state.storage}
                              onChange={this.handleCheckbox}>
                            </input>
                            <span className="slider round"></span>
                          </label>
                        </div>
                        <div className="field">
                          <label>Onsite Laundry</label>
                          <label className="switch">
                            <input
                              name="laundry_on_site"
                              type="checkbox"
                              value={this.state.laundry_on_site}
                              onChange={this.handleCheckbox}>
                            </input>
                            <span className="slider round"></span>
                          </label>
                        </div>
                        <div className="field">
                          <label>Parking</label>
                          <label className="switch">
                            <input name="parking"
                              type="checkbox"
                              value={this.state.parking}
                              onChange={this.handleCheckbox}>
                            </input>
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </div>
                      <div className="column">
                        <div className="field">
                          <label>Pet Friendly</label>
                          <label className="switch">
                            <input
                              name="pet_friendly"
                              type="checkbox"
                              value={this.state.pet_friendly}
                              onChange={this.handleCheckbox}>
                            </input>
                            <span className="slider round"></span>
                          </label>
                        </div>
                        <div className="field">
                          <label>Internet</label>
                          <label className="switch">
                            <input
                              name="internet"
                              type="checkbox"
                              value={this.state.internet}
                              onChange={this.handleCheckbox}>
                            </input>
                            <span className="slider round"></span>
                          </label>
                        </div>
                        <div className="field">
                          <label>Fully Furnished</label>
                          <label className="switch">
                            <input
                              name="furniture"
                              type="checkbox"
                              value={this.state.furniture}
                              onChange={this.handleCheckbox}>
                            </input>
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="columns">
                    <div className="column">
                      <a className="polygon button is-rounded is-large" onClick={this.toggleDraw.bind(this)}>
                        <span className="icon is-medium">
                          <i className="fab fa-bandcamp"></i>
                        </span>
                        <span>Polygon Search</span>
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </aside>
            <div className="map-container column is-9">
              <div className="App">
                <GoogleMapDrawFilter
                  drawMode={this.state.drawMode}
                  markers={this.state.otherMarkers}
                  mapConfig={mapConfig}
                  mapStyle={mapStyle}
                  polygonOptions={polygonOptions}
                  handleReturnedMarkers={this.handleReturnedMarkers.bind(this)}
                  onMarkerClick={this.onMarkerClick.bind(this)}
                  apiKey='AIzaSyADYWSlC4yEedJ-5lvQb9UFOVaMMux54Zc'
                />
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <div className="columns">
            <aside className="search-menu column is-3 closed">
              <div className="search-menu-container">
                <button id="menu-toggle" onClick={this.toggleMenu.bind(this)}>
                  <i className="fas fa-cog fa-2x"></i>
                </button>
                <form>
                  <div>
                    <span className="searchHeading">Utilities</span>
                  </div>
                  <div>
                    <div className="columns">
                      <div className="column">
                        <div className="field">
                          <label>Water</label>
                          <label className="switch">
                            <input
                              name="water"
                              type="checkbox"
                              value={this.state.water}
                              onChange={this.handleCheckbox}></input>
                            <span className="slider round"></span>
                          </label>
                        </div>
                        <div className="field">
                          <label>Eletricity</label>
                          <label className="switch">
                            <input
                              name="eletricity"
                              type="checkbox"
                              value={this.state.eletricity}
                              onChange={this.handleCheckbox}>
                            </input>
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </div>
                      <div className="column">
                        <div className="field">
                          <label>Heat</label>
                          <label className="switch">
                            <input
                              name="heat"
                              type="checkbox"
                              value={this.state.heat}
                              onChange={this.handleCheckbox}>
                            </input>
                            <span className="slider round"></span>
                          </label>
                        </div>
                        <div className="field">
                          <label>Natural Gas</label>
                          <label className="switch">
                            <input
                              name="natural_gas"
                              type="checkbox"
                              value={this.state.natural_gas}
                              onChange={this.handleCheckbox}>
                            </input>
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="searchHeading">Amenities</span>
                  </div>
                  <div>
                    <div className="columns">
                      <div className="column">
                        <div className="field">
                          <label>Storage</label>
                          <label className="switch">
                            <input
                              name="storage"
                              type="checkbox"
                              value={this.state.storage}
                              onChange={this.handleCheckbox}>
                            </input>
                            <span className="slider round"></span>
                          </label>
                        </div>
                        <div className="field">
                          <label>Onsite Laundry</label>
                          <label className="switch">
                            <input
                              name="laundry_on_site"
                              type="checkbox"
                              value={this.state.laundry_on_site}
                              onChange={this.handleCheckbox}>
                            </input>
                            <span className="slider round"></span>
                          </label>
                        </div>
                        <div className="field">
                          <label>Parking</label>
                          <label className="switch">
                            <input name="parking"
                              type="checkbox"
                              value={this.state.parking}
                              onChange={this.handleCheckbox}>
                            </input>
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </div>
                      <div className="column">
                        <div className="field">
                          <label>Pet Friendly</label>
                          <label className="switch">
                            <input
                              name="pet_friendly"
                              type="checkbox"
                              value={this.state.pet_friendly}
                              onChange={this.handleCheckbox}>
                            </input>
                            <span className="slider round"></span>
                          </label>
                        </div>
                        <div className="field">
                          <label>Internet</label>
                          <label className="switch">
                            <input
                              name="internet"
                              type="checkbox"
                              value={this.state.internet}
                              onChange={this.handleCheckbox}>
                            </input>
                            <span className="slider round"></span>
                          </label>
                        </div>
                        <div className="field">
                          <label>Fully Furnished</label>
                          <label className="switch">
                            <input
                              name="furniture"
                              type="checkbox"
                              value={this.state.furniture}
                              onChange={this.handleCheckbox}>
                            </input>
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="columns">
                    <div className="column">
                      <a className="polygon button is-rounded is-large" onClick={this.toggleDraw.bind(this)}>
                        <span className="icon is-medium">
                          <i className="fab fa-bandcamp"></i>
                        </span>
                        <span>Polygon Search</span>
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </aside>
            <div className="map-container column is-9">
              <div className="App">
                <GoogleMapDrawFilter
                  drawMode={this.state.drawMode}
                  markers={this.state.otherMarkers}
                  mapConfig={mapConfig}
                  mapStyle={mapStyle}
                  polygonOptions={polygonOptions}
                  handleReturnedMarkers={this.handleReturnedMarkers.bind(this)}
                  onMarkerClick={this.onMarkerClick.bind(this)}
                  apiKey='AIzaSyADYWSlC4yEedJ-5lvQb9UFOVaMMux54Zc'
                />
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default GoogleApiWrapper({ apiKey: ('AIzaSyB8uJxSx8YzDb-Nm8CP9KB-egJe3mZF7OI') })(MapContainer)
