import React, { Component } from 'react';
import {format} from "d3-format";

class NumRegistros extends Component {

  constructor(props) {
    super(props);
 
    this.state = {
      rows: 0
    };

    this.getRowsNumber = this.getRowsNumber.bind(this);
  }

  /* Obtener numero de filas y formatearlas */
  getRowsNumber() {
    var formato = format(",");
    
    let uniqueValues = [...new Set(this.props.data.map(d => d[this.props.uniqueField]))];
    
    this.setState({
      rows: formato(uniqueValues.length)
    })
  }

  componentWillMount() {
    this.getRowsNumber()
  }

  /* comparar que haya nuevos datos */
  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      this.getRowsNumber()
    }
  }

  render() {
    var cardStyle = {
      backgroundColor: this.props.bgColor,
      color: this.props.color
    };

    return <div className="num-registros viz-card text-center center" style={cardStyle}>
      <h1>
        {this.state.rows} {this.props.tipo}
      </h1>
    </div>

  }
}

export default NumRegistros