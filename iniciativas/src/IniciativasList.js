import React from 'react';
import Accordion from 'react-bootstrap/Accordion'

function OptionsList ({iniciativas}) {  

    let listItems = [];
    for (var i = 0; i < iniciativas.length; i++) {

      let ini = {}
      ini.nombre = iniciativas[i].nombre
      ini.actor = iniciativas[i].actor
      ini.tipo_actor = iniciativas[i].tipo_actor.split('==')[1]
      ini.depto = iniciativas[i].depto
      ini.mpio = iniciativas[i].mpio
      ini.inicio = iniciativas[i].inicio
      ini.convivencias = iniciativas[i].convivencias.split('==')[1]
      ini.cat = iniciativas[i].categoria
      ini.des = iniciativas[i].descripcion

      let index = i +'n'

      listItems.push(
        <div key={'ini-'+i}>
          <div className="acc-header">
            <Accordion.Toggle eventKey={index}>
              { i+1 + '. ' + ini.nombre}
            </Accordion.Toggle>
          </div>

          <Accordion.Collapse eventKey={index}>
            <div className="acc-body">
              <p className="acc-ubicacion">
                <span>{ini.mpio !== "999" ? ini.mpio:""}</span>
                <span>{ini.depto !== "999" ? ', ' + ini.depto:""}</span>
                <span>{ini.inicio !== "999" ? ' (' + ini.inicio + ')':""}</span>
              </p>

              <p>
                <strong> Desarrollada por: </strong>
                {ini.actor !== "999" ? ini.actor:""}
                {ini.tipo_actor ? ' (' + ini.tipo_actor.trim() + ')':""}
              </p>

              <p>
                <strong> Convivencia democrática: </strong>
                {ini.convivencias ? ' ' + ini.convivencias.trim() :""}
              </p>

              <p>
                <strong> Categoría: </strong>
                {ini.cat ? ' ' + ini.cat:""}
              </p>

              <p>
                {ini.des && ini.des !== "999" ?ini.des:""}
              </p>
                
            </div>
          </Accordion.Collapse>
        </div>
      );
      
    }

    return <>
    <Accordion>
      {listItems}
    </Accordion>
    </>
  }


export default OptionsList;

