let data_torta = [];
let buckets_torta = {};
let keys_torta = [];

//load data
d3.csv("../data/hechos_genero.csv").then((d) => {
  
  data_torta = d;
  keys_torta = data_torta.columns.slice(1);
  

  buckets_torta = [
    { key: keys_torta[0], value: 0 },
    { key: keys_torta[1], value: 0 },
    { key: keys_torta[2], value: 0 },
    { key: keys_torta[3], value: 0 }
  ]

  data_torta.forEach(d => {
    buckets_torta[0].value += Number(d[keys_torta[0]])
    buckets_torta[1].value += Number(d[keys_torta[1]])
    buckets_torta[2].value += Number(d[keys_torta[2]])
    buckets_torta[3].value += Number(d[keys_torta[3]])
  })

  visualize();
}).catch(function(err) {
  console.log(err)
})  

function visualize() {
  vis = this;

  //contenedor
  vis.$container = $('#container-torta');
  vis.margin = { TOP: 10, BOTTOM: 10, LEFT: 10, RIGHT: 10 }
  vis.w = vis.$container.width() - vis.margin.LEFT - vis.margin.RIGHT;
  vis.h = vis.w/1.4 - vis.margin.TOP - vis.margin.BOTTOM
  vis.outerRadius = Math.min(vis.w, vis.h) / 2;
  vis.innerRadius = 0;
  vis.format = d3.format(",")

  vis.colors = d3.scaleOrdinal()
    .domain([3])
    .range(["#F5AF4D","#F2F2F2", "#A33F38", "#F5AF4D"])

  vis.pie = d3.pie().value(d => d.value);

  vis.arc = d3.arc()
    .outerRadius(vis.outerRadius)
    .innerRadius(vis.innerRadius);

  vis.svg = d3.select("#container-torta")
						.append("svg")
						.attr("width", vis.w + vis.margin.LEFT + vis.margin.RIGHT)
            .attr("height", vis.h + vis.margin.TOP + vis.margin.BOTTOM)
            .append("g")
                .attr("transform", `translate(${vis.margin.LEFT}, ${vis.margin.TOP})`)


  vis.arcs = vis.svg.selectAll("g.arc")
    .data(vis.pie(buckets_torta))
    .enter()
    .append("g")
    .attr("class", "arc")
    .attr("transform", `translate(${vis.w/2}, ${vis.h/2})`);

  vis.arcs.append("path")
    .attr("fill", d => colors(d.data.key))
    .attr("d", arc);

  //textos
  vis.arcs.append("text")
    .attr("transform", d => "translate(" + arc.centroid(d) + ")")
    .attr("text-anchor", "middle")
    .text(d => {
      if(d.data.key === "Hombre" || d.data.key === "Mujer"){
        return d.data.key
      }
      else {
        return ""
      }
    })
    .attr("class", "label")

  vis.arcs.append("text")
    .attr("transform", d => "translate(" + arc.centroid(d) + ")")
    .attr("text-anchor", "middle")
    .attr("dy", 15)
    .text(d => {
      if(d.data.key === "Hombre" || d.data.key === "Mujer"){
        return vis.format(d.data.value)
      }
      else {
        return ""
      }
    })
    .attr("class", "value")
}

