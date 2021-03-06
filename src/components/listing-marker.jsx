import React, {Component} from 'react';
import Search from './views/search.jsx';

class ListingMarker extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <div className="circle">
          <a href="/#/listing">
            <img src="/images/house.jpg"></img>
          </a>
        </div>
      </div>
    );
  }
}

export default ListingMarker;
