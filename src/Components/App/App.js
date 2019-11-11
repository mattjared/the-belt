import React, { Component } from "react";
import Header from "../Header/Header";
import Next from "../Next/Next";
import History from "../History/History";
import axios from "axios";
import moment from "moment";

const getPrevChampion = lastGame => {
  const homeWon = lastGame.home_team_score > lastGame.visitor_team_score;
  return homeWon
    ? { ...lastGame.home_team, date: lastGame.date }
    : { ...lastGame.visitor_team, date: lastGame.date };
};

const buildBeltPath = (prevChamp, allGames) => {
  const champsFirstGameIndex = allGames.findIndex(
    game =>
      game.visitor_team.full_name === prevChamp.full_name ||
      game.home_team.full_name === prevChamp.full_name
  );
  let count = 0;
  console.log("build!!!", prevChamp, allGames, champsFirstGameIndex);
  const beltWinners = allGames.reduce((acc, curr, i) => {
    const first = allGames[champsFirstGameIndex];
    const champWasHome = first.home_team.full_name === prevChamp.full_name;
    if (curr.status !== "Final") {
      return acc;
    } else {
      count++;
      if (i === 0) {
        const champWon = champWasHome
          ? first.home_team_score > first.visitor_team_score
          : first.visitor_team_score > first.home_team_score;
        acc[0] = champWon
          ? { ...prevChamp, date: first.date, gameIndex: champsFirstGameIndex }
          : champWasHome
          ? {
              ...first.visitor_team,
              date: first.date,
              gameIndex: champsFirstGameIndex
            }
          : {
              ...first.home_team,
              date: first.date,
              gameIndex: champsFirstGameIndex
            };
        return acc;
      } else {
        console.log("in other else", curr);
        if (acc[i - 1]) {
          const nextGames = allGames.slice(
            acc[i - 1].gameIndex + 1,
            allGames.length
          );
          const nextChampGame = nextGames.find(game => {
            return (
              (game.home_team.full_name === acc[i - 1].full_name ||
                game.visitor_team.full_name === acc[i - 1].full_name) &&
              game.date !== acc[i - 1].date
            );
          });
          if (nextChampGame) {
            const nextGameIndex = allGames.findIndex(
              game => game.id === nextChampGame.id
            );
            const winner = getPrevChampion(nextChampGame);
            acc[i] = { ...winner, gameIndex: nextGameIndex };
          }
          return acc;
        }
        return acc;
      }
    }
  }, []);
  const invalid = beltWinners.findIndex(
    winner =>
      moment(winner.date).format("YYYYMMDD") >
      moment(new Date()).format("YYYYMMDD")
  );
  const validWinners = beltWinners.slice(0, invalid - 1);
  return validWinners;
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theBelt: "MEM",
      theChallenger: "GSW",
      beltPath: [],
      champion: localStorage.getItem("champion")
        ? JSON.parse(localStorage.getItem("champion") || {})
        : {},
      currentChamp: "",
      games: localStorage.getItem("games")
        ? JSON.parse(localStorage.getItem("games") || [])
        : []
    };
  }
  componentDidMount() {
    const season = 2019;
    axios
      .get(
        `https://www.balldontlie.io/api/v1/games?seasons[]=${season -
          1}&start_date=${season}-06-01`
      )
      .then(res => {
        const lastGame = res.data.data[res.data.data.length - 1];
        const champ = getPrevChampion(lastGame);
        this.setState({ champion: champ }, () => {
          localStorage.setItem("champion", JSON.stringify(champ));
          axios
            .get(
              `https://www.balldontlie.io/api/v1/games?seasons[]=${season}&start_date=${season}-06-01`
            )
            .then(res => {
              const games = res.data.data;
              const lastGame = games[games.length - 1];
              const visitorWon =
                lastGame.visitor_team_score > lastGame.home_team_score;
              const champion = visitorWon
                ? lastGame.visitor_team
                : lastGame.home_team;

              const allGames = [];
              const getPage = async (page = 1) => {
                await axios
                  .get(
                    `https://www.balldontlie.io/api/v1/games?seasons[]=${season}&per_page=100&page=${page}`
                  )
                  .then(d => {
                    allGames.push(...d.data.data);
                    return allGames;
                  });
              };
              const getNumberOfPages = async () => {
                return await axios
                  .get(
                    `https://www.balldontlie.io/api/v1/games?seasons[]=${season}&per_page=100&page=1`
                  )
                  .then(d => {
                    return d.data.meta.total_pages;
                  });
              };
              const getAllPages = async () => {
                const numberOfPages = await getNumberOfPages();
                let currentPage = 1;
                const pageNumbers = [];
                while (currentPage <= numberOfPages) {
                  pageNumbers.push(currentPage);
                  currentPage++;
                }
                await Promise.all(pageNumbers.map(pg => getPage(pg)));
                allGames.sort(
                  (a, b) =>
                    moment(a.date).format("YYYYMMDD") -
                    moment(b.date).format("YYYYMMDD")
                );
                return allGames;
              };
              if (
                !localStorage.getItem("games") ||
                !localStorage.getItem("champion")
              ) {
                getAllPages().then(d => {
                  const prevChamp = getPrevChampion(d[d.length - 1]);
                  buildBeltPath(this.state.champion, allGames);
                  this.setState({ games: d }, () => {
                    localStorage.setItem("games", JSON.stringify(d));
                  });
                });
              } else {
                const beltPath = buildBeltPath(
                  JSON.parse(localStorage.getItem("champion")),
                  JSON.parse(localStorage.getItem("games"))
                );
                const currentChamp =
                  beltPath[beltPath.length - 1].abbreviation || "";
                this.setState({ beltPath, currentChamp });
              }
              getPage();
            });
        });
      });
  }

  render() {
    return (
      <div className="App">
        {/* <Header theBelt={this.state.theBelt} />
        <Next theBelt={this.state.theBelt} />
        {this.state.games.map((games, i) => {
          const gameDate = new Date(games.badges.due);
          const teams = games.labels;
          return (
            <History
              key={i}
              gameDate={moment(gameDate).format("LL")}
              gameTeams={teams}
            />
          );
        })} */}
        <Header theBelt={this.state.currentChamp} />
        {this.state.beltPath.map(winner => (
          <div>
            <p>{winner.full_name}</p>
            <p>{winner.date}</p>
          </div>
        ))}
      </div>
    );
  }
}

export default App;
