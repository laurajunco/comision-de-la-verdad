import React, { Component } from 'react';
import MapaViz from './MapaViz';

class MapaMpiosWrapper extends Component {

    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        var element = this.ref.current;

        this.setState({
            chart: new MapaViz(
                element, 
                this.props.deptos, 
                this.props.datos_mpio,
                this.props.mostrar,
                element.getBoundingClientRect().width
                )
        })    
    }

    shouldComponentUpdate() {
        //stop rerendering
        return false;
    }

    componentWillReceiveProps(nextProps) {
            this.state.chart.update(nextProps.datos_mpio, nextProps.mostrar);
    }

    render() {
        return (
        <>
            <div id="tooltip-mpio" className="hidden">
                <p>
                    <strong id="mpio-nom"> Municipio</strong> <br></br>
                    <strong> Salidas: </strong> <span id="salidas"></span> <br></br>
                    <strong> Llegadas: </strong> <span id="llegadas"></span> <br></br>
                    <strong> Total: </strong> <span id="total"></span>
                </p>
            </div>

          <div ref={this.ref} className="mapa">
          </div>
        </>
        )
    }
}

export default MapaMpiosWrapper;