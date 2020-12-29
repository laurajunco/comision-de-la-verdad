import React, { Component } from 'react';
import Bubble from './Bubble';

class ChartWrapper extends Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        var element = this.ref.current;
        this.setState({
            chart: new Bubble(element,
                            this.props.data, 
                            this.props.updateName, 
                            this.props.activeSentencia, 
                            element.getBoundingClientRect().width
                        )
        })    
    }

    shouldComponentUpdate() {
        //stop rerendering
        return false;
    }

    componentWillReceiveProps(nextProps) {
        this.state.chart.update(nextProps.data, nextProps.activeSentencia);
    }

    render() {
        return (
        <>
        <div id="tooltip-bubble" className="hidden">
            <p>
                <strong id="bubble-name"></strong>: <span id="bubble-value"></span>
            </p>
        </div>
        <div ref={this.ref} className="burbujas">
        </div>
        </>
        )
    }
}

export default ChartWrapper;