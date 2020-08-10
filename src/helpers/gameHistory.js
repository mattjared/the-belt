import moment from "moment";

export const getPrevChampion = (lastGame) => {
  const homeWon = lastGame.home_team_score > lastGame.visitor_team_score;
  return homeWon
    ? { ...lastGame.home_team, date: lastGame.date }
    : { ...lastGame.visitor_team, date: lastGame.date };
};

export const getPrevLoser = (lastGame) => {
  const homeWon = lastGame.home_team_score > lastGame.visitor_team_score;
  return homeWon
    ? { ...lastGame.visitor_team, date: lastGame.date }
    : { ...lastGame.home_team, date: lastGame.date };
};

export const buildBeltPath = (prevChamp, allGames) => {
  const champsFirstGameIndex = allGames.findIndex(
    (game) =>
      game.visitor_team.full_name === prevChamp.full_name ||
      game.home_team.full_name === prevChamp.full_name
  );
  const beltWinners = allGames.reduce((acc, curr, i) => {
    const first = allGames[champsFirstGameIndex];
    if (curr.status !== "Final") {
      return acc;
    } else {
      if (i === 0) {
        // first time around, find the previous season champ's
        // first game of this season
        acc[0] = {
          ...getPrevChampion(first),
          ...first,
          loser: getPrevLoser(first),
        };
        return acc;
      } else {
        if (acc[i - 1]) {
          const nextGames = allGames.slice(
            acc[i - 1].gameIndex + 1,
            allGames.length
          );
          const nextChampGame = nextGames.find((game) => {
            return (
              (game.home_team.full_name === acc[i - 1].full_name ||
                game.visitor_team.full_name === acc[i - 1].full_name) &&
              game.date !== acc[i - 1].date
            );
          });
          if (nextChampGame) {
            const nextGameIndex = allGames.findIndex(
              (game) => game.id === nextChampGame.id
            );
            const winner = getPrevChampion(nextChampGame);
            const loser = getPrevLoser(nextChampGame);
            acc[i] = {
              ...winner,
              gameIndex: nextGameIndex,
              loser,
            };
          }
          return acc;
        }
        return acc;
      }
    }
  }, []);
  const invalid = beltWinners.findIndex(
    (winner) =>
      Number(moment(winner.date).format("YYYYMMDD")) >
      Number(moment(new Date()).format("YYYYMMDD")) + 1
  );
  // I'm not how future games are even getting to this point
  // but moving on right now...
  const validWinners = beltWinners.slice(0, invalid - 1);
  return validWinners;
};