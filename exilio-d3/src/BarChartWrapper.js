import React, { Component } from 'react';
import BarChart from './BarChart';

class BarChartWrapper extends Component {

  constructor(props) {
    super(props);

    this.state = {
      buckets: []
    };

    this.getBuckets = this.getBuckets.bind(this);
  }

  getBuckets() {

    const uniqueRows = [];
    const map = new Map();

    this.props.data.forEach(element => {

      if(!map.has(element[this.props.uniqueField])){  

        map.set(element[this.props.uniqueField], true);    // set any value to Map
        
        uniqueRows.push({
            id: this.props.uniqueField,
            [this.props.bucketsField]: element[this.props.bucketsField]
        });
    }
      
    });

    let bucketsArray = [...new Set(uniqueRows.map(d => d[this.props.bucketsField]))];
    let buckets = []

    bucketsArray.forEach((bucket,i) => {
      buckets[i] = { 
        name: bucket,
        value: 0
      }
    })

    uniqueRows.forEach((d) => {
      for (var i = 0; i < buckets.length; i++) {
        if (d[this.props.bucketsField] === buckets[i].name) {
          buckets[i].value++
        }
      }
    })

    this.setState({
      buckets: buckets
    })  

  }

  componentWillMount() {
    this.getBuckets();
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      this.getBuckets()
    }
  }

  // componentDidMount() {
  //   if(this.props.data.length > 0) {
  //     this.getBuckets();
  //   }
  // }

  shouldComponentUpdate(newProps, newState) {
    
    if(this.props !== newProps && newProps.data.length > 0) {
      return true;
    } else {
      return false
    }

  }

  render() {
    var cardStyle = {
      backgroundColor: this.props.bgColor
    };

    return (
      <div className="viz-bar-chart viz-card" style={cardStyle}>
        <h5> {this.props.title} </h5>
          <BarChart buckets={this.state.buckets}/> 
      </div>
      
    )
  }
}

export default BarChartWrapper