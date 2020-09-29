import React, { Component } from "react";
import { getFullName } from "nba-color";
import { Team } from "../../helpers/gameHistory";
import "./History.css";

const History = ({ gameDate, game }: { gameDate: string, game: Team}) => {
  return (
    <div className="History">
      <p>{gameDate}</p>
      <p>
        {(game || {}).full_name} beat{" "}
        {((game || {}).loser || {}).full_name}
      </p>
    </div>
  );
}

export default History;
