import React, { Component } from 'react';
import Header from '../Header/Header';
import Next from '../Next/Next';
import History from '../History/History'
import axios from 'axios';
import moment from 'moment';

const baseUrl = 'https://allsportsapi.com/api/basketball/?met=Fixtures&APIkey=';
const apiKey = '5fc2fd27017d3cba6249724c1ee851bd7badfe04bc77a6ea6abeff03ded64134';
const leagueId = '787';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      beltHolder: undefined,
      theBelt: 'MEM',
      theChallenger: 'GSW',
      games: []
    };
  }

  getNextBeltHolder = () => {
    // this mess needs to move to firebase but putting it here for now
    // because idk how to work those firebase functions yet
    const { beltHolder, date: evtDate } = this.state;
    const currentMonth = Number(evtDate.split('-')[1]);
    const currentDay = Number(evtDate.split('-')[2]);
    const currentYear = Number(evtDate.split('-')[0]);
    const currDate = moment([currentYear, currentMonth - 1, currentDay]).add(1, 'day').format().split('T')[0];
    const nextDate = moment([currentYear, currentMonth - 1, currentDay]).add(1, 'month').format().split('T')[0];

    axios.get(`${baseUrl}${apiKey}&leagueId=${leagueId}&from=${currDate}&to=${nextDate}`).then(res => {
      if (res.data && res.data.result && !(res.data.result.length === 1 && res.data.result[0].event_date === evtDate)) {
        // get all the games the current beltHolder has played during the month
        const gamesPlayed = res.data.result.reverse().filter(game => game.event_home_team === beltHolder || game.event_away_team === beltHolder) || []

        // Find the game they lost
        const beltHolderUntil = gamesPlayed.find(game => {
          const isHome = game.event_home_team === beltHolder;
          const [homePts, awayPts] = game.event_final_result.split(' - ');
          return isHome ? Number(homePts) < Number(awayPts) : Number(homePts) > Number(awayPts);
        });

        // Get the winner of that game
        const newBeltHolder = beltHolderUntil ? (beltHolderUntil.event_home_team === beltHolder ? beltHolderUntil.event_away_team : beltHolderUntil.event_home_team) : beltHolder;
        this.setState({ beltHolder: newBeltHolder, date: beltHolderUntil ? beltHolderUntil.event_date : nextDate }, () => {
          // keep getting the next beltHolder till we're current
          if (this.state.date !== nextDate) {
            this.getNextBeltHolder()
          }
        });
      } else {
        // no games this month for the current belt holder
        // get next month
        this.setState({ date: nextDate });
        this.getNextBeltHolder();
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { beltHolder } = this.state;
    // make this dynamic
    const startDate = '2018-10-15';
    const endDate = '2019-7-1'
    if (!prevState.beltHolder && beltHolder) {
      this.getNextBeltHolder();
    }
  }
  componentDidMount() {
    axios.get(`https://allsportsapi.com/api/basketball/?met=Fixtures&APIkey=${apiKey}&leagueId=${leagueId}&from=2018-6-1&to=2018-7-1`).then(res => {
      const lastGame = res.data.result[0];
      const determineBeltHolder = () => {
        const [homePts, awayPts] = lastGame.event_final_result.split(' - ');
        const homeWon = Number(homePts) > Number(awayPts);
        return homeWon ? lastGame.event_home_team : lastGame.event_away_team;
      }
      this.setState({ beltHolder: determineBeltHolder(), date: '2018-10-16' });
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
