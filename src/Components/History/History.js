import React, { Component } from 'react';
import { getFullName } from 'nba-color';
import './History.css';

class History extends Component {
  render() {
    console.log(this.props.gameTeams);
    return (
      <div className="History">
        <p>{this.props.gameDate}</p>
        {this.props.gameTeams.map((teams) => {
          return (
            <p key={teams.name}>{ getFullName(teams.name) }</p>  
          )
        })}
      </div>
    );
  }
}

export default History;
