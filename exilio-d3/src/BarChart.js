import * as d3 from 'd3';
import React , {Component} from 'react';

// const margin = {
//     top: 10,
//     bottom: 50,
//     left: 70,
//     right: 10
// };
// const width = 800 - margin.left - margin.right;
// const height = 500 - margin.top - margin.bottom;


const width = 800;
const height = 700;

class BarChart extends Component {
   
    constructor(props) {
      super(props)
      this.ref = React.createRef();
    }

    componentDidMount(){
      var element = this.ref.current;
      let vis = this;
      let width = element.getBoundingClientRect().width
      vis.MARGIN = { TOP: 10, BOTTOM: 10, LEFT: 10, RIGHT: 10 }
      vis.WIDTH = width - vis.MARGIN.LEFT - vis.MARGIN.RIGHT
      vis.HEIGHT = width - vis.MARGIN.TOP - vis.MARGIN.BOTTOM

      vis.g = d3.select(element)
			.append("svg")
				.attr("width", vis.WIDTH + vis.MARGIN.LEFT + vis.MARGIN.RIGHT)
				.attr("height", vis.HEIGHT + vis.MARGIN.TOP + vis.MARGIN.BOTTOM)
			.append("g")
        .attr("transform", `translate(${vis.MARGIN.LEFT}, ${vis.MARGIN.TOP})`)

    }

    componentDidUpdate() {

    }

    shouldComponentUpdate(newProps) {
      if(this.props !== newProps && newProps.buckets.length > 0) {
        return true;
      } else {
        return false
      }
    }

    render() {
      console.log("barchart!", this.props.buckets)

      return(
        <>
        <div ref={this.ref} className="burbujas">
        </div>
        </>
      )
    }
}

export default BarChart;
