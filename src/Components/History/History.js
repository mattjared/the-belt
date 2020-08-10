import React, { Component } from "react";
import { getFullName } from "nba-color";
import "./History.css";

class History extends Component {
  render() {
    return (
      <div className="History">
        <p>{this.props.gameDate}</p>
        <p>
          {(this.props.game || {}).full_name} beat{" "}
          {((this.props.game || {}).loser || {}).full_name}
        </p>
      </div>
    );
  }
}

export default History;
