import * as d3 from 'd3'

class RadialViz {

    constructor(element, periodos, hechos, iniciativas, datos_depto, deptos, updateFiltro, width) {
        
        let vis = this;
        vis.periodos = periodos;
        vis.hechos = hechos;
        vis.iniciativas = iniciativas;
        vis.datos_depto = datos_depto;
        vis.deptos = deptos;
        vis.updateFiltro = updateFiltro
        vis.format = d3.format(",");
        
        vis.MARGIN = { TOP: 3, BOTTOM: 3, LEFT: 3, RIGHT: 3 }
        vis.WIDTH = width - vis.MARGIN.LEFT - vis.MARGIN.RIGHT
        vis.HEIGHT = width - vis.MARGIN.TOP - vis.MARGIN.BOTTOM
        vis.OUTER = width/2.5 - (vis.MARGIN.LEFT + vis.MARGIN.TOP);

        if (width < 700) {
          vis.INNER = width/2.5 - (vis.MARGIN.LEFT + vis.MARGIN.TOP) - 22;
        } else {
          vis.INNER = width/2.5 - (vis.MARGIN.LEFT + vis.MARGIN.TOP) - 25;
        }
        

        vis.g = d3.select(element)
          .append("svg")
            .attr("width", vis.WIDTH + vis.MARGIN.LEFT + vis.MARGIN.RIGHT)
            .attr("height", vis.HEIGHT + vis.MARGIN.TOP + vis.MARGIN.BOTTOM)
              .append("g")

        vis.update(periodos, hechos, iniciativas, datos_depto)	
    }

    update() {

        const vis = this;   
        vis.drawBars();
        vis.drawLine();
        vis.drawDonut();
        vis.drawMap();
    }

    drawMap() {
      const vis = this;

      let wMapa = vis.INNER - 100;
      let hMapa = vis.INNER - 100;

      vis.projection = d3.geoMercator()
        .scale(vis.OUTER*5)
        .center([-74, 4.5])
        .translate([wMapa/3, hMapa/2]);

      vis.path = d3.geoPath(vis.projection)

      vis.r = d3.scaleLinear()
        .range([2,vis.INNER/10])
        .domain([
            d3.min(vis.datos_depto, function(d) { return parseFloat(d.count); }),
            d3.max(vis.datos_depto, function(d) { return parseFloat(d.count); })
        ]);

      vis.mapGroup = vis.g.append("g")
        .attr("transform", "translate(" + (vis.WIDTH/2 - wMapa /2)+ "," + (vis.HEIGHT/2 - hMapa/2)+ ")")

      for (var i = 0; i < vis.datos_depto.length; i++) {

        let dataDep = vis.datos_depto[i].depto;
        let dataNom = vis.datos_depto[i].name;
        let dataValue = parseFloat(vis.datos_depto[i].count);

        for (var j = 0; j < vis.deptos.features.length; j++) {

          let jsonDep = vis.deptos.features[j].properties.NOMBRE_DPT;
          vis.deptos.features[j].properties.centroid = vis.path.centroid(vis.deptos.features[j]);
          
          if (dataDep === jsonDep) {
              vis.deptos.features[j].properties.value = dataValue;
              vis.deptos.features[j].properties.name = dataNom;
              vis.deptos.features[j].properties.radius = vis.r(dataValue);
              break;
          }
        }
      }

      vis.deptosPaths = vis.mapGroup.selectAll("path")
        .data(vis.deptos.features)
        .enter()
        .filter(d => d.properties.DPTO !== 88)
        .append("path")
        .attr("d", vis.path)
        .attr("class", "dept")

      vis.circles = vis.mapGroup.selectAll("circle")
          .data(vis.deptos.features)
          .enter()
          .append("circle")
          .attr("class", "circle")
          .attr("id", d => 'd-' + d.properties.DPTO)
          .attr("cx", d => d.properties.centroid ? d.properties.centroid[0] : 0)
          .attr("cy", d => d.properties.centroid ? d.properties.centroid[1] : 0)
          .attr("r", d => d.properties.radius)
          .on("click", (event, d) => { vis.updateFiltro("depto",d.properties.NOMBRE_DPT, d.properties.name)})
          .on("mouseover", (d,i) => {
  
            var xPosition = d.clientX + 5;
            var yPosition = d.clientY + 5;
  
            //Update the tooltip position and value
            d3.select("#depto-tooltip")
            .style("left", xPosition +"px")
            .style("top", yPosition + "px")
            .select("#iniciativas-depto")
            .text('Iniciativas: ' + vis.format(i.properties.value));
  
            d3.select("#depto-tooltip")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px")
            .select("#depto")
            .text(i.properties.name);
  
            d3.select("#depto-tooltip").classed("hidden", false);
        })
        .on("mouseout", (d,i) => {
          d3.select("#depto-tooltip").classed("hidden", true);
        })
    }

    drawBars() {
      const vis = this;

      for (var i = 0; i < vis.iniciativas.length; i++) {
        var dataAnio = vis.iniciativas[i].anio;
        var dataValue = parseFloat(vis.iniciativas[i].count);

        for (var j = 0; j < vis.hechos.length; j++) {
            var hechosAnio = vis.hechos[j].anio;
            
            if (dataAnio === hechosAnio) {
                vis.hechos[j].iniciativas = dataValue;
                break;
            }
        }
      }

      vis.x = d3.scaleBand()
        .range([0, 2 * Math.PI]) 
        .domain(vis.hechos.map(d => d.anio)); 

      vis.y = d3.scaleLinear()
        .domain([0, d3.max(vis.hechos, d => +d.masacres + +d.desplazamiento + +d.asesinatos + +d.despojo + +d.tortura)])
        .range([vis.OUTER, vis.OUTER + vis.INNER/4 - 5]);

      vis.bargroup = vis.g.append("g")
        .attr("transform", "translate(" + vis.WIDTH/2 + "," + vis.WIDTH/2+ ")")

      vis.bars = vis.bargroup.append("g")
        .selectAll(".bar")
        .data(vis.hechos)
        .enter()
        .append("path")
          .attr("class", "bar")
          .attr("id", d => "no-" + d.anio)
          .attr("d", d3.arc()
            .innerRadius(vis.OUTER)
            .outerRadius(d => vis.y(+d.masacres + +d.desplazamiento + +d.asesinatos + +d.despojo + +d.tortura))
            .startAngle( d => vis.x(+d.anio))
            .endAngle(d => vis.x(+d.anio) + vis.x.bandwidth())
            .padAngle(0.02)
            .padRadius(vis.INNER))
            .on("mouseover", (d,i) => {

              var xPosition = d.clientX + 5;
              var yPosition = d.clientY + 5;

              //Update the tooltip position and value
              d3.select("#anio-tooltip")
              .style("left", xPosition +"px")
              .style("top", yPosition + "px")
              .select("#hechos-anio")
              .text(vis.format((+i.masacres + +i.desplazamiento + +i.asesinatos + +i.despojo + +i.tortura)) + ' hechos');

              d3.select("#anio-tooltip")
              .select("#anio")
              .text(i.anio);

              d3.select("#anio-tooltip")
              .select("#masacre-anio")
              .text(vis.format(i.masacres) + ' masacres');

              d3.select("#anio-tooltip")
              .select("#desplazamiento-anio")
              .text(vis.format(i.desplazamiento) + ' desplazamientos forzados');

              d3.select("#anio-tooltip")
              .select("#asesinato-anio")
              .text(vis.format(i.asesinatos) + ' asesinatos selectivos');

              d3.select("#anio-tooltip")
              .select("#despojo-anio")
              .text(vis.format(i.despojo) + ' despojos');

              d3.select("#anio-tooltip")
              .select("#tortura-anio")
              .text(vis.format(i.despojo) + ' torturas');

              d3.select("#anio-tooltip")
              .select("#iniciativas-anio")
              .text(vis.format(i.iniciativas) + ' iniciativas');

              d3.select("#anio-tooltip").classed("hidden", false);
          })
          .on("mouseout", (d,i) => {       
              d3.select("#anio-tooltip").classed("hidden", true);
          })
    }

    drawLine() {
      const vis = this;
      vis.anios = [];
      vis.iniciativas.forEach(d => vis.anios.push(d.anio));
      vis.numAnios = vis.anios.length;
      vis.increment =  Math.PI*2 / (vis.numAnios);

      vis.x = d3.scaleLinear()
        .range([0, 2 * Math.PI]) 
        .domain([d3.min(vis.iniciativas, d => +d.anio +0.5 ), d3.max(vis.iniciativas, d => +d.anio +0.5)]) 

      vis.y = d3.scaleLinear()
        .range([vis.OUTER, vis.OUTER + vis.INNER/4 - 5])
        .domain([0, d3.max(vis.iniciativas, d => +d.count)])

      vis.area = d3.areaRadial()
        .curve(d3.curveBasisClosed)
        .angle(d => vis.x(d.anio))

      vis.areaGroup = vis.g.append("g")
        .attr("transform", "translate(" + vis.WIDTH/2 + "," + vis.HEIGHT/2+ ")")

      vis.areaGroup.append("path")
        .datum(vis.iniciativas)
        .attr("class", "area")
        .attr("d", vis.area
          .innerRadius(d => vis.OUTER - 3)
          .outerRadius(d => vis.y(d.count)));
    }

    drawDonut() {
      const vis = this;

      vis.anios = [];
      vis.iniciativas.forEach(d => vis.anios.push(d.anio));
      vis.numAnios = vis.anios.length;
      vis.increment =  Math.PI*2 / (vis.numAnios);
      
      vis.pie = d3.pie()
        .value((d) => d.duracion)
        .sort(null);

      vis.arc = d3.arc()
        .innerRadius( vis.INNER)
        .outerRadius( vis.OUTER - 1);

      vis.angle = (d) => {
          let radians = d * 180/ Math.PI
          return radians
        }

      vis.arcs = vis.g.selectAll(".arc")
        .data(vis.pie(vis.periodos))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + vis.WIDTH/2 + ", " + vis.HEIGHT/2 + ")");

      vis.arcs.append("path")
        .attr("class", "donutArc")
        .attr("id", (d, i) => "arc-" + i)
        .attr("d", vis.arc)
        .each((d,i) => {

          let firstArcSection = /(^.+?)L/;
          let newArc = firstArcSection.exec( d3.select("#arc-" + i).attr("d") )[1];
          newArc = newArc.replace(/,/g , " ");

          //arco invisible
          vis.g.append("path")
            .attr("class", "hiddenDonutArcs")
            .attr("id", "p-" + i)
            .attr("d", newArc)
        });

      vis.textPresidentes = vis.arcs.append('text')
        .attr('class', 'arc-text')
        .attr("dy", 16)
        .append("textPath")
          .attr("startOffset","50%")
          .attr("xlink:href", (d,i) => "#p-"+i)
          .text((d) => {
            if (vis.WIDTH < 700 && d.data.presidente === "Duque") {
              return "D."
            } 
            return d.data.presidente
          });

        vis.yearWrapper = vis.g.append("g")
          .attr("width", vis.WIDTH + vis.MARGIN.LEFT + vis.MARGIN.RIGHT)
          .attr("height", vis.HEIGHT + vis.MARGIN.TOP + vis.MARGIN.BOTTOM)
          .attr("transform", "translate(" + vis.WIDTH/2 + ", " + vis.HEIGHT/2 + ")");


        vis.yearLines = vis.yearWrapper.selectAll(".yearLine")
          .data(vis.anios)
          .enter()
          .append("line")
          .attr("class", "yearLine")
          .attr("x1", (d, i) => vis.OUTER * Math.sin(-(vis.increment*i) + Math.PI))
          .attr("y1", (d, i) => vis.OUTER * Math.cos(-(vis.increment*i) + Math.PI))
          .attr("x2", (d, i) => (vis.OUTER + vis.INNER/4 - 5) * Math.sin(-(vis.increment*i) + Math.PI))
          .attr("y2", (d, i) => (vis.OUTER + vis.INNER/4 - 5) * Math.cos(-(vis.increment*i) + Math.PI))
          
      vis.yearNames = vis.yearWrapper.selectAll(".yearName")
          .data(vis.anios)
          .enter()
          .append("text")
          .attr("class", "yearName")
          .attr("x", (d, i) => (vis.OUTER + vis.INNER/4 + 5) * Math.sin(-(vis.increment*i) + Math.PI) )
          .attr("y", (d, i) => (vis.OUTER + vis.INNER/4 + 5) * Math.cos(-(vis.increment*i) + Math.PI) + 5)
          .text(d => {
            if (d === "2000") {
              return "'00"
            }
            if (d > 2000) {
              if (d-2000 < 10 && d-2000 > 0) {
                return "'0"+(d-2000)
              }
              return "'"+(d-2000)
            } else {
              return "'"+(d-1900)
            }
          }).on("click", (event, d) => { vis.updateFiltro("inicio",String(d))})

    }    
}

export default RadialViz;