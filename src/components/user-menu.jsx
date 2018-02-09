import React, {Component} from 'react';

class UserMenu extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <div className="top-padding container">
          <div className="columns">
            <section className="column">
              <div className="container">
                <div className="tabs is-centered">
                  <ul>
                    <li>
                      <a href="/#/user/settings">My Preferences</a>
                    </li>
                    <li>
                      <a href="/#/user/listings">My Listings</a>
                    </li>
                    <li>
                      <a href="/#/listing/new">Add New Listing</a>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }
}

export default UserMenu;