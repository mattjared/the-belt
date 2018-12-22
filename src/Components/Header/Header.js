import React, { Component } from 'react';
import logo from './logo.svg';
import { getMainColor } from 'nba-color';
import './Header.css';

class Header extends Component {
  render() {
    console.log(this.props.theBelt)
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
