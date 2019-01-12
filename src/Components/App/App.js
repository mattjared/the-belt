import React, { Component } from 'react';
import Header from '../Header/Header';
import Next from '../Next/Next';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      theBelt: 'NYK',
      theChallenger: 'GSW',
    };
  }
  render() {
    return (
      <div className="App">
        <Header theBelt={this.state.theBelt} />
        <Next theBelt={this.state.theBelt} />
      </div>
    );
  }
}

export default App;
