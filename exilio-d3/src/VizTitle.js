import React, { Component } from 'react';

class VizTitle extends Component {

  render() {
  
    var cardStyle = {
      backgroundColor: this.props.bgColor,
      color: this.props.color
    };

    return <div className="viz-title viz-card center" style={cardStyle}>
      <h1>{this.props.title}</h1>
      <p>{this.props.subheading}</p>
    </div>

  }
}

export default VizTitle;