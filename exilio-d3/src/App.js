import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {csv} from "d3-fetch";
import csvFile from "./data/exilio.csv";
import VizTitle from './VizTitle';
import NumRegistros from './NumRegistros';
import BarChartWrapper from './BarChartWrapper';

const uniqueField = "CONS_PER"

class App extends Component {
  state = {
    data: []
  }

  componentWillMount() {
    csv(csvFile)
      .then(data => {       
        this.setState({ 
          data: data
        });

      }).catch(error => {
        console.log('Error: ', error)
    })
  }

  shouldComponentUpdate(newProps, newState) {
    if(this.state !== newState && newState.data.length > 0) {
      return true
    } else {
      return false
    }
  }

  renderViz() {
    if(this.state.data.length > 0) {
      
      return <Container>
              <Row> {/* Panel de titulo y total de registros */}

                <Col lg={9}> {/* Titulo de la visualización */}
                  <VizTitle title="Población exiliada"
                            subheading="El tablero contiene la información de las víctimas declarantes en el exterior en el Registro Único de Víctimas (RUV) de la UARIV, que son exiliados por el conflicto armado colombiano. La información se encuentra desde 1958 hasta 2019 y contiene diferente información sociodemográfica, así como el hecho victimizante que sufrieron, el país en donde se declara y el año en donde sufrieron estos hechos."
                            bgColor="#F8CF61"
                            color="#003467"
                  /> 
                </Col>

                <Col lg={3}> {/* Componente número de registros */}
                  <NumRegistros tipo="víctimas"
                            bgColor="#F7F7F7"
                            color="#003467"
                            data= {this.state.data}
                            uniqueField= {uniqueField}
                  /> 
                </Col>
              </Row>
              <Row> 
                <Col lg={3}> {/* Panel de visualizaciones */}
                  <BarChartWrapper title="Pertenencia étnica de las víctimas"
                                  data={this.state.data}
                                  bucketsField="PERT_ETNICA"
                                  bgColor="#FFF8F2"
                                  uniqueField={uniqueField}
                  />
                </Col>
              </Row>
            </Container>
    } else {
      return <h1> No hay datos aún </h1>
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
