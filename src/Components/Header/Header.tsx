import React from "react";
import { getMainColor, getFullName } from "nba-color";
import "./Header.css";

const Header = ({ theBelt }: { theBelt: string }): JSX.Element => {
  const colorWay = theBelt ? getMainColor(theBelt) : { hex: ''};
    const hexColorWay = colorWay.hex;
    const backgroundColorCSS = {
      backgroundColor: hexColorWay
    };
    return (
      <div className="Header" style={backgroundColorCSS}>
        <h4 className="Header-preheadline">- who has the belt? -</h4>
        <h1 className="Header-headline">
          {theBelt ? getFullName(theBelt) : ""}
        </h1>
      </div>
    );
}

export default Header;
