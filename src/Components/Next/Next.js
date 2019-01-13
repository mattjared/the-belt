import React, { Component } from 'react';
import './Next.css';

class Next extends Component {
  render() {
    return (
      <div className="Next">
        {this.props.theBelt}
        <h2>Their title match is against  on . </h2>        
      </div>
    );
  }
}

export default Next;
