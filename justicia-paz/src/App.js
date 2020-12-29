import React, { Component } from 'react';
import Frecuencias from './Frecuencias';
import Relaciones from './Relaciones';
import {csv} from "d3-fetch";
import {ascending} from "d3-array";
import csvFile from "./data/hechos_por_sentencia.csv";

class App extends Component {
  state = {
    sentenciasCompletas: [],
    sentenciasFiltradas:[],
    data: [],
    filtradas: false
  }

  updateSentencias = (sentencias) => {  

    if(sentencias.length > 0) {
      this.setState({
        sentenciasFiltradas: sentencias,
        filtradas: true
      })
    } else {
      this.setState({
        sentenciasFiltradas: this.state.sentenciasCompletas,
        filtradas: false
      })
    }
  }

  componentWillMount() {
    csv(csvFile)
      .then(data => {
        data.forEach(d => {
          let total = 0
          let keys = Object.keys(d);
         
          for ( var i = 1; i < keys.length; i++ ) {
            total += Number(d[keys[i]]);
          }
          d['total'] = total
        })

        let sen = data.map((d) =>  d.sentencia)
        sen.sort((a, b) => ascending(a, b));

        this.setState({ 
          sentenciasCompletas: sen,
          sentenciasFiltradas: sen,
          data: data
        });

      }).catch(error => {
        console.log('Error: ', error)
    })
  }

  renderViz() {
    if (this.state.data.length === 0) {
      return "no data yet"
    } else {
      return < >
      <Relaciones updateSentencias={this.updateSentencias}/>
      <Frecuencias sentencias={this.state.sentenciasFiltradas}
                   data={this.state.data}
                   filtradas={this.state.filtradas}/>
      </>
    }
  }

  render() {
    return (
      <div className="App">  
        {this.renderViz()}
      </div>
    )
  }
}

export default App;
