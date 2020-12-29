import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown'

function AniosDropdown ({listaAnios, anio, updateAnio}) {  
  let dropdownItems = [];
  
  for (var i = 0; i < listaAnios.length; i++) {
    let anioSel = listaAnios[i];

    dropdownItems.push(
      <Dropdown.Item 
        key={i + anioSel} 
        onSelect={() => updateAnio(anioSel)
        }
      >
        {anioSel}
      </Dropdown.Item>
    );
  }

  return (
    <Dropdown>
      <Dropdown.Toggle id="dropdown-basic">

            {anio ==="Todos"? "Filtra por año": anio}
      </Dropdown.Toggle>

      <Dropdown.Menu className="d-options">
        <Dropdown.Item 
          key={i + "todos"} 
          onSelect={() => updateAnio("Todos")
          }
        >
          Todos
        </Dropdown.Item>
        
        {dropdownItems}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default AniosDropdown;

