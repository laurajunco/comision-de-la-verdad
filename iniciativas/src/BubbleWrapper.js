import React, { Component } from 'react';
import Bubble from './Bubble';

class BubbleWrapper extends Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {

        var element = this.ref.current;
        this.setState({
            chart: new Bubble(element,
                            this.props.iniciativas, 
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
        this.state.chart.update(nextProps.iniciativas,nextProps.filtroCategoria,nextProps.filtroValue);
    }

    render() {
        return (
        <>
            <div id="tooltip-bubble" className="hidden">
                <p id="nom-cat">
                    Nombre
                </p>
            </div>
          <div ref={this.ref} className="burbujas">
          </div>
        </>
        )
    }
}

export default BubbleWrapper;