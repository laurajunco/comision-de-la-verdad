import * as d3 from 'd3'


const COLORS = ["#FF6780", "#FFCA80", "#D8DBFF", "#8FFDFF", "#FFF"]
const TIPOS = ["Bloque","P. Jurídica", "P. Natural", "Postulado", "Sentencia"]
let linkedByName = {};

class Grafo {
    constructor(element, edges, nodes, updateSelected, activenodes, width, updateActiveSentencias){
        let vis = this;
        vis.edges = edges;
        vis.nodes = nodes;
        vis.updateSelected = updateSelected;
        vis.updateActiveSentencias = updateActiveSentencias;
        vis.activeSentenciasNames = []
        vis.MARGIN = { TOP: 10, BOTTOM: 10, LEFT: 10, RIGHT: 10 }
        vis.WIDTH = width - vis.MARGIN.LEFT - vis.MARGIN.RIGHT
        vis.HEIGHT = width - vis.MARGIN.TOP - vis.MARGIN.BOTTOM
        vis.RADIUS = width/ 2 - (vis.MARGIN.LEFT + vis.MARGIN.TOP);
        vis.format = d3.format(",")

        vis.sentencias = vis.nodes.filter((d) => d.tipo === "sentencia");
        vis.numSentencias = vis.sentencias.length;
        vis.increment = 360 / vis.numSentencias;
        vis.iteration = 0;

        vis.g = d3.select(element)
			.append("svg")
				.attr("width", vis.WIDTH + vis.MARGIN.LEFT + vis.MARGIN.RIGHT)
				.attr("height", vis.HEIGHT + vis.MARGIN.TOP + vis.MARGIN.BOTTOM)
			    .append("g")
                

        vis.edges.forEach (function(d) {
            linkedByName[d.source.name + "," + d.target.name] = true;
        });

        vis.rScale = d3.scaleLinear()
            .domain([0, d3.max(vis.nodes, (d) => d.size)])
            .range([3, 25]);

        vis.colorScale = d3.scaleOrdinal(COLORS)

        vis.legend = vis.g.append("g")
            .attr("width", 200)
            .attr("height", 100)
            .attr("transform", `translate(${vis.MARGIN.LEFT}, ${vis.HEIGHT - 100})`)

        vis.legend.circles = vis.legend.selectAll(".leg")
            .data(TIPOS)
            .enter()
                .append("g")
                .classed("leg", true)
                    .append("circle")
                    .attr("cx", 0)
                    .attr("cy", (d, i) => 100 - (20 * i))
                    .attr("r", 5)
                    .attr("fill", (d) => vis.colorScale(d))

        vis.legend.texts = vis.legend.selectAll(".t-leg")
            .data(TIPOS)
            .enter()
                .append("g")
                .classed("t-leg", true)
                    .append("text")
                    .text((d) => d)
                    .attr("x", 10)
                    .attr("y", (d, i) => 105 - (20 * i))

        vis.force = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(edges).distance(40))
            .force("center", d3.forceCenter(vis.WIDTH/2,vis.HEIGHT/2 + 40))
            .force("x", d3.forceX(vis.WIDTH/2).strength(0.3))
            .force("y", d3.forceY(vis.HEIGHT/2 + 20).strength(0.3))
            .force('collision', d3.forceCollide().radius((d => vis.rScale(d.size) + 3)))

        vis.lines = vis.g.selectAll(".link")
            .data(vis.edges)
            .enter()
            .append("line")
            .attr("class", "link")

        vis.circles = vis.g.selectAll(".node")
            .data(vis.nodes)
            .enter()
            .append("circle")
            .attr("class", "node")
            .style("fill", (d) => vis.colorScale(d.tipo))
            .attr("r", (d) => d.tipo === "sentencia" ? 7 : vis.rScale(d.size))
            .on("click", circleClick)
            .on("mouseenter", circleMouseover)
            .on("mouseout", () =>  d3.select("#tooltip-grafo").classed("hidden", true))
 
        function circleClick(e, d) {    
            vis.updateSelected(d.name);
        }

        function circleMouseover(event, d) {    

            var xPosition = parseFloat(event.clientX) + 5;
            var yPosition = parseFloat(event.clientY) + 2;

            let tooltip = d3.select("#tooltip-grafo")
                .style("left", xPosition + "px")
                .style("top", yPosition + "px")

            if (d.tipo !== "sentencia") {
                tooltip.select("#grafo-value")
                    .text(vis.format(d.size) + ' términos')
            } else {
                tooltip.select("#grafo-value")
                    .text("")
            }

            tooltip.select("#grafo-name")
                .text(d.name);

            tooltip.classed("hidden", false);
            
        }
            
        vis.update(vis.edges, vis.nodes)	
    }

    update(edges, nodes, selected, activeSentenciasNames) {
        let vis = this;
        vis.edges = edges
        vis.nodes = nodes
        vis.selected = selected

        if (vis.selected && vis.selected.length > 0) {

            vis.lines.classed('hidden', true)
                .classed('focus', false)

            vis.circles
                .classed("hidden", false)
                .classed("selected", false)

            vis.lines.filter((d) => 
                vis.selected.includes(d.target.name) || vis.selected.includes(d.source.name))
                    .classed('focus', true);

            vis.circles.classed("hidden", true)

            vis.activeSentenciaNodes = []

            vis.selected.forEach((e) => {

                let connectedTo =  vis.nodes
                    .filter(d => isConnected(e, d.name))
                    .filter(d => d.tipo === 'sentencia')

                connectedTo.forEach((nodo) => {
                    vis.activeSentenciaNodes.push(nodo.name)
                });

                vis.circles.filter((d) => isConnected(e, d.name))
                    .classed("hidden", false)

                vis.circles.filter((d) => d.name === e)
                    .classed("selected", true);
            })

            vis.updateActiveSentencias(vis.activeSentenciaNodes)
            
        } else {
            vis.circles
                    .classed("hidden", false)
                    .classed("selected", false)

            vis.lines.classed('hidden', false)
                .classed('focus', false)
    
            vis.updateActiveSentencias([])
        }

        function isConnected(a, b) {
            return linkedByName[a + "," + b] || linkedByName[b + "," + a] || a === b;
        }

         vis.force.on("tick", (d) => {
             vis.iteration++;

            vis.sentencias.forEach((d, i) => {
                d.x = vis.WIDTH/2 + vis.RADIUS * Math.sin((vis.increment*i) + Math.PI)
                d.y = vis.HEIGHT/2 + vis.RADIUS  * Math.cos((vis.increment*i) + Math.PI)
            });

            if(vis.iteration >= 300) {
                vis.lines.attr("x1", (d) => d.source.x)
                    .attr("y1", (d) => d.source.y)
                    .attr("x2", (d) => d.target.x)
                    .attr("y2", (d) => d.target.y);
            }

            vis.circles
                .attr("cx", (d) => d.x)
                .attr("cy", (d) => d.y);
        })
    }
}

export default Grafo;

