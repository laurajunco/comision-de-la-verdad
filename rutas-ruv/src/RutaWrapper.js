import React, { Component } from 'react';
import RutaViz from './RutaViz';

class MapaMpiosWrapper extends Component {

    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        var element = this.ref.current;

        this.setState({
            chart: new RutaViz(
                element, 
                this.props.ruta, 
                element.getBoundingClientRect().width
                )
        })    
    }

    shouldComponentUpdate() {
        //stop rerendering
        return false;
    }

    componentWillReceiveProps(nextProps) {
      //this.state.chart.update(nextProps.datos_mpio, nextProps.mostrar);
    }

    render() {
        return (
        <>
          <div ref={this.ref} className="ruta">
          </div>
        </>
        )
    }
}

export default MapaMpiosWrapper;