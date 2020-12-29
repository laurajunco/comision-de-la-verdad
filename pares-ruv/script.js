/* Autora: Laura Junco
* Fecha: 01/07/2020
* Copyright: 202, CEV-SIM, GPL o más reciente
*/

var nodesByName = {};
var edges = {};
var nodes = {};
var thisNodeName = "";
var thisNode = {};
var dataset;
var index = 1;
var total = 0;

//load data
d3.csv("tabla_completa.csv")
    .then(function(data, error){
        if (error) { 
            console.log(error);
        } else {
            dataset = data;
            prepareData(dataset, index);
            visualize();
            
        }
    });

//preparar los datos 
function prepareData(dataset, index) {
    edges = {};
    nodes = {};
    
    var entries = Object.entries(dataset[index]);
    entries.shift();

    //el nodo actual
    thisNodeName = dataset[index]["nombres_hechos"];

    //crear nodos con totales
    entries.forEach(function(d){
        nodesByName[d[0]] = {
            name: d[0], 
            radius: parseFloat(d[1])
        }
        total += parseFloat(d[1]);
    });

    nodes = d3.values(nodesByName);

    //total
    total = 0; 
    nodes.forEach(function(d){       
       total += d.radius;
    });

    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].name === thisNodeName) {
            thisNode = nodes[i]
        }
    }

    //crear lista de conexiones
    for (var i = 0; i < nodes.length; i++) {
        edges[i] = {
            source: thisNode, 
            target: nodes[i]
        }
    }

    edges =  d3.values(edges);

    $('h1').html("Casos relacionados a: " + thisNodeName);
    $('#casos_totales').html("Casos totales de " + thisNodeName + ": " + "<b>" + total + "</b>");

    return true;
}

//renderizar visualizacion
function visualize() {
    
    //contenedor
    var container = d3.select("#container");
    var $container = $('#container');
    
    //alto, ancho y padding
    var w = $container.width();
    var h = $container.height();
    var p = h/20;
    var min = Math.min(w,h);

    //escala de radio
    var rScale = d3.scaleLinear()
              .domain([0, d3.max(nodes, function(d) {return d.radius +1})])
              .range([5, h/20]);

    //layout de fuerza
    var force = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-min/3))
        .force("link", d3.forceLink(edges).distance(min/3))
        .force("center", d3.forceCenter().x(w/2).y(h/2))
        .force('collision', d3.forceCollide().radius(min/12));
        
    //Crear elemento svg
    var svg = container.append("svg")
        .attr("width", w)
        .attr("height", h);

    //Dibujar lineas
    var lines = svg.selectAll("line")
        .data(edges)
        .enter()
        .append("line");

    //Dibujar circulos
    var circles = svg.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .classed("main", false)
        .attr("r", function (d) {
            return rScale(d.radius);
        });

    thisCircle = circles.filter(function(d) { 
            return d.name === thisNodeName;
        })
        .classed("main", true);
    
    //Dibujar textos
    var labels =  svg.selectAll("text.label")
        .data(nodes)
        .enter()
        .append("text")
        .text(function(d) {
            return d.name.substr(0,20) + "...";
        })
        .attr("class", "label")

    var numbers =  svg.selectAll("text.number")
        .data(nodes)
        .enter()
        .append("text")
        .attr("class", "number")
        .text(function(d) {
            return d.radius
        })

    //mouseOver en los nodos
    circles.on("mouseover", function(d) {
        //mostrar textos
        lines.classed("visible", true);
        labels.filter(function(e) {
            return e.name === d.name;
        }).text(function(d) {
            return d.name;
        })

        }).on("mouseout", function(d) {
            //devolver todo a su estilo inicial
            lines.classed("visible", false);
            labels.text(function(d) { return d.name.substr(0,20) + "...";})
        });

    //Cada vez que la simulación ahce 'Tick'
    force.on("tick", function() {

        //posicion de las lineas
        lines.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        //posicion de los circulos
        circles.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        //posicion de los textos
        labels.attr("dx", function(d) { return d.x; })
            .attr("dy", function(d) { return d.y - rScale(d.radius) - 5; });
        
        //posicion de los textos
        numbers.attr("dx", function(d) { return d.x; })
        .attr("dy", function(d) { return d.y + rScale(d.radius) + 15 });
    });

    //Definir eventos en mousedrag
    circles.call(d3.drag()  
        .on("start", dragStarted)
        .on("drag", dragging)
        .on("end", dragEnded));

    //Evento de arrastrar el mouse
    function dragStarted(d) {
        if (!d3.event.active) force.alphaTarget(0.1).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragging(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragEnded(d) {
        if (!d3.event.active) force.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    //update
    circles.on("click", function(d) {

        if(d.name != thisNodeName) {
            prepareData(dataset, d.index);

            //escala de radio
            rScale = d3.scaleLinear()
                .domain([0, d3.max(nodes, function(d) {return d.radius})])
                .range([5, h/20]);

            //layout de fuerza
            force.nodes(nodes)
                .force("link", d3.forceLink(edges).distance(min/3))
                .force('collision', d3.forceCollide().radius(min/12));

            lines.data(edges)

            circles.data(nodes)
                .classed("main", false)
                .attr("r", function (d) {
                    return rScale(d.radius);
                })
                
            circles.filter(function(d) { 
                    return d.name === thisNodeName;
                })
                .classed("main", true);
                
            numbers.data(nodes)
                .text(function(d) {
                    return d.radius
                })

            labels.data(nodes)
                .text(function(d) {
                    return d.name.substr(0,20) + "...";
                })
        }
    })
}
