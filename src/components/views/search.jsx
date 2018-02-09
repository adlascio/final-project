import React, {Component} from 'react';
import ListingMarker from '../listing-marker.jsx';
import SearchCriteria from '../search-criteria.jsx';
import axios from 'axios';

class Search extends Component {
  constructor() {
    super();
    this.state = {
      rooms: []
    }
  }

  getRooms() {
    let rooms = [];
    axios.get('/api/rooms/')
      .then((response) => {
        rooms = response.data;
        this.setState({rooms: rooms});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.getRooms();
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="columns">
            <SearchCriteria />
            <section className="column is-9 map">
              <div className="container">
              { this.state.rooms.map(rooms =>
                <li key={rooms.id}>
                  <div className="circle">
                    <a href="#">
                      <img src="/images/house.jpg"></img>
                    </a>
                  </div>
                  <span>{rooms.id} - {rooms.street} {rooms.city}</span>
                </li>
              )}
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }
}

export default Search;
