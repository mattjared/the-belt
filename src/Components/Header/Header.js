import React, { Component } from 'react';
import { getMainColor, getFullName } from 'nba-color';
import './Header.css';

class Header extends Component {
  render() {
    const colorWay = getMainColor(this.props.theBelt);
    const hexColorWay = colorWay.hex;
    const backgroundColorCSS = {
      backgroundColor: hexColorWay, 
    }
    return (
      <div>
        <div className="Header" style={backgroundColorCSS}>
            <h1 className="Header-headline">Who has the belt?</h1>
            { getFullName(this.props.theBelt) }
        </div>
        <div className="StandInHeader">
          <h2>test thing is going on here.</h2>
          { getFullName(this.props.theBelt) }
        </div>
      </div>
    );
  }
}

export default Header;
