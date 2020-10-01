import React from "react";
import { Team } from "../../helpers/gameHistory";
import "./History.css";

const History = ({ gameDate, game }: { gameDate: Date, game: Team}) => {
  const d = new Date(gameDate);
  const month = d.getMonth();
  const day = d.getDate();
  const year = d.getFullYear();
  const formattedDate = `${month + 1}/${day + 1}/${year}`;
  return (
    <div className="History">
      <p>{formattedDate}</p>
      <p>
        {(game || {}).full_name} beat{" "}
        {((game || {}).loser || {}).full_name}
      </p>
    </div>
  );
}

export default History;
