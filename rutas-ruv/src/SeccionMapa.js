import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {csv} from "d3-fetch";
import {descending} from "d3-array";
import {ascending} from "d3-array";
import datos_mpio from "./data/mpios_llegada_salida.csv";
import datos_mpio_todos from "./data/mpios_llegada_salida_anio.csv";
import deptos from "./data/deptos.json";
import AniosDropdown from './AniosDropdown';
import MapaMpiosWrapper from './MapaMpiosWrapper';

class SeccionMapa extends Component {

  state = {
    datos_mpio: [],
    deptos: [],
    anio: "Todos",
    mostrar: "total",
    listaAnios: [],
    csv_todo: []
  }

  //cambiar entre llegadas, salidas y todo
  updateMostrar = (mostrar) => {  
    this.setState({
      mostrar: mostrar
    })
  }

  updateAnio = (anio) => {  
    if (anio === "Todos") {
      this.setState({
        anio: anio,
        datos_mpio: this.state.csv_uni
      })
    } else {
      let datosMpio = this.state.csv_todo.filter(d => +d.anio === anio)
      datosMpio.sort((a, b) => descending(+a.total, +b.total))

      this.setState({
        anio: anio,
        datos_mpio: datosMpio
      })

    }
  }

  componentDidMount() {  
    Promise.all([
      csv(datos_mpio),
      csv(datos_mpio_todos)
  
    ]).then(files =>  {

        let datos_mpio = files[0]; 
        let datos_mpio_todos = files[1]; 
        let datosMpio = []
        let anios = [...new Set(datos_mpio.map(item => +item.anio))]; 

        datos_mpio.forEach(d => {
          d.total = +d.salida + +d.llegada;
        })

        datosMpio = datos_mpio_todos;

        datosMpio.sort((a, b) => descending(+a.total, +b.total))
        anios.sort((a, b) => ascending(a, b))
       
        this.setState({ 
          datos_mpio: datosMpio,
          deptos: deptos,
          listaAnios: anios,
          csv_todo: datos_mpio,
          csv_uni: datos_mpio_todos
        });

    }).catch(function(err) {
        console.log(err)
    })  
  }

  renderMapa() {
    if (this.state.deptos.length === 0) {
      return "No hay datos"
    } else {
      return  <MapaMpiosWrapper
                datos_mpio={this.state.datos_mpio}
                deptos = {this.state.deptos}
                mostrar = {this.state.mostrar}     
              />
    }
  }

  renderLeyenda() {
    if (this.state.mostrar === "total") {
      return <div className="leyenda">
          <p className="negro syne salida"> Más salidas que llegadas </p>
          <p className="negro syne llegada"> Más llegadas que salidas </p>
        </div>
    }
  }

  renderDropdown() {
    if (this.state.listaAnios.length > 0) {
      return  <AniosDropdown
                listaAnios={this.state.listaAnios} 
                anio={this.state.anio} 
                updateAnio = {this.updateAnio}    
              />
    }
  }

  render() {
      return (
        <Container>

          <Row>

            <Col xs={12}>
              <h1>
                Rutas de desplazamiento <br></br>
                en Colombia
              </h1>
            </Col>

            <Col xl={9} xs={12}>
              <p className="subheading">
              En este mapa se ve la frecuencia de llegadas y salidas por desplazamiento forzado de los municipios en Colombia.
              </p>
            </Col>

          </Row>

          <Row>

            <Col xl={3} lg={12} md={12} xs={12}>
              <p className="morado-sel">
                <span className="sel" onClick={() => this.updateMostrar("salida")}>
                  Salidas
                </span> | <span className="sel" onClick={() => this.updateMostrar("llegada")}>
                  Llegadas
                </span> | <span className="sel" onClick={() => this.updateMostrar("total")}>
                  Todo
                </span>
              </p>

              {this.renderDropdown()}
              {this.renderLeyenda()}
            </Col>

            <Col xl={9} lg={12} md={12} xs={12}>
              {this.renderMapa()}
            </Col>

          </Row>

        </Container>
      
      )
  }
}

export default SeccionMapa;