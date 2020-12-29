import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {csv} from "d3-fetch";
import datos_depto from "./data/deptos.csv";
import hechos_anio from "./data/hechos_por_anio.csv";
import iniciativas_anio from "./data/anios.csv";
import presidentes from "./data/presidentes.csv";
import deptos from "./data/deptos.json";
import total_iniciativas from "./data/total_iniciativas.csv";
import VizRadialWrapper from './VizRadialWrapper';
import DataPanel from './DataPanel';
import leyenda from './leyenda.png'
import logo from './logo.png'

class App extends Component {
  state = {
    periodos: [],
    hechos: [],
    iniciativas_anio: [],
    datos_depto: [],
    deptos: null,
    iniciativas_total: [],
    iniciativas_filtradas: [],
    filtro_name: null,
    filtro_value: null,
    depto_name: null
  }

  updateFiltro = (name, value, depto_name) => {
    let filtradas = this.state.iniciativas_total.filter(d => d[name] === value)

    this.setState({
      filtro_name: name,
      depto_name: depto_name,
      filtro_value: value,
      iniciativas_filtradas: filtradas
    })
  }

  borrarFiltros = () => {
    this.setState({
      filtro_name: null,
      filtro_value: null,
      iniciativas_filtradas: this.state.iniciativas_total
    })
  }

  componentWillMount() {  

    Promise.all([
      csv(presidentes),
      csv(hechos_anio),
      csv(iniciativas_anio),
      csv(datos_depto),
      csv(total_iniciativas)
  
    ]).then(files =>  {
        let periodos = files[0]; 
        let hechos = files[1];
        let iniciativas_anio = files[2];
        let datos_depto = files[3];
        let iniciativas_total = files[4];

        datos_depto.forEach( depto => {
          
          if (depto.depto === "AMAZONAS") {
            depto.name = "Amazonas";
          } else if (depto.depto === "ANTIOQUIA"){
            depto.name = "Antioquia";
          } else if (depto.depto === "ARAUCA"){
            depto.name = "Arauca";
          }else if (depto.depto === "ATLANTICO"){
            depto.name = "Atlántico";
          } else if (depto.depto === "BOLIVAR"){
            depto.name = "Bolívar";
          } else if (depto.depto === "ATLANTICO"){
            depto.name = "Atlántico";
          } else if (depto.depto === "BOYACA"){
            depto.name = "Boyacá";
          } else if (depto.depto === "CALDAS"){
            depto.name = "Caldas";
          } else if (depto.depto === "CAQUETÁ"){
            depto.name = "Caquetá";
          } else if (depto.depto === "CAQUETA"){
            depto.name = "Caquetá";
          } else if (depto.depto === "CASANARE"){
            depto.name = "Casanare";
          } else if (depto.depto === "CAUCA"){
            depto.name = "Cauca";
          } else if (depto.depto === "CESAR"){
            depto.name = "César";
          } else if (depto.depto === "CHOCO"){
            depto.name = "Chocó";
          } else if (depto.depto === "CORDOBA"){
            depto.name = "Córdoba";
          } else if (depto.depto === "CUNDINAMARCA"){
            depto.name = "Cundinamarca";
          } else if (depto.depto === "GUAVIARE"){
            depto.name = "Guaviare";
          } else if (depto.depto === "HUILA"){
            depto.name = "Huila";
          } else if (depto.depto === "LA GUAJIRA"){
            depto.name = "La Guajira";
          } else if (depto.depto === "MAGDALENA"){
            depto.name = "Magdalena";
          } else if (depto.depto === "META"){
            depto.name = "Meta";
          }  else if (depto.depto === "NARINO"){
            depto.name = "Nariño";
          }  else if (depto.depto === "NORTE DE SANTANDER"){
            depto.name = "Norte de Santander";
          }  else if (depto.depto === "PUTUMAYO"){
            depto.name = "Putumayo";
          } else if (depto.depto === "QUINDIO"){
            depto.name = "Quindío";
          }  else if (depto.depto === "SANTAFE DE BOGOTA D.C"){
            depto.name = "Bogotá";
          } else if (depto.depto === "SANTANDER"){
            depto.name = "Santander";
          } else if (depto.depto === "SUCRE"){
            depto.name = "Sucre";
          } else if (depto.depto === "TOLIMA"){
            depto.name = "Tolima";
          } else if (depto.depto === "VALLE DEL CAUCA"){
            depto.name = "Valle del Cauca";
          } 
        }) 

        this.setState({ 
          periodos: periodos,
          hechos: hechos,
          iniciativas_anio: iniciativas_anio,
          datos_depto: datos_depto,
          deptos: deptos,
          iniciativas_total: iniciativas_total,
          iniciativas_filtradas: iniciativas_total
        });
  
    }).catch(function(err) {
        console.log(err)
    })  
  }

  renderVizRadial() {
    if (this.state.iniciativas_anio.length === 0) {
      return "no data yet"
    } else {
      return  <VizRadialWrapper 
                periodos={this.state.periodos}
                hechos={this.state.hechos}
                iniciativas={this.state.iniciativas_anio}
                datos_depto={this.state.datos_depto}
                deptos={this.state.deptos}
                updateFiltro ={this.updateFiltro}
              />
    }
  }

  renderDataPanel() {
    if (this.state.iniciativas_total.length === 0) {
      return "no data yet"
    } else {
      return <DataPanel 
              iniciativas = {this.state.iniciativas_filtradas}
              filtro_value = {this.state.filtro_value}
              depto_name = {this.state.depto_name}
              borrarFiltros = {this.borrarFiltros}
      />
    }
  }

  render() {
    return (
      <div className="App">  
        <Container>
          <Row className="cont">

            <Col xs={12} className="title-container">
              <img className="logo" src={logo} alt=""></img>
              <h1 className="app-title"> 
                Experiencias de convivencia, resistencias y transformaciones para la paz 
              </h1>
            </Col>

            <Col xl={7} lg={12} md={12} xs={12} className="btm top">
            {this.renderVizRadial()}
            <img className="leyenda" src={leyenda} alt=""></img>
            <p className="leyenda-datos"> 
              Datos de hechos victimizantes tomados del Observatorio de Memoria y Conflicto del CNMH y del Registro Único de Víctimas (RUV) 
            </p>
            </Col>
            <Col xl={5} lg={12} md={12} xs={12} className="data-panel btm">
            {this.renderDataPanel()}
            </Col>

          </Row>
        </Container>
      </div>
    )
  }
}

export default App;
