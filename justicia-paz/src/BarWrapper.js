import React, { Component } from 'react';
import Bar from './Bar'
import {ascending} from "d3-array";

class BarWrapper extends Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        var element = this.ref.current;

        //process data
        let data = this.props.data
        let frecuencias = [];

        data.forEach(d => {
            let keys = Object.keys(d);
            for ( var i = 0; i < keys.length - 1; i++ ) {
                let key = keys[i];
                frecuencias[i] = {
                    hecho: key,
                    total: 0
                };
            }
        })

        data.forEach(d => {
            let keys = Object.keys(d);
            for ( var i = 0; i < keys.length - 1; i++ ) {
                let key = keys[i];
                frecuencias[i]['total'] += Number(d[key]);
            }
        })
        frecuencias.sort((a, b) => ascending(a.total, b.total))
        frecuencias.shift();

        this.setState({
            chart: new Bar(element, frecuencias, element.getBoundingClientRect().width)
        }) 
    }

    shouldComponentUpdate() {
        //stop rerendering
        return false;
    }

    componentWillReceiveProps(nextProps) {
        //corre cada vez que se le mandan nuevas props al componente

        if(this.props !== nextProps) {

            let activeSentencia = nextProps.activeSentencia
            let data = activeSentencia === "todas" ? nextProps.data 
                : nextProps.data.filter((d) => d.sentencia === activeSentencia)
            let frecuencias = [];

            data.forEach(d => {
                let keys = Object.keys(d);
                for ( var i = 0; i < keys.length - 1; i++ ) {
                    let key = keys[i];
                    frecuencias[i] = {
                        hecho: key,
                        total: 0
                    };
                }
            })

            data.forEach(d => {
                let keys = Object.keys(d);
                for ( var i = 0; i < keys.length - 1; i++ ) {
                    let key = keys[i];
                    frecuencias[i]['total'] += Number(d[key]);
                }
            })
            frecuencias.sort((a, b) => ascending(a.total, b.total))
            frecuencias.shift();

            this.state.chart.update(frecuencias);

        }
    }

    render() {
        return(
            <>
        <div id="tooltip-bar" className="hidden">
            <p>
                <strong id="bar-name"></strong>: <span id="bar-value"></span>
            </p>
        </div>
        <div ref={this.ref} className="bar-chart">
        </div>
        </>
        )
    }
}

export default BarWrapper;