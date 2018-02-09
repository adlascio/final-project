import React from 'react';
import {Route, Switch, Link} from 'react-router-dom';
import ReactDom from 'react-dom';
import Navbar from './components/navbar.jsx';
import Home from './components/views/home.jsx';
import Search from './components/views/search.jsx';
import MapContainer from './components/GoogleApiWrapper.jsx';
import Listing from './components/views/listing.jsx';
import NewListing from './components/views/listing-new.jsx';
import Inbox from './components/views/inbox.jsx';
import UserSettings from './components/views/user-settings.jsx';
import UserApplications from './components/views/user-applications.jsx';
import UserListings from './components/views/user-listings.jsx';


class Routes extends React.Component {
  render() {
    return (
      <div>
        <main>
          <Navbar />
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/search" exact component={MapContainer}/>
            <Route path="/listing" exact component={Listing}/>
            <Route path="/listing/new" exact component={NewListing}/>
            <Route path="/inbox" exact component={Inbox}/>
            <Route path="/user/settings" exact component={UserSettings}/>
            <Route path="/user/applications" exact component={UserApplications}/>
            <Route path="/user/listings" exact component={UserListings}/>
          </Switch>
        </main>
      </div>
    )
  }
}

export { Routes };
