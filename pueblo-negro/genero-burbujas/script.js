let data = [];
let buckets = {};
let keys = [];

//load data
d3.csv("../data/hechos_genero2.csv").then((d) => {
  
  data = d;
  keys = data.columns.slice(1);
  
  buckets = [
    { key: keys[0], value: +data[3][keys[0]] },
    { key: keys[3], value: +data[3][keys[3]] }
  ]

  visualizeBurbuja();
}).catch(function(err) {
  console.log(err)
})  

function visualizeBurbuja() {
  vis = this;

  //contenedor
  vis.$container = $('#container-burbuja');
  vis.margin = { TOP: 10, BOTTOM: 10, LEFT: 10, RIGHT: 10 }
  vis.w = vis.$container.width() - vis.margin.LEFT - vis.margin.RIGHT;
  vis.h = vis.w - vis.margin.TOP - vis.margin.BOTTOM
  vis.diameter = Math.min(vis.w, vis.h);
  vis.format = d3.format(",")

  vis.colors = d3.scaleOrdinal()
    .domain([3])
    .range(["#28BBA6", "#F5AF4D"])

  vis.svg = d3.select("#container-burbuja")
						.append("svg")
						.attr("width", vis.w + vis.margin.LEFT + vis.margin.RIGHT)
            .attr("height", vis.h + vis.margin.TOP + vis.margin.BOTTOM)
            .append("g")
                .attr("transform", `translate(${vis.margin.LEFT}, ${vis.margin.TOP})`)

  buckets.children = buckets;
  vis.bubble = d3.pack(buckets)
                .size([vis.w - 50, vis.w - 50])
                .padding(3);

  //sumar todos los nodos
  vis.nodes = d3.hierarchy(buckets)
    .sum(d => d.value);

  console.log(vis.bubble(vis.nodes).children)

  vis.circles = vis.svg.selectAll(".bubble")
    .data(vis.bubble(vis.nodes).children)
    .enter()
    .append("circle")
    .attr("class", "bubble")
    .attr("transform", (d) =>`translate( ${d.x}, ${d.y})` )
    .attr("r", d => d.r)
    .style("cursor", "pointer")

  //textos
  vis.labels = vis.svg.selectAll(".label")
    .data(vis.bubble(vis.nodes).children)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("transform", (d) =>`translate( ${d.x}, ${d.y + 2*d.r/3 - d.r/2 + d.r/4 + 2})` )
    .attr("text-anchor", "middle")
    .style("font-size", d => d.r/4)
    .text(d => d.data.key)
    
  vis.value = vis.svg.selectAll(".value")
    .data(vis.bubble(vis.nodes).children)
    .enter()
    .append("text")
    .attr("class", "value")
    .attr("transform", (d) =>`translate( ${d.x}, ${d.y + 2*d.r/3 - d.r/2})` )
    .attr("text-anchor", "middle")
    .style("font-size", d => d.r/1.2)
    .text(d => d.value)

}
