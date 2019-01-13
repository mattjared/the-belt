import React, { Component } from 'react';
import Header from '../Header/Header';
import Next from '../Next/Next';
import History from '../History/History'
import axios from 'axios';
import moment from 'moment';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      theBelt: 'MEM',
      theChallenger: 'GSW',
      games: []
    };
  }
  componentDidMount() {
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
