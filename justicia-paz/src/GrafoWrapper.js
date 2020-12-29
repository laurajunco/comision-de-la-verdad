import React, { Component } from 'react';
import Grafo from './Grafo';

class ChartWrapper extends Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        
        var element = this.ref.current;

        this.setState({
            chart: new Grafo(
                element, 
                this.props.edges, 
                this.props.nodes,
                this.props.updateSelected, 
                this.props.activeNodes,
                element.getBoundingClientRect().width,
                this.props.updateActiveSentencias 
                )
        })    
    }

    shouldComponentUpdate() {
        //stop rerendering
        return false;
    }

    componentWillReceiveProps(nextProps) {
        this.state.chart.update(nextProps.edges, nextProps.nodes, nextProps.activeNodes, nextProps.activeSentencias);
    }

    render() {
        return (
        <>
        <div id="tooltip-grafo" className="hidden">
            <p>
                <strong id="grafo-name"></strong>: <span id="grafo-value"></span>
            </p>
        </div>
        <div ref={this.ref} className="grafo">
        </div>
        </>
        )
    }
}

export default ChartWrapper;