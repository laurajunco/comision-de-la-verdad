let data = [];
let keys = [];
let selected = "todos";
let ocul = false
//load data
d3.csv("../data/hechos_etnia.csv").then((d) => {
  
  data = d;
  keys = data.columns.slice(1);
  //data = data.filter(d => d.hecho !== "Desplazamiento forzado")
  
  data.sort((a, b) => d3.descending(
                          Number(a[keys[0]]) + 
                          Number(a[keys[1]]) + 
                          Number(a[keys[2]]), 
                          Number(b[keys[0]]) + 
                          Number(b[keys[1]]) + 
                          Number(b[keys[2]])
                        ));
  visualize();
}).catch(function(err) {
  console.log(err)
})  

function visualize() {
  vis = this;

  //contenedor
  vis.$container = $('#container-etnia');
  vis.margin = { TOP: 10, BOTTOM: 150, LEFT: 50, RIGHT: 10 }
  vis.w = vis.$container.width() - vis.margin.LEFT - vis.margin.RIGHT;
  vis.h = vis.w/1.4 - vis.margin.TOP - vis.margin.BOTTOM

  vis.colors = d3.scaleOrdinal()
    .domain([3])
    .range(["#326C48","#F5AF4D","#F2F2F2"])

  vis.svg = d3.select("#container-etnia")
						.append("svg")
						.attr("width", vis.w + vis.margin.LEFT + vis.margin.RIGHT)
            .attr("height", vis.h + vis.margin.TOP + vis.margin.BOTTOM)
            .append("g")
                .attr("transform", `translate(${vis.margin.LEFT}, ${vis.margin.TOP})`)
 
  
  vis.stack = d3.stack()
    .keys(keys)
    .order(d3.stackOrderDescending);
              
  vis.series = stack(data)
  
  vis.xScale = d3.scaleBand()
    .domain(data.map(d => d.hecho))
    .range([0, vis.w])
    .paddingInner(0.1);
        
  //var yScale = d3.scaleSymlog()
  vis.yScale = d3.scaleLinear()
    .domain([
      0, d3.max(data, (d) => Number(d[keys[0]]) + 
                              Number(d[keys[1]]) + 
                              Number(d[keys[2]]))
      ])
    .range([vis.h, 3]);

   
  vis.yAxisGroup = vis.svg.append("g")
    .attr('transform', 'translate(-2, 0)')
    .attr('class', 'yAxis')
    
  
  vis.yAxisCall = d3.axisLeft(vis.yScale)
    .ticks(null, "s")
    .tickSize(-vis.w, 0, 0)

  vis.yAxisGroup.transition(1000).call(vis.yAxisCall)

  vis.xAxisGroup = vis.svg.append("g")
    .attr('transform', `translate(0, ${vis.h})`)
    .attr('class', 'xAxis')
  
  vis.xAxisCall = d3.axisBottom(vis.xScale)
    .tickSizeOuter(0)
    .tickFormat( function(d) { 
      return d 
    } );

  vis.xAxisGroup.call(vis.xAxisCall)
    
  vis.groups = vis.svg.selectAll(".groups")
    .data(series)
    .enter()
    .append("g")
    .attr('class', 'groups')
    .style("fill", (d, i) => colors(i));

  vis.rects = vis.groups.selectAll("rect")
    .data((d) => d)
    .enter()
    .append("rect")
    .attr("x", (d, i) =>  vis.xScale(d.data.hecho))
    .attr("y", (d) => vis.yScale(d[1]))
    .attr("height", (d) => vis.yScale(d[0]) - vis.yScale(d[1]))
    .attr("width", vis.xScale.bandwidth());
    
    vis.svg.selectAll(".xAxis .tick text")
      .call(wrap, vis.xScale.bandwidth() - 2);

  //label eje y 
  vis.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - vis.margin.LEFT)
      .attr("x",0 - (h / 2))
      .attr("dy", "1em")
      .attr("class", "axis-label")
      .style("text-anchor", "middle")
      .text("Número de víctimas");      
}

