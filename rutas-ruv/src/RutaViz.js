import * as d3 from 'd3'

class RutaViz {

  constructor(element, ruta, width) {
      
      let vis = this;
      vis.ruta = ruta

      vis.MARGIN = { TOP: 10, BOTTOM: 10, LEFT: 10, RIGHT: 10 }
      vis.WIDTH = width - vis.MARGIN.LEFT - vis.MARGIN.RIGHT
      vis.HEIGHT = width - vis.MARGIN.TOP - vis.MARGIN.BOTTOM

      vis.g = d3.select(element)
        .append("svg")
          .attr('viewBox', `0 0 ${width} ${width}`)
          .attr("width", vis.WIDTH + vis.MARGIN.LEFT + vis.MARGIN.RIGHT)
          .attr("height", vis.HEIGHT + vis.MARGIN.TOP + vis.MARGIN.BOTTOM)
            .append("g")

      vis.projection = d3.geoMercator()
        .translate(vis.WIDTH/2, vis.HEIGHT/2)
      
    vis.update()
        
  }  

  update() {
    let vis = this;

    vis.projection
    .fitExtent([[20, 20], [vis.WIDTH, vis.HEIGHT]], vis.ruta.geometry);
    
    vis.ruta_path = vis.g.selectAll('.ruta-path')
      .data([vis.ruta.geometry])
      .join('g')
      .attr('class', 'ruta-path')
      .append('path')
      .attr('class', 'ruta')
      .attr('d', d3.geoPath(vis.projection))
  }  
}

export default RutaViz;