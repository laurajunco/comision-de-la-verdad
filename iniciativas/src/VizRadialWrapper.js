import React, { Component } from 'react';
import RadialViz from './RadialViz';

class ChartWrapper extends Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        var element = this.ref.current;

        this.setState({
            chart: new RadialViz(
                element, 
                this.props.periodos, 
                this.props.hechos,
                this.props.iniciativas, 
                this.props.datos_depto,
                this.props.deptos,
                this.props.updateFiltro,
                element.getBoundingClientRect().width
                )
        })    
    }

    shouldComponentUpdate() {
        //stop rerendering
        return false;
    }

    componentWillReceiveProps(nextProps) {
        //this.state.chart.update(nextProps.edges, nextProps.nodes, nextProps.activeNodes);
    }

    render() {
        return (
        <>
            <div id="anio-tooltip" className="hidden">
                <p><strong id="anio">Año</strong></p>
                <p><strong><span id="iniciativas-anio">100</span></strong></p>
                <p><strong><span id="hechos-anio">100</span></strong></p>
                <p><span id="masacre-anio">100</span></p>
                <p><span id="desplazamiento-anio">100</span></p>
                <p><span id="asesinato-anio">100</span></p>
                <p><span id="despojo-anio">100</span></p>
                <p><span id="tortura-anio">100</span></p>
                
                
            </div>
            <div id="depto-tooltip" className="hidden">
                <p><strong id="depto">Departamento</strong></p>
                <p><span id="iniciativas-depto">100</span></p>
            </div>
          <div ref={this.ref} className="radial">
          </div>
        </>
        )
    }
}

export default ChartWrapper;