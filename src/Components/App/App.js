import React, { Component } from 'react';
import Header from '../Header/Header';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      theBelt: 'LAL',
      theChallenger: 'GSW',
    };
  }
  render() {
    return (
      <div className="App">
        <Header theBelt={this.state.theBelt} />
      </div>
    );
  }
}

export default App;
