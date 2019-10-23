import React, { Component } from "react";
import { getMainColor, getFullName } from "nba-color";
import "./Header.css";

class Header extends Component {
  render() {
    const colorWay = this.props.theBelt ? getMainColor(this.props.theBelt) : "";
    const hexColorWay = colorWay.hex;
    const backgroundColorCSS = {
      backgroundColor: hexColorWay
    };
    return (
      <div className="Header" style={backgroundColorCSS}>
        <h4 className="Header-preheadline">- who has the belt? -</h4>
        <h1 className="Header-headline">
          {this.props.theBelt ? getFullName(this.props.theBelt) : ""}
        </h1>
      </div>
    );
  }
}

export default Header;
