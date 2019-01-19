import React, { Component } from 'react';
import Header from '../Header/Header';
import Next from '../Next/Next';
import History from '../History/History'
import axios from 'axios';
import moment from 'moment';

const apiKey = '5fc2fd27017d3cba6249724c1ee851bd7badfe04bc77a6ea6abeff03ded64134';
const leagueId = '787';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      champion: undefined,
      theBelt: 'MEM',
      theChallenger: 'GSW',
      games: []
    };
  }

  getNextChampion = () => {
    // this mess needs to move to firebase but putting it here for now
    // because idk how to work those firebase functions yet
    const { champion, date: evtDate } = this.state;
    const currentMonth = Number(evtDate.split('-')[1]);
    const currentDay = Number(evtDate.split('-')[2]);
    const currentYear = Number(evtDate.split('-')[0]);
    const nextMonth = currentMonth < 12 ? Number(currentMonth) + 1 : 1;
    const year = nextMonth === 1 ? Number(evtDate.split('-')[0]) + 1 : evtDate.split('-')[0];
    const day = evtDate.split('-')[2];
    const nextDate = `${year}-${nextMonth}-${day}`;
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1;
    const day2 = dateObj.getUTCDate();
    const year2 = dateObj.getUTCFullYear();
    const newdate = year2 + "-" + month + "-" + day2;

    axios.get(`https://allsportsapi.com/api/basketball/?met=Fixtures&APIkey=${apiKey}&leagueId=${leagueId}&from=${moment([currentYear, currentMonth - 1, currentDay]).add(1, 'day').format().split('T')[0]}&to=${moment([currentYear, currentMonth - 1, currentDay]).add(1, 'month').format().split('T')[0]}`).then(res => {
      if (res.data && res.data.result && !(res.data.result.length === 1 && res.data.result[0].event_date === evtDate)) {
        const gamesPlayed = res.data.result.reverse().filter(game => game.event_home_team === champion || game.event_away_team === champion) || []
        const championUntil = gamesPlayed.find(game => {
          const isHome = game.event_home_team === champion;
          const [homePts, awayPts] = game.event_final_result.split(' - ');
          return isHome ? Number(homePts) < Number(awayPts) : Number(homePts) > Number(awayPts);
        });
        const newChampion = championUntil ? (championUntil.event_home_team === champion ? championUntil.event_away_team : championUntil.event_home_team) : champion;
        this.setState({ champion: newChampion, date: championUntil ? championUntil.event_date : newdate }, () => {
          if (this.state.date !== newdate) {
            this.getNextChampion()
          }
        });
      } else {
        this.setState({ date: nextDate });
        this.getNextChampion();
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { champion } = this.state;
    // make this dynamic
    const startDate = '2018-10-15';
    const endDate = '2019-7-1'
    if (!prevState.champion && champion) {
      this.getNextChampion();
    }
  }
  componentDidMount() {
    axios.get(`https://allsportsapi.com/api/basketball/?met=Fixtures&APIkey=${apiKey}&leagueId=${leagueId}&from=2018-6-1&to=2018-7-1`).then(res => {
      const lastGame = res.data.result[0];
      const determineChampion = () => {
        const [homePts, awayPts] = lastGame.event_final_result.split(' - ');
        const homeWon = Number(homePts) > Number(awayPts);
        return homeWon ? lastGame.event_home_team : lastGame.event_away_team;
      }
      this.setState({ champion: determineChampion(), date: '2018-10-16' });
    });
    axios.get('https://api.trello.com/1/lists/5c3a5f3066596b37b3f656b6/cards')
    .then(res => {
      const games = res.data;
      this.setState({ games })
    })
  };
  render() {
    return (
      <div className="App">
        <Header theBelt={this.state.theBelt} />
        <Next theBelt={this.state.theBelt} />
        {this.state.games.map((games, i) => {
          const gameDate = new Date(games.badges.due);
          const teams = games.labels;
          return (
            <History
              key={i}
              gameDate={moment(gameDate).format('LL')}
              gameTeams={teams}
            />
          ) 
        })}
      </div>
    );
  }
}

export default App;
