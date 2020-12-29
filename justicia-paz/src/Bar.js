import * as d3 from 'd3'


class Bar {
    constructor(element, data, width){
        
        let vis = this;
        vis.data = data;
        vis.format = d3.format(",")

        vis.MARGIN = { TOP: 10, BOTTOM: 10, LEFT: 90, RIGHT: 70 }
        vis.WIDTH = width - vis.MARGIN.LEFT - vis.MARGIN.RIGHT
        vis.HEIGHT = width*1.5 - vis.MARGIN.TOP - vis.MARGIN.BOTTOM

        vis.g = d3.select(element)
			.append("svg")
				.attr("width", vis.WIDTH + vis.MARGIN.LEFT + vis.MARGIN.RIGHT)
				.attr("height", vis.HEIGHT + vis.MARGIN.TOP + vis.MARGIN.BOTTOM)
			.append("g")
                .attr("transform", `translate(${vis.MARGIN.LEFT}, ${vis.MARGIN.TOP})`)
                .attr("class", "bar");

        //scales
        vis.x = d3.scaleLinear()
            .range([1, vis.WIDTH]);

        vis.y = d3.scaleBand()
            .range([vis.HEIGHT, 0])
            .padding(0.2);
             
        vis.yAxisGroup = vis.g.append("g")
            .attr('transform', 'translate(-2, 0)')
            .attr('class', 'yAxis')
    
        vis.update(data)	
    }

    update(data) {
        
        const vis = this;   
        vis.data = data.filter((d) => d.total > 0)

        //scales
        vis.x.domain([0,d3.max(vis.data, d => d.total)])
        vis.y.domain(vis.data.map(d => d.hecho))

        /* --- rects --- */
        //Data JOIN
        vis.rects = vis.g.selectAll("rect")
            .data(vis.data)

        //EXIT
        vis.rects.exit()
            .transition().duration(200)
                .attr("width", 0)
                .remove()

        //UPDATE
        vis.rects.transition().duration(500)
            .attr("y", d => vis.y(d.hecho))
            .attr("height", vis.y.bandwidth)
            .attr("fill", "white")
            .attr("x", d => 0)
            .attr("width", d => vis.x(d.total))

        // ENTER create elements
        vis.rects.enter()
            .append("rect")
            .attr('class', 'bar')
            .attr("y", d => vis.y(d.hecho))
            .attr("height", vis.y.bandwidth)
            .attr("fill", "white")
            .attr("x", d => 0)
            .attr("width", d => vis.x(d.total))
            .on('mouseenter', (event, d) => {

                var xPosition = parseFloat(event.clientX) + 5;
                var yPosition = parseFloat(event.clientY) + 5;
                
                //Update the tooltip position and value
                let tooltip = d3.select("#tooltip-bar")
                    .style("left", xPosition + "px")
                    .style("top", yPosition + "px")
                    
               tooltip.select("#bar-value")
                    .text(vis.format(d.total))
                             
                tooltip.select("#bar-name")
                    .text(d.hecho);
                
                //Show the tooltip
                tooltip.classed("hidden", false);
            })
            .on("mouseout", () => {
                d3.select("#tooltip-bar").classed("hidden", true);
            })
            .transition().duration(500)
                .attr("r", (d) => 3 + d.r)

        /* --- lables --- */
        //Data JOIN
        vis.labels = vis.g.selectAll(".countLabel")
            .data(vis.data)

        //EXIT
        vis.labels.exit()
            .transition().duration(200)
                .attr("width", 0)
                .remove()

        //UPDATE
        vis.labels.transition().duration(500)
            .text(d => vis.format(d.total))
            .attr("y", d => (vis.y(d.hecho) + vis.y.bandwidth(vis.data)/2))
            .attr("fill", "black")
            .attr("font-size", 8)
            .attr("x", d => vis.x(d.total) + 2)

        // ENTER create elements
        vis.labels.enter()
            .append("text")
            .attr('class', 'countLabel')
            .text(d => vis.format(d.total))
            .attr("y", d => (vis.y(d.hecho) + vis.y.bandwidth(vis.data)/2))
            .attr("x", d => vis.x(d.total) + 5)

        //Axis
        //const xAxisCall = d3.axisBottom(vis.x)
        const yAxisCall = d3.axisLeft(vis.y)
            .tickFormat((d) => {
                let maxChar = 12;
                let txt = d.length > maxChar ? d.substring(0, maxChar) + '...': d
                return txt;
                });

        vis.yAxisGroup.transition(1000).call(yAxisCall)
    }
}

export default Bar;