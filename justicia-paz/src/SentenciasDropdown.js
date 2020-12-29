import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown'

function SentenciasDropdown ({sentencias, updateName, activeSentencia, filtradas}) {  
    let dropdownItems = [];
    //let active = filtradas ? activeSentencia.split("_")[1] : activeSentencia.split("_")[0];

    for (var i = 0; i < sentencias.length; i++) {
      let sentencia = sentencias[i];
      //let sentenciaName = filtradas ? sentencias[i].split("_")[1] : sentencias[i].split("_")[0];
    
      dropdownItems.push(
      <Dropdown.Item 
        key={i + sentencia} 
        onSelect={() => updateName(sentencia)
        }
        >
          {sentencia.split("_")[0]}
      </Dropdown.Item>
      );
    }

    return (
      <Dropdown>
        <Dropdown.Toggle id="dropdown-basic">
              {activeSentencia.split("_")[0]}
        </Dropdown.Toggle>

        <Dropdown.Menu className="d-options">
          {dropdownItems}
        </Dropdown.Menu>
      </Dropdown>
    );
}

export default SentenciasDropdown;