function wrap(text, width) {
  
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
 
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function updateBars(cat, ocultarDes) {
  vis = this
  selected = cat;
  let des = $('#des');
  let textDes = ""


  let datos = data.map(a => ({...a}));

  if(ocultarDes) {
    datos = datos.filter(d => d.hecho !== "Desplazamiento forzado")

  }
  
  if (cat === "palenque") {
    datos.forEach(d => {
      d[keys[0]] = 0;
      d[keys[2]] = 0;
    })
    vis.yScale.domain([0, d3.max(datos, (d) => Number(d[keys[1]]))])

    textDes = "¿Notaste que hay un aumento en el hecho victimizante “secuestro” para las comunidades palenqueras con respecto a las afrocolombianas y raizales?"

  } else if (cat === "afro") {
    datos.forEach(d => {
      d[keys[1]] = 0;
      d[keys[2]] = 0;
    })
    vis.yScale.domain([0, d3.max(datos, (d) => Number(d[keys[0]]))])

    textDes = "El pueblo afrodescendiente es el más victimizado entre los 3 pueblos descritos, especialmente porque son los de mayor cantidad de personas."

  } else if (cat === "raizal") {
    datos.forEach(d => {
      d[keys[0]] = 0;
      d[keys[1]] = 0;
    })
    vis.yScale.domain([0, d3.max(datos, (d) => Number(d[keys[2]]))])

    textDes = "Cuando hablamos del conflicto armado interno pocas veces se menciona lo que sucede en nuestras islas. ¿Relacionas esta realidad con otros aspectos relacionados a San Andrés y Providencia?"

  } else if (cat === "todos") {
    vis.yScale.domain([0, d3.max(datos, (d) => Number(d[keys[0]]) + Number(d[keys[1]]) + Number(d[keys[2]]))])

    if(!ocultarDes ) {
      textDes = "Al igual que con los pueblos indígenas, el desplazamiento forzado ha sido el hecho del cual han sido víctimas en mayor medida los pueblos afrocolombianos, palenqueros y raizales de Colombia."
    }
  }

  if(ocultarDes ) {
    textDes = "Sin considerar ahora la desproporción del Desplazamiento Forzado sufrido por los pueblos étnicos afrocolombianos, palenqueros y raizales, podemos reconocer que existen otros 14 hechos victimizantes que han afectado también a estas personas."
  }

  des.html(textDes)

  vis.xScale.domain(datos.map(d => d.hecho))
  vis.series = stack(datos)
  
  //grupos
  vis.groups = vis.svg.selectAll(".groups")
  .data(series)

  vis.groups.enter()
    .append("g")
    .attr('class', 'groups')
    .style("fill", (d, i) => colors(i));

  vis.groups.transition().duration(1000)
    .style("fill", (d, i) => colors(i));

  vis.groups.exit()
    .remove();

  vis.rects = vis.groups.selectAll("rect")
    .data((d) => d)

  //rectangulos
  vis.rects.enter()
    .append("rect")
    .attr("x", (d, i) =>  vis.xScale(d.data.hecho))
    .attr("y", (d) => vis.yScale(d[1]))
    .attr("height", (d) => vis.yScale(d[0]) - vis.yScale(d[1]))
    .attr("width", vis.xScale.bandwidth());

  vis.rects.transition().duration(1000)
    .attr("x", (d, i) =>  vis.xScale(d.data.hecho))
    .attr("y", (d) => vis.yScale(d[1]))
    .attr("height", (d) => vis.yScale(d[0]) - vis.yScale(d[1]))
    .attr("width", vis.xScale.bandwidth());

  vis.rects.exit()
      .remove();

  //eje x
  vis.xAxisGroup.call(vis.xAxisCall)
  vis.svg.selectAll(".xAxis .tick text")
      .call(wrap, vis.xScale.bandwidth() - 2);

  //eje y
  vis.yAxisCall = d3.axisLeft(vis.yScale)
    .ticks(null, "s")
    .tickSize(-vis.w, 0, 0)

  vis.yAxisGroup.transition().duration(1000).call(vis.yAxisCall)

}


d3.select("#afro").on("click", () => {updateBars("afro", ocul)})
d3.select("#palenque").on("click", () => {updateBars("palenque", ocul)})
d3.select("#raizal").on("click", () => {updateBars("raizal", ocul)})
d3.select("#todos").on("click", () => {updateBars("todos", ocul)})
d3.select("#desplazamiento").on("click", () => {
  let bot = $('#desplazamiento');
  if (bot.hasClass("active")) { //desactivar

    ocul = false
    bot.removeClass("active", false);
    bot.addClass("inactive", true);
    updateBars(selected, ocul)
    bot.html("Ocultar desplazamiento forzado")
    
  } else { //activar
    
    ocul = true;
    bot.addClass("active", true);
    bot.removeClass("inactive", false);
    updateBars(selected, ocul)
    bot.html("Mostrar desplazamiento forzado")
  }

  
})



