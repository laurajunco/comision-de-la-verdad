import * as d3 from 'd3'

class MapaViz {

  constructor(element, deptos, datos_mpio, mostrar, width) {
      
      let vis = this;
      vis.datos_mpio = datos_mpio;
      vis.deptos = deptos;
      vis.mostrar = mostrar;
      vis.format = d3.format(",")

      vis.MARGIN = { TOP: 3, BOTTOM: 3, LEFT: 3, RIGHT: 3 }
      vis.WIDTH = width - vis.MARGIN.LEFT - vis.MARGIN.RIGHT
      vis.HEIGHT = width*1.15 - vis.MARGIN.TOP - vis.MARGIN.BOTTOM

      vis.g = d3.select(element)
        .append("svg")
          .attr("width", vis.WIDTH + vis.MARGIN.LEFT + vis.MARGIN.RIGHT)
          .attr("height", vis.HEIGHT + vis.MARGIN.TOP + vis.MARGIN.BOTTOM)
            .append("g")


          
      vis.projection = d3.geoMercator()
        .scale(vis.WIDTH*3.6)
        .center([-74.350145, 4.609823]) //centro de colombia con san andres
        .translate([vis.WIDTH/2, vis.HEIGHT/2]);

      vis.path = d3.geoPath(vis.projection)

      vis.mapGroup = vis.g.append("g")
      
      vis.r = d3.scaleLinear()
        .range([ 1, vis.WIDTH/30 ])

    vis.update(datos_mpio, mostrar)
        
  }  

  update(datos_mpio, mostrar) {

    const vis = this;   
    vis.datos_mpio = datos_mpio;
    vis.mostrar = mostrar;

    vis.drawMap();
  }

  drawMap() {
    const vis = this;

    //vis.r.domain([ 0, d3.max(vis.datos_mpio, d => +d[vis.mostrar]) ]);
    vis.r.domain([ 0, d3.max(vis.datos_mpio, d => +d.total) ]);

    vis.deptosPaths = vis.mapGroup.selectAll("path")
      .data(vis.deptos.features)
      .enter()
      .append("path")
      .attr("d", vis.path)
      .attr("class", "dept")

    //DATA JOIN
    vis.circles = vis.mapGroup.selectAll(".circle-mpio")
      .data(vis.datos_mpio)

    //EXIT
    vis.circles.exit()
      .transition().duration(200)
        .attr("r", 0)
        .remove()

    //UPDATE
    vis.circles.transition().duration(300)
      .attr("cx", d => vis.projection([+d.lon, +d.lat])[0])
      .attr("cy", d =>  vis.projection([+d.lon, +d.lat])[1])
      .attr("r", d => vis.r(+d[vis.mostrar]))
      .attr("class", d => {
        if(vis.mostrar === "total") {
          return +d.salida >= +d.llegada ? "circle-mpio salida":"circle-mpio llegada"
        } else {
          return vis.mostrar === "salida" ? "circle-mpio salida":"circle-mpio llegada"
        }
      })

    //ENTER
    vis.circles.enter()
      .append("circle")
      .attr("id", d => 'm-' + d.mpio)
      .attr("cx", d => vis.projection([+d.lon, +d.lat])[0])
      .attr("cy", d =>  vis.projection([+d.lon, +d.lat])[1])
      .attr("r", d => vis.r(+d[vis.mostrar]))
      .attr("class", d =>  {
        if(vis.mostrar === "total") {
          return +d.salida >= +d.llegada ? "circle-mpio salida":"circle-mpio llegada"
        } else {
          return vis.mostrar === "salida" ? "circle-mpio salida":"circle-mpio llegada"
        }
      })
      .on("mouseenter", circleMouseover)
      .on("mouseout", () =>  d3.select("#tooltip-mpio").classed("hidden", true))


      function circleMouseover(event, d) {    

        var xPosition = parseFloat(event.clientX) + 5;
        var yPosition = parseFloat(event.clientY) + 2;

        let tooltip = d3.select("#tooltip-mpio")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px")

        tooltip.select("#salidas")
          .text(vis.format(d.salida))

        tooltip.select("#llegadas")
          .text(vis.format(d.llegada))
        
        tooltip.select("#total")
          .text(vis.format(d.total))

        tooltip.select("#mpio-nom")
          .text(d.mpio + ", " + d.dpto)

        tooltip.classed("hidden", false);
        
    }
  }
}

export default MapaViz;