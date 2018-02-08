import React, { Component } from 'react';
import UserMenu from '../user-menu.jsx';
import axios from 'axios';

class NewListing extends Component {

  constructor() {
    super();
    this.state = {
      details: undefined,
      street: undefined,
      unit: undefined,
      city: undefined,
      postal_code: undefined,
      pet_friendly: false,
      rent_amount: undefined,
      deposit_amount: undefined,
      available_date: undefined,
      water: false,
      eletricity: false,
      internet: false,
      heat: false,
      natural_gas: false,
      storage: false,
      laundry_on_site: false,
      furniture: false,
      parking: false,
      file: "",
      imagePreviewUrl: "",
    }
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addListing = this.addListing.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
  }

  handleCheckbox(event) {
    const name = event.target.name;
    if (this.state[name] === false) {
      this.setState({
        [name]: true
      });
    }
    else {
      this.setState({
        [name]: false
      });
    }
  }

  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value
    });
  }

  handleImageChange(event) {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
      console.log(reader.result);
    }
    reader.readAsDataURL(file)
  }


  checkRequiredFields() {
    const listing = this.state;
    const required_fields = ['street', 'city', 'rent_amount', 'available_date'];
    for (let field of required_fields) {
      console.log(`listing.${field}`, listing[field]);
      if (!listing[field]) {
        alert(`${field} is required.`);
        return false;
      }
    }
    return true;
  }

  addListing(event) {
    const user = JSON.parse(localStorage.getItem('user'));
    event.preventDefault();
    const listing = this.state;
    if (this.checkRequiredFields()) {
      axios.post('api/rooms', {
        details: listing.details,
        street: listing.street,
        unit: listing.unit,
        city: listing.city,
        postal_code: listing.postal_code,
        pet_friendly: listing.pet_friendly,
        rent_amount: listing.rent_amount,
        available_date: listing.available_date,
        water: listing.water,
        eletricity: listing.eletricity,
        internet: listing.internet,
        heat: listing.heat,
        natural_gas: listing.natural_gas,
        storage: listing.storage,
        laundry_on_site: listing.laundry_in_site,
        furniture: listing.furniture,
        parking: listing.parking,
        file: listing.imagePreviewUrl,
        landlord_id: user.id,
        landlord_email: user.email
      })
        .then(function (response) {
          console.log(response);
          if(response.statusText === "Created"){
            alert("Listing created with success.");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  render() {
    return (
      <div>
        <UserMenu/>
        <div className="listing-form container animated fadeIn">
          <div className="columns is-10 is-offset-1">
            <section className="column">
              <div className="container">
                <div className="columns">
                  <div className="column">
                    <h1>Select a main image:</h1>
                    <form>
                      <div className="columns">
                        <div className="column">
                          <input type="file" onChange={this.handleImageChange} />
                        </div>
                        <img src={this.state.imagePreviewUrl} />
                      </div>
                      <div className="columns">
                        <div className="column">
                          <label>
                            Street:
                            <input
                              className="input is-rounded"
                              name="street"
                              type="text"
                              value={this.state.street}
                              onChange={this.handleInputChange}
                            />
                          </label>
                        </div>
                        <div className="column">
                          <label>
                            Unit:
                            <input
                              className="input is-rounded"
                              name="unit"
                              type="text"
                              value={this.state.unit}
                              onChange={this.handleInputChange}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="columns">
                        <div className="column">
                          <label>
                            City:
                            <input
                              className="input is-rounded"
                              name="city"
                              type="text"
                              value={this.state.city}
                              onChange={this.handleInputChange}
                            />
                          </label>
                        </div>
                        <div className="column">
                          <label>
                            Postal Code:
                            <input
                              className="input is-rounded"
                              name="postal_code"
                              type="text"
                              value={this.state.postal_code}
                              onChange={this.handleInputChange}
                            />
                          </label>
                        </div>
                      </div>
                      <div className="columns">
                        <div className="column">
                          <label>
                            Rent amount:
                            <input
                              className="input is-rounded"
                              name="rent_amount"
                              type="number"
                              value={this.state.rent_amount}
                              onChange={this.handleInputChange}
                            />
                          </label>
                        </div>
                        <div className="column">
                          <div className="control has-icons-left">
                            <input
                              className="input is-rounded"
                              name="available_date"
                              type="date"
                              value={this.state.available_date}
                              onChange={this.handleInputChange}
                            />
                            <span className="icon is-small is-left">
                              <i className="fas fa-calendar"></i>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="columns">
                        <div className="column">
                          <label>
                            Details:
                            <input
                              className="textarea is-rounded"
                              name="details"
                              type="textarea"
                              value={this.state.details}
                              onChange={this.handleInputChange}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="columns">

                      </div>

                      <div className="columns">
                        <div className="column">
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
                        </div>
                        <div className="column">
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
                                      name="furnished"
                                      type="checkbox"
                                      value={this.state.furnished}
                                      onChange={this.handleCheckbox}>
                                    </input>
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button className="button is-primary is-rounded is-large" type="submit" onClick={this.addListing}>Submit</button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }
}

export default NewListing;
// export default GoogleApiWrapper({apiKey: ('AIzaSyB8uJxSx8YzDb-Nm8CP9KB-egJe3mZF7OI')})(NewListing)
