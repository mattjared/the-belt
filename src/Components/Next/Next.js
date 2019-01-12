import React, { Component } from 'react';
import './Next.css';

class Next extends Component {
  render() {
    return (
      <div className="Next">
        {this.props.theBelt}
      </div>
    );
  }
}

export default Next;
