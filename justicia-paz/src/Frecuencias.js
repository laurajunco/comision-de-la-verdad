import React, { Component } from 'react';
import BubbleWrapper from './BubbleWrapper';
import BarWrapper from './BarWrapper';
import SentenciasDropdown from './SentenciasDropdown';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


class Frecuencias extends Component {
  state = {
    data: [],
    sentencias: [],
    activeSentencia: "todas",
    filtradas: false
  }

  updateName = (name) => {
    console.log(name)

    this.setState({
      activeSentencia: name
    })
  }

  componentWillMount() {
    this.setState({ 
      data: this.props.data,
      sentencias: this.props.sentencias
    });
  }

  componentWillReceiveProps(nextProps) {

    if(this.props !== nextProps) {
      let sentencias = nextProps.sentencias

      let filteredData = nextProps.data.filter(d => {
        let sentenciaName = 'sentencia_' + d.sentencia.split("_")[0]
          return sentencias.includes(sentenciaName)
      })

      if(nextProps.filtradas) {
        let newNames = []
        filteredData.forEach(d =>
          newNames.push(d.sentencia)
        )

        this.setState({ 
          sentencias: newNames,
          data: filteredData,
          filtradas: true,
          activeSentencia: "todas",
        });
      } else {

        let names = []
          nextProps.data.forEach(d =>
            names.push(d.sentencia)
          )
        this.setState({ 
          sentencias: names,
          data: nextProps.data,
          activeSentencia: "todas",
        });

      }
    }
  }
  
  renderBubbleChart() {
    if (this.state.data.length === 0) {
      return "no data yet"
    } else {
      return  <BubbleWrapper 
                  data={this.state.data} 
                  updateName ={this.updateName}
                  activeSentencia = {this.state.activeSentencia}
              />
    }
  }

  renderBarChart() {
    if (this.state.data.length === 0) {
      return "no data yet"
    } else {
      return  <BarWrapper 
                data={this.state.data} 
                activeSentencia = {this.state.activeSentencia}
                />
    }
  }

  renderDropdown() {
    if (this.state.sentencias.length === 0) {
      return "no data yet"
    } else {
      return  <SentenciasDropdown
                sentencias={this.state.sentencias} 
                updateName ={this.updateName}
                activeSentencia = {this.state.activeSentencia}
                filtradas = {this.state.filtradas}
              />
    }
  }
  
  render() {
    return (
        <Container>
          <Row>
            <h1 className="header">
              Frecuencias de hechos en sentencias de <span className="amarillo">Justicia y Paz</span>
            </h1>
          </Row>
          <Row>
            <Col lg={6} md={12} xs={12} className="btm">
              <p>
              Cada círculo representa una sentencia, haz clic sobre ellas para ver las frecuencias de hechos víctimizantes en cada una. Para leer la sentencia dirígete <a href="https://www.fiscalia.gov.co/colombia/sentencias-ley-975-de-2005/" target="_blank" rel="noopener noreferrer"> aquí </a> 
              </p>
              {this.renderBubbleChart()}
            </Col>
            <Col lg={6} md={12} xs={12} className="btm">
            <div className="description">
                <p>Menciones en la sentencia: </p>
                {this.renderDropdown()}
            </div> 
              {this.renderBarChart()}
            </Col>
          </Row>
          <p className="pie btm">
            Esta visualización muestra el número de menciones a los hechos victimizantes de manera explícita. No refleja la cantidad de hechos victimizantes por sentencia.
          </p>
        </Container>
    );
  }
}

export default Frecuencias;
