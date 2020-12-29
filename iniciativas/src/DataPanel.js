import React, { Component } from 'react';
import IniciativasList from './IniciativasList';
import BubbleWrapper from './BubbleWrapper'

class DataPanel extends Component {

  constructor(props) {
    super(props)
    this.state = {
      iniciativas_total: null,
      iniciativas: null,
      filtro_value: null,
      filtro_burbujas_name: null,
      filtro_burbujas_value: null,
      depto_name: null
    }

    this.borrarTodo = this.borrarTodo.bind(this)
    
    //borra los filtros en app.js
    this.borrarFiltros = () => {
      this.props.borrarFiltros()
    }
  }
  
  componentWillMount() {  
    this.setState({
      iniciativas_total: this.props.iniciativas,
      iniciativas: this.props.iniciativas,
      filtro_name: this.props.filtro_name,
      depto_name: this.props.depto_name,
      filtro_value: this.props.filtro_value,
      filtro_burbujas_name: null,
      filtro_burbujas_value: null
    })    
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      iniciativas: nextProps.iniciativas,
      filtro_name: nextProps.filtro_name,
      filtro_value: nextProps.filtro_value,
      depto_name: nextProps.depto_name,
      filtro_burbujas_name: null,
      filtro_burbujas_value: null
    })  
  }

  updateFiltro = (name, value) => {
    let filtradas = []
    let filtroName = ""

    if (value.startsWith("C")) {
      filtradas = this.state.iniciativas.filter(d => d[value] === "1")
      filtroName = "subCategoria"
      
    } else {
      filtradas = this.state.iniciativas.filter(d => d[name] === value)
      filtroName = "categoria"
    }
  
    this.setState({
      filtro_burbujas_name: filtroName,
      filtro_burbujas_value: value,
      iniciativas: filtradas
    })
  }

  borrarTodo() {
    
    this.setState({
      filtro_burbujas_name: null,
      filtro_burbujas_value: null,
      iniciativas: this.state.iniciativas_total
    })

    //borra los filtros en app.js
    this.borrarFiltros()

  }

  renderFiltro() {

    let catName = "";
      let cat = this.state.filtro_burbujas_value

      if (cat === "Gestion pacifica de conflictos") {
        catName = "Gestión pacífica de conflictos"
      } else if (cat === "Transformaciones para la paz") {
        catName = "Transformaciones para la paz"
      } else if (cat === "Resistencias no violentas"){
        catName = "Resistenciasno violentas"
      } else if (cat === "NA"){
        catName = "Otros" 
      }  else if (cat === "C_21") {
        catName = "Defensa de la vida y del territorio"
        catName = "Defensa de la vida"
      } else if (cat === "C_22") {
        catName = "Proteger de ataques selectivos a líderes(as) y activistas"
      } else if (cat === "C_23"){
        catName = "Alternativas económicas al/de desarrollo"
      } else if (cat === "C_24"){
         catName = "Defensa de identidades colectivas"
      } else if (cat === "C_31"){
        catName = "Cultura y educación de paz"
      } else if (cat === "C_32"){
        catName = "Procesos de memoria colectiva"
      } else if (cat === "C_33"){
        catName = "Organización y articulación a redes"
      } else if (cat === "C_34"){
        catName = "Procesos de desarrollo y paz"
      } else if (cat === "C_35"){
        catName = "Protección del medioambiente"
      } else if (cat === "C_41"){
        catName = "Diálogo y negociación específico"
      } else if (cat === "C_42"){
        catName = "Diálogo y negociación estratégico"
      } else if (cat === "C_43"){
        catName = "Procesos de reincorporación y de reconciliación de excombatientes"
      } else {
        catName = this.state.filtro_burbujas_value
      }

    if (!this.state.filtro_value && this.state.iniciativas) {
      return  <>
        <h1> Transformaciones para la paz </h1>
        
        <p className="subtitle"> 
          <span> {catName? catName + ':': '' } </span>
          {this.state.iniciativas.length} iniciativas <span className="borrar" onClick={this.borrarTodo}>{catName? "Borrar filtros" : ""} </span>
        </p>
      </>

    } else {

      let value = this.state.filtro_value
      let depto = this.state.depto_name
      return <>
          <h1> { depto ? depto:value} </h1>
          <p className="subtitle"> <span> {catName? catName + ':': '' } </span> {this.state.iniciativas.length} iniciativas <span className="borrar" onClick={this.borrarTodo}>{value? "Borrar filtros" : ""} </span>
          </p> 
      </>
    }
  }

  renderListaIniciativas() {
    if (this.state.iniciativas.length === 0) {
      return <p> No hay iniciativas para los filtros aplicados</p>
    } else {
      return  <IniciativasList
                iniciativas={this.state.iniciativas}
              />
      }
    }


  renderBurbujas() {
    if (this.state.iniciativas.length === 0) {
      return <p>:/</p>
    } else {
      return <BubbleWrapper
                iniciativas={this.state.iniciativas}
                updateFiltro ={this.updateFiltro}
                filtroCategoria={this.state.filtro_burbujas_name}
                filtroValue={this.state.filtro_burbujas_value}

            />
    }
  }


  render() {
    return (
      <div> 
        {this.renderFiltro()}
        {this.renderBurbujas()}
        {this.renderListaIniciativas()}
        <p className="instrucciones">
          Haz clic en los departamentos, años, y círculos de categorías para filtrar las iniciativas existentes.
        </p>
      </div>
    )
  }
}

export default DataPanel;
