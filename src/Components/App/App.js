import React, { Component } from 'react';
import Header from '../Header/Header';
import { getFullName } from 'nba-color';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      theBelt: 'LAL',
      theChallenger: 'GSW',
    };
  }
  render() {
    console.log(getFullName(this.state.theBelt))
    return (
      <div className="App">
        <Header theBelt={this.state.theBelt} />
      </div>
    );
  }
}

export default App;
