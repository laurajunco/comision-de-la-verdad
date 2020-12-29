let data = [];
let keys = [];
let id = 0;

//load data
d3.csv("../data/hechos_timeline.csv").then((d) => {
  
  data = d;
  keys = data.columns.slice(1);
  
  visualize();
}).catch(function(err) {
  console.log(err)
})  

function visualize() {
  vis = this;

  //contenedor viz
  vis.$container = $('#container-tiempo');
  vis.margin = { TOP: 10, BOTTOM: 50, LEFT: 50, RIGHT: 10 }
  vis.legendWidth = 200
  vis.w = vis.$container.width() - vis.margin.LEFT - vis.margin.RIGHT - vis.legendWidth;
  vis.h = vis.w/1.5 - vis.margin.TOP - vis.margin.BOTTOM

  vis.colors = d3.scaleOrdinal()
    .domain(keys)
    .range(['#000',
            '#326C48',
             '#A33F38', 
             '#F9B5B2', 
             '#2B4B7A',
             '#EF4F23',  
             '#F2F2F2', 
             '#28BBA6', 
             '#000000',
             '#9FA338',
             '#48326C',
             '#AEF54D',
             '#23A1EF',
             '#F9F6B2',
             '#7A2B7A',
             '#6C5832',
             '#B028BB'
            ])

  vis.svg = d3.select("#container-tiempo")
    .append("svg")
    .attr("width", vis.w + vis.margin.LEFT + vis.margin.RIGHT + vis.legendWidth)
    .attr("height", vis.h + vis.margin.TOP + vis.margin.BOTTOM)
    .append("g")
        .attr("transform", `translate(${vis.margin.LEFT}, ${vis.margin.TOP})`)

  vis.xScale = d3.scaleLinear()
    .range([ 0, vis.w ]);

  vis.yScale = d3.scaleLinear()
    .range([ vis.h, 0 ]);

  //y Axis
  vis.yAxisGroup = vis.svg.append("g")
    .attr('transform', 'translate(-2, 0)')
    .attr('class', 'yAxis')

  vis.yAxisCall = d3.axisLeft(vis.yScale)
    .ticks(null, "s")
    .tickSize(-vis.w, 0, 0)

  //xAxis
  vis.xAxisGroup = vis.svg.append("g")
    .attr('transform', `translate(0, ${vis.h})`)
    .attr('class', 'xAxis')
  
  vis.xAxisCall = d3.axisBottom(vis.xScale)
    .tickSizeOuter(0)
    .tickFormat(d => d)

  
  updateGraph();
}

function updateGraph() {
  vis = this
  let datos = data.map(a => ({...a}));
  let keysCopy = [...keys];
  let des = $('#des');

  if (id === 0) {
    des.html("Número de víctimas del pueblo étnico negro (afrocolombiano + palenquero + raizal de San Andrés) por hecho victimizante y año, desde 1960 hasta 2019.")


  } else if (id === 1) {
    datos = datos.filter(d =>  +d.anio >= 1980)
    des.html("La mayoría de hechos victimizantes se presentaron entre 1998 y 2003.")


  }  else if (id === 2) {
    datos = datos.filter(d =>  +d.anio >= 1995)
    des.html("Existe un pico de 5 años en cuanto a víctimas directas e indirectas que inicia en el 2002, año de inicio del gobierno de la seguridad democrática y año posterior a la desmovilización de las AUC, respectivamente.")

  } else if (id === 3) {
    datos = datos.filter(d =>  +d.anio >= 1980)
    keysCopy = keysCopy.filter(d =>  d === "Delitos contra la libertad y la integridad sexual en desarrollo del conflicto armado" || d === "Abandono o despojo forzado de tierras")
    des.html("El abandono, el despojo y los delitos contra la integridad sexual se concentran principalmente entre los años 1999 y 2002.")


  } else if (id === 4) {
    datos = datos.filter(d =>  +d.anio >= 1980)
    keysCopy = keysCopy.filter(d =>  d === "Amenaza")
    des.html("En el 2016 emerge una oleada de amenazas, periodo que coincide con la desmovilización de las FARC.")
 

  } else if (id === 5) {
    datos = datos.filter(d =>  +d.anio >= 1990)
    keysCopy = keysCopy.filter(d =>  d === "Desplazamiento forzado")
    des.html("El año de mayor desplazamiento forzado de los pueblos afrodescendientes en Colombia, de acuerdo al Registro Único de Víctimas (RUV) se da en el 2007, un año después de la desmovilización de las AUC.")


  } else if (id === 6 || id === -1) {
    id = 0;
    des.html("Número de víctimas del pueblo étnico negro (afrocolombiano + palenquero + raizal de San Andrés) por hecho victimizante y año, desde 1960 hasta 2019.")

  }

    //scales
    vis.xScale.domain(d3.extent(datos, d => d.anio))
    vis.yScale.domain([
      0, d3.max(data, d => {
        total = 0;
        keysCopy.forEach(k => {
          total += +d[k]
        })
        return total;
      })
    ])

    //data
    vis.stackedData = d3.stack()
      .order(d3.stackOrderAscending)
      .keys(keysCopy)(datos)

    // --------- paths
    vis.paths = vis.svg.selectAll(".area")
    .data(vis.stackedData)
    
    vis.paths.enter()
      .append("path")
        .attr('class', 'area')
        .style("fill", d => vis.colors(d.key))
        .attr("d", d3.area()
          .curve(d3.curveBasis)
          .x((d, i) => vis.xScale(d.data.anio))
          .y0( d => vis.yScale(vis.h))
          .y1( d => vis.yScale(vis.h)))
        .transition()             // <-- New!
              .duration(1000)           // <-- New!
              .attr("d", d3.area()
                .curve(d3.curveBasis)
                .x((d, i) => vis.xScale(d.data.anio))
                .y0( d => vis.yScale(d[0]))
                .y1( d => vis.yScale(d[1])))
        

    vis.paths.transition().duration(500)
      .style("fill", d => vis.colors(d.key))
          .attr("d", d3.area()
            .curve(d3.curveBasis)
            .x((d, i) => vis.xScale(d.data.anio))
            .y0( d => vis.yScale(d[0]))
            .y1( d => vis.yScale(d[0]))
          )
            .on("end", function() {
              d3.select(this)
                .transition()             // <-- New!
                .duration(1000)           // <-- New!
                .attr("d", d3.area()
                  .curve(d3.curveBasis)
                  .x((d, i) => vis.xScale(d.data.anio))
                  .y0( d => vis.yScale(d[0]))
                  .y1( d => vis.yScale(d[1])))
          });

    vis.paths.exit().transition().duration(500)
      .attr("d", d3.area()
        .curve(d3.curveBasis)
        .x((d, i) =>  vis.xScale(d.data.anio))
        .y0( d => vis.h)
        .y1( d => vis.h)
      )
      .remove()

    //--------- legend
    vis.dots = vis.svg.selectAll(".dot")
    .data(keysCopy)

    vis.dots.enter()
      .append("circle")
        .attr('class', 'dot')
        .attr("cx", vis.w + 20)
        .attr("cy", (d,i) => 25 + i*25) 
        .attr("r", 7)
        .style("fill", d => vis.colors(d))
    
    vis.dots
      .attr('class', 'dot')
      .attr("cx", vis.w + 20)
      .attr("cy", (d,i) => 25 + i*25) 
      .attr("r", 7)
      .style("fill", d => vis.colors(d))
    
    vis.dots.exit()
      .remove()

    // --- legend label
    vis.labels = svg.selectAll(".label")
    .data(keysCopy)
    
    vis.labels.enter()
    .append("text")
      .attr('class', 'label')
      .attr("x", vis.w + 30)
      .attr("y", (d,i) => 25 + i*25)
      .text(d => d)
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")

    vis.labels.attr('class', 'label')
    .attr("x", vis.w + 30)
    .attr("y", (d,i) => 25 + i*25)
    .text(d => d)
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")

    vis.labels.exit()
          .remove()


    // Axis y
    vis.yAxisGroup.transition().duration(1500).call(vis.yAxisCall)
    vis.xAxisGroup.transition().duration(1500).call(vis.xAxisCall)

    if(!vis.line1){

      vis.line1 = vis.svg.append('line')
            .attr('class', 'yearLine')
            .attr("x1", xScale(0))
            .attr("y1", vis.h)
            .attr("x2", xScale(0))
            .attr("y2", 25)
            .style("stroke", "transparent");
        
      vis.yearLabel1 = vis.svg.append('text')
          .attr('class', 'yearLabel')
          .attr("x", xScale(0))
          .attr("y", 20)
          .text("0")
          .style("fill", "transparent");

      vis.line2 = vis.svg.append('line')
          .attr('class', 'yearLine')
          .attr("x1", xScale(0))
          .attr("y1", vis.h)
          .attr("x2", xScale(0))
          .attr("y2", 25)
          .style("stroke", "transparent");
      
      vis.yearLabel2 = vis.svg.append('text')
        .attr('class', 'yearLabel')
        .attr("x", xScale())
        .attr("y", 20)
        .text("")
        .style("fill", "transparent");
    } else {
      vis.line1.raise()
      vis.line2.raise()
      vis.yearLabel1.raise()
      vis.yearLabel2.raise()
    }


    //lines
    if (id === 1) {

        vis.line1.transition().duration(500)
        .attr("x1", xScale(1998))
        .attr("y1", vis.h)
        .attr("x2", xScale(1998))
        .style("stroke", "black");

        vis.yearLabel1
        .text("1998")
          .transition().duration(500)
          .attr("x", xScale(1998))
          .style("fill", "black");

        vis.line2.transition().duration(500)
        .attr("x1", xScale(2003))
        .attr("y1", vis.h)
        .attr("x2", xScale(2003)) 
        .style("stroke", "black");

        vis.yearLabel2
        .text("2003")
        .transition().duration(500)
          .attr("x", xScale(2003))
          .style("fill", "black");

    } else if (id === 2) {

      vis.line1.transition().duration(500)
        .attr("x1", xScale(2002))
        .attr("y1", vis.h)
        .attr("x2", xScale(2002))
        .style("stroke", "black");

      vis.yearLabel1
      .text("2002")
        .transition().duration(500)
        .attr("x", xScale(2002))
        .style("fill", "black");
        
      vis.line2.transition().duration(500)
        .attr("x1", xScale(2007))
        .attr("y1", vis.h)
        .attr("x2", xScale(2007)) 
        .style("stroke", "black");

      vis.yearLabel2
      .text("2007")
      .transition().duration(500)
        .attr("x", xScale(2007))
        .style("fill", "black");
        
    } else if (id === 3) {

      vis.line1.transition().duration(500)
        .attr("x1", xScale(2002))
        .attr("y1", vis.h)
        .attr("x2", xScale(2002))
        .style("stroke", "black");

      vis.yearLabel1
      .text("2002")
      .transition().duration(500)
        .attr("x", xScale(2002))
        .text("2002")
        .style("fill", "black");

      vis.line2.transition().duration(500)
        .attr("x1", xScale(1999))
        .attr("y1", vis.h)
        .attr("x2", xScale(1999))
        .style("stroke", "black");

      vis.yearLabel2
      .text("1999")
      .transition().duration(500)
        .attr("x", xScale(1999))
        .style("fill", "black");
        
    } else if (id === 4) {

      vis.line1.transition().duration(500)
        .attr("x1", xScale(2016))
        .attr("y1", vis.h)
        .attr("x2", xScale(2016))
        .style("stroke", "black");

      vis.yearLabel1
      .text("2016")
      .transition().duration(500)
        .attr("x", xScale(2016))
        .text("2016")
        .style("fill", "black");

      vis.line2.style("stroke", "transparent");
      vis.yearLabel2.style("fill", "transparent");


    } else if (id === 5) {

      vis.line1.transition().duration(500)
        .attr("x1", xScale(2007))
        .attr("y1", vis.h)
        .attr("x2", xScale(2007))
        .style("stroke", "black");

      vis.yearLabel1
      .text("2016")
      .transition().duration(500)
        .attr("x", xScale(2007))
        .text("2007")
        .style("fill", "black");

      vis.line2.style("stroke", "transparent");
      vis.yearLabel2.style("fill", "transparent");

    } else if (id === 6 || id === 0) {

      vis.line1.style("stroke", "transparent");
      vis.line2.style("stroke", "transparent");
      vis.yearLabel1.style("fill", "transparent");
      vis.yearLabel2.style("fill", "transparent");
    }


}

d3.select("#next").on("click", () => {
  id++
  console.log(id)
  updateGraph()
})

d3.select("#prev").on("click", () => {
  id--
  console.log(id)
  updateGraph()
})