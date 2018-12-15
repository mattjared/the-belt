import React, { Component } from 'react';
import logo from './logo.svg';
import './Header.css';

class Header extends Component {
  render() {
    return (
      <div className="Header">
          <img src={logo} className="Header-logo" alt="logo" />
          <h1 className="Header-headline">Who has the belt?</h1>
          { this.props.theBelt }
      </div>
    );
  }
}

export default Header;
