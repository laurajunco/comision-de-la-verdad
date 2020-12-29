import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ruta_2 from "./data/rutas/prueba.json";
import ruta_1 from "./data/rutas/prueba_2.json";
import RutaWrapper from "./RutaWrapper";


class SeccionTopRutas extends Component {

  state = {
    ruta: ""
  }

  componentDidMount() { 
    
    
    // this.setState({
    //   //ruta: ruta_json
    // })
  }

  // renderRuta() {
  //   if (this.state.ruta === "") {
  //     return "No hay datos"
      
  //   } else {
  //     return  <RutaWrapper
  //               ruta={ruta_1}
  //             />
  //   }
  // }

  render() {
      return (
        <Container>

          <Row>
            <Col xs={3}>
            <RutaWrapper ruta={ruta_1}/>
            </Col>
            <Col xs={3}>
            <RutaWrapper ruta={ruta_2}/>
            </Col>
            <Col xs={3}>
            <RutaWrapper ruta={ruta_1}/>
            </Col>
            <Col xs={3}>
            <RutaWrapper ruta={ruta_2}/>
            </Col>
          </Row>

        </Container>
      
      )
  }
}

export default SeccionTopRutas;