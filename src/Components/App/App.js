import React, { Component } from "react";
import Header from "../Header/Header";
import Next from "../Next/Next";
import History from "../History/History";
import axios from "axios";
import moment from "moment";
import { getPrevChampion, buildBeltPath } from "../../helpers/gameHistory";
import "./App.css";

const bbApi = `https://www.balldontlie.io/api/v1/games?seasons[]=`;

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
        : [],
    };
  }
  componentDidMount() {
    const season = 2019;
    axios
      .get(`${bbApi}${season - 1}&start_date=${season}-06-01`)
      .then((res) => {
        const lastGame = res.data.data[res.data.data.length - 1];
        const champ = getPrevChampion(lastGame);
        this.setState({ champion: champ }, () => {
          localStorage.setItem("champion", JSON.stringify(champ));
          axios
            .get(`${bbApi}${season}&start_date=${season}-06-01`)
            .then((res) => {
              const allGames = [];
              const getPage = async (page = 1) => {
                await axios
                  .get(`${bbApi}${season}&per_page=100&page=${page}`)
                  .then((d) => {
                    allGames.push(...d.data.data);
                    return allGames;
                  });
              };
              const getNumberOfPages = async () => {
                return await axios
                  .get(`${bbApi}${season}&per_page=100&page=1`)
                  .then((d) => {
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
                await Promise.all(pageNumbers.map((pg) => getPage(pg)));
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
                getAllPages().then((d) => {
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
        <Header theBelt={this.state.currentChamp} />
        {this.state.beltPath.reverse().map((game) => (
          <div>
            <History
              gameDate={moment(game.date)
                .add(1, "days")
                .format("LL")}
              game={game}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default App;
