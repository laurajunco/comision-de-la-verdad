import * as d3 from 'd3'

const colors = ["#FFF"];

class Bubble {
    constructor(element, data, updateName, activeSentencia, width){
        let vis = this;
        vis.data = data;
        vis.updateName = updateName;
        vis.activeSentencia = activeSentencia;
        vis.format = d3.format(",")

        vis.MARGIN = { TOP: 10, BOTTOM: 10, LEFT: 0, RIGHT: 0 }
        vis.WIDTH = width - vis.MARGIN.LEFT - vis.MARGIN.RIGHT
        vis.HEIGHT = width - vis.MARGIN.TOP - vis.MARGIN.BOTTOM

        vis.diameter = vis.WIDTH;
        
        vis.color = d3.scaleOrdinal()
            .range(colors);

        vis.g = d3.select(element)
			.append("svg")
				.attr("width", vis.WIDTH + vis.MARGIN.LEFT + vis.MARGIN.RIGHT)
				.attr("height", vis.HEIGHT + vis.MARGIN.TOP + vis.MARGIN.BOTTOM)
			.append("g")
                .attr("transform", `translate(${vis.MARGIN.LEFT}, ${vis.MARGIN.TOP})`)
                .attr("class", "bubbles");
        
        vis.update(vis.data, vis.activeSentencia)	
    }

    update(data, activeSentencia) {
        const vis = this;
        vis.data.children = data;
        vis.activeSentencia = activeSentencia;

        vis.bubble = d3.pack(vis.data)
                .size([vis.WIDTH - 10, vis.WIDTH - 10])
                .padding(3);

        //sumar todos los nodos
        vis.nodes = d3.hierarchy(vis.data)
            .sum(function(d) { return d.total; });

        //data join
        vis.circles = vis.g.selectAll(".bubble")
            .data(vis.bubble(vis.nodes).children)

        //transition
        vis.circles.transition().duration(500)
            .attr("transform", (d) =>`translate( ${d.x}, ${d.y})` )
            .style("fill", (d) => {
                if(d.data.sentencia === vis.activeSentencia) {
                    return "#FFCA80"
                }
                return "white"
            })
            .attr("r", (d) => d.r)

         //exit
        vis.circles.exit()
            .transition().duration(200)
            .attr("r", 0)
            .remove()
        
        //enter
        vis.circles.enter()
            .append("circle")
            .attr("class", "bubble")
            .attr("transform", (d) =>`translate( ${d.x}, ${d.y})` )
            .attr("r", 0)
            .style("cursor", "pointer")
            .style("fill", (d) => {
                if(d.data.sentencia === vis.activeSentencia) {
                    return "#FFCA80"
                }
                return "white"
            })
            .on('click', (event, d) => {               
				vis.updateName(d.data.sentencia);
            })
            .on('mouseenter', (event, d) => {
                d3.select(event.currentTarget)
                    .style('fill' , "#FFCA80");
               
                var xPosition = parseFloat(event.clientX) + 2;
                var yPosition = parseFloat(event.clientY) + 2;
                
                let tooltip = d3.select("#tooltip-bubble")
                    .style("left", xPosition + "px")
                    .style("top", yPosition + "px")
                    
                tooltip.select("#bubble-value")
                    .text(vis.format(d.data.total) + ' términos')
                                
                tooltip.select("#bubble-name")
                    .text(d.data.sentencia.split("_")[0]);
                
                tooltip.classed("hidden", false);
            })
            .on('mouseleave', () => {

                let bubbles = d3.selectAll(".bubble")
            
                bubbles.style("fill", "white");
                bubbles.filter(e => e.data.sentencia === vis.activeSentencia)
                    .style("fill", "#FFCA80")
                
                d3.select("#tooltip-bubble").classed("hidden", true);
            })
            .transition().duration(500)
                .attr("r", (d) => d.r)

        //count labels
        vis.countLabels = vis.g.selectAll(".count")
                .data(vis.bubble(vis.nodes).children)
            
        vis.countLabels.exit()
            .remove()
        
        vis.countLabels
            .attr("transform", (d) =>`translate( ${d.x}, ${d.y + d.r/6})` )
            .text((d) => vis.format(d.data.total))
            .attr("font-size", (d) => {
                if (d.data.total >= 10000) {
                    return d.r/2;
                } else if (d.data.total >= 1000) {
                    return d.r/1.6;
                } else if (d.data.total >= 100) {
                    return d.r/1.3;
                } else if (d.data.total <= 100) {
                    return 0;
                }
            })

        vis.countLabels.enter()
            .append("text")
            .classed("count", true)
            .style("pointer-events", "none")
            .attr("transform", (d) =>`translate( ${d.x}, ${d.y + d.r/6})` )
            .style("text-anchor", "middle")
            .text((d) => vis.format(d.data.total))
            .attr("font-size", (d) => {
                if (d.data.total >= 10000) {
                    return d.r/2;
                } else if (d.data.total >= 1000) {
                    return d.r/1.6;
                } else if (d.data.total >= 100) {
                    return d.r/1.3;
                } else if (d.data.total <= 100) {
                    return 0;
                }
            })
    }
}

export default Bubble;