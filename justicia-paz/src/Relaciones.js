import React, { Component } from 'react';
import GrafoWrapper from './GrafoWrapper';
import OptionsList from './OptionsList';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {csv} from "d3-fetch";
import {ascending} from "d3-array";
import csvFile from "./data/links.csv";

class Frecuencias extends Component {
  state = {
    edges: [],
    nodes: [],
    linkedByName: {},
    activeNodes: [],
    activeGroups: [],
    activeSentencias: []
  }

  updateSelected = (node) => {
    let activeNodes = this.state.activeNodes;
    let activeGroups = this.state.activeGroups;

    //si se selecciona por grupo
    if (node === "sentencia" || node === "juridica" 
        || node === "natural" || node === "bloque" || node === "postulado" ) {
      let tipo = node;

      //si el grupo no se ha seleccionado
      if (!activeGroups.includes(tipo)) {
        let allNodes = this.state.nodes.filter(d => d.tipo === tipo);
        allNodes.forEach((nodo) => activeNodes.push(nodo.name));
        activeGroups.push(tipo)
          
      } else {
        let typeNodes = this.state.nodes.filter(d => d.tipo === tipo);
        let toRemove = [];
        typeNodes.forEach((nodo) => toRemove.push(nodo.name));
        activeNodes = activeNodes.filter( d => !toRemove.includes(d))
        activeGroups = activeGroups.filter(d => d !== tipo)
      }
    // si se selecciona por nodo
    } else if (activeNodes.includes(node))
      activeNodes = activeNodes.filter(d => d !== node)
    else 
      activeNodes.push(node)
 
    this.setState({
      activeNodes: activeNodes,
      activeGroups: activeGroups,
    })
  }

  updateActiveSentencias = (sentencias) => {

    function arrayEquals(a, b) {
      return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
    }

    let uniqueSentencias = [...new Set(sentencias)]

    if(!arrayEquals(uniqueSentencias, this.state.activeSentencias)) {

        this.props.updateSentencias(uniqueSentencias)

        this.setState({
          activeSentencias: uniqueSentencias
        }) 
    }
    
  }

  componentWillMount() {
    csv(csvFile)
      .then(data => {

        let nodesByName = {};
        let edges = data;

        //crear nodos
        edges.forEach((edge) => {
          edge.source = nodeByName(edge.sentencia);
          edge.source.tipo = "sentencia";

          edge.target = nodeByName(edge.target);
          edge.target.size += Number(edge.value);
          edge.target.tipo = edge.tipo;
        });

        nodesByName = Object.values(nodesByName);
        nodesByName.sort((a, b) => ascending(a.tipo, b.tipo) || ascending(a.name, b.name));
    
        this.setState({ 
          edges: edges,
          nodes: nodesByName
        });

        //console.log("nodes By name: ", nodesByName.filter( d => d.tipo === "sentencia" ))

        function nodeByName(name) {
          return nodesByName[name] || (nodesByName[name] = { name: name, size: 0 });
        }

      }).catch(error => {
        console.log('Error: ', error)
    })
  }
  
  renderGrafo() {
    if (this.state.edges.length === 0) {
      return "no data yet"
    } else {
      return  <GrafoWrapper
                edges={this.state.edges} 
                nodes={this.state.nodes}
                updateSelected ={this.updateSelected}
                activeNodes = {this.state.activeNodes}
                updateActiveSentencias = {this.updateActiveSentencias}
                activeSentencias = {this.state.activeSentencias}
              />
    }
  }

  renderList() {
    if (this.state.edges.length === 0) {
      return "no data yet"
    } else {
      return  <OptionsList
                nodes={this.state.nodes} 
                activeNodes = {this.state.activeNodes}
                activeGroups = {this.state.activeGroups}
                updateSelected ={this.updateSelected}
              />
    }
  }

  renderActiveSentencias () {
    if (this.state.activeSentencias.length === 0) {
      return ""
    } else {
        let uniqueItems = Array.from(new Set(this.state.activeSentencias))
        const listItems = uniqueItems.map((sentencia, i) =>
        <li key={i}> {sentencia.split("_")[1]}, </li>
        );

        if (this.state.activeSentencias.length > 1) {
          return (
            <ul>
              <li> 
                <strong>
                  {this.state.activeSentencias.length} Sentencias activas: 
                  </strong>
                </li>
              {listItems}
            </ul>
          );
        } else {
          return (
            <ul>
              <li> 
                <strong>
                  {this.state.activeSentencias.length} Sentencia activa: 
                  </strong>
                </li>
              {listItems}
            </ul>
          );
        }
    }
  }

  render() {
    return (
        <Container>
          <Row>
            <h1 className="header sub">
                Relaciones de términos en sentencias de <span className="amarillo">Justicia y Paz</span>
            </h1>
            <p className="padding">
              Cada uno de los círculos blancos representa una sentencia. Esta visualización muestra el número de menciones a los nombres de postulados, personas y bloques de manera explícita. <br></br>
              <strong> Instrucciones: Haga clic en los nombres de postulados, personas, empresas, bloques y sentencias, así podrá filtrar la visualización con las relaciones de su interés. </strong>
            </p>
          </Row>
          <Row>
            <Col xs={12} lg={9} md={12} className="btm">
              {this.renderGrafo()}
            </Col>
            <Col xs={12} lg={3} md={12} className="btm">
              {this.renderList()}
            </Col>
          </Row>
          <Row>
            {this.renderActiveSentencias()}
          </Row>
        </Container>
    );
  }
}

export default Frecuencias;
