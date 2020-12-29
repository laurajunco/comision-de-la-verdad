import React from 'react';
import Form from 'react-bootstrap/Form'
import {scaleOrdinal} from "d3-scale";

const COLORS = ["#FF6780", "#FFCA80", "#D8DBFF", "#8FFDFF", "#FFF"];


function OptionsList ({nodes, activeNodes, activeGroups, updateSelected}) {  

    const colorScale = scaleOrdinal(COLORS)
    let dropdownItems = [];

    for (var i = 0; i < nodes.length; i++) {
      let tipo = nodes[i].tipo;
      let nodo = nodes[i].name;

      dropdownItems.push(
        <div key={i + nodo} onClick={() => updateSelected(nodo)}>
          <Form.Check >
            <Form.Check.Input type={"checkbox"} />
            <span className="checkmark" style={{backgroundColor: colorScale(tipo)}}></span>
            <Form.Check.Label className={activeNodes.includes(nodo) ? "sel" : "no-sel"}>{nodo}</Form.Check.Label>
          </Form.Check>
        </div>
      );
    }

    return (
      <Form className="lista">
        <div key="sentencia" onClick={() => updateSelected("sentencia")}>
          <Form.Check >
            <Form.Check.Input type={"checkbox"} />
            <span className="checkmark" style={{backgroundColor: "#FFF"}}></span>
            <Form.Check.Label className={activeGroups.includes("sentencia") ? "sel" : "no-sel"}>
              Todas las sentencias
            </Form.Check.Label>
          </Form.Check>
        </div>
        <div key="bloque" onClick={() => updateSelected("bloque")}>
          <Form.Check >
            <Form.Check.Input type={"checkbox"} />
            <span className="checkmark" style={{backgroundColor: "#FF6780"}}></span>
            <Form.Check.Label className={activeGroups.includes("bloque") ? "sel" : "no-sel"}>
              Todos los Bloques
            </Form.Check.Label>
          </Form.Check>
        </div>
        <div key="postulado" onClick={() => updateSelected("postulado")}>
          <Form.Check >
            <Form.Check.Input type={"checkbox"} />
            <span className="checkmark" style={{backgroundColor: "#8FFDFF"}}></span>
            <Form.Check.Label className={activeGroups.includes("postulado") ? "sel" : "no-sel"}>
              Todos los Postulados
            </Form.Check.Label>
          </Form.Check>
        </div>
        <div key="juridica" onClick={() => updateSelected("juridica")}>
          <Form.Check >
            <Form.Check.Input type={"checkbox"} />
            <span className="checkmark" style={{backgroundColor: "#FFCA80"}}></span>
            <Form.Check.Label className={activeGroups.includes("juridica") ? "sel" : "no-sel"}>
              Todas las P. Jurídicas
            </Form.Check.Label>
          </Form.Check>
        </div>
        <div key="natural" onClick={() => updateSelected("natural")}>
          <Form.Check >
            <Form.Check.Input type={"checkbox"} />
            <span className="checkmark" style={{backgroundColor:"#D8DBFF" }}></span>
            <Form.Check.Label className={activeGroups.includes("natural") ? "sel" : "no-sel"}>
              Todas las P. Naturales
            </Form.Check.Label>
          </Form.Check>
        </div>
        {dropdownItems}
      </Form>
    );
}

export default OptionsList;

