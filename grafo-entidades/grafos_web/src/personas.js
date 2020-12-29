/* Autora: Laura Junco
* Fecha: 01/07/2020
* Copyright: 202, CEV-SIM, GPL o más reciente
*/

var nodesByName = {};
var linkedByName = {};

//load data
d3.csv("../input/personas.csv")
    .then(function(data, error){
        if (error) { 
            console.log(error);
        } else {

            //Preparar datos
            dataset = data;
            //console.table(dataset, ["source", "target"]);

            // Crear nodos a partir de los nombres
            data.forEach(function(data) {
                data.source = nodeByName(data.source);
                data.target = nodeByName(data.target);
            });

            //objetos de nodos y enlaces
            var nodes = d3.values(nodesByName);
            var edges = dataset;

            //agregar radio a los nodos
            nodes.forEach(function(d){
                var total = 0;
                edges.forEach(function(e) {  
                    if (e.target.name == d.name || e.source.name == d.name) {
                        total++;
                    }
                });
                d.radius = total;
            })

            //diccionario de nodos que se conectan
            edges.forEach (function(d) {
                linkedByName[d.source.name + "," + d.target.name] = true;
            });

            visualize(edges, nodes);
        }
    });

//renderizar visualizacion
function visualize(edges,nodes) {
    
    //contenedor
    var container = d3.select("#container");
    var $container = $('#container');
    
    //alto, ancho y padding
    var w = $container.width();
    var h = $container.height();
    var p = h/20;

    //escala de radio
    var rScale = d3.scaleLinear()
              .domain([0, d3.max(nodes, function(d) {return d.radius})])
              .range([2, h/30]);

    //layout de fuerza
    var force = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-30))
        .force("link", d3.forceLink(edges).distance(40))
        .force("center", d3.forceCenter().x(w/2).y(h/2))
        .force('collision', d3.forceCollide().radius(function(d) {
            return rScale(d.radius) + h/35;
        }));
        
        
    //Crear elemento svg
    var svg = container.append("svg")
        .attr("width", w)
        .attr("height", h);

    //Dibujar lineas
    var lines = svg.selectAll("line")
        .data(edges)
        .enter()
        .append("line")
        .style("stroke", "lightgrey")
        .style("stroke-width", 0.5);

    //Dibujar circulos
    var circles = svg.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .style("fill", "#73CACB")
        .attr("r", function (d) {
            return rScale(d.radius);
        });

    //Dibujar textos
    var labels =  svg.selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .text(function(d) {
            return d.name;
        })
        .classed("hidden", true);

    //Definir eventos en mousedrag
    circles.call(d3.drag()  
        .on("start", dragStarted)
        .on("drag", dragging)
        .on("end", dragEnded));

    //mouseOver en los nodos
    circles.on("mouseover", function(d) {

        //mostrar enlaces del nodo
        lines.filter( function(e) {  
                return e.target.name == d.name || e.source.name == d.name; 
            })
            .style('stroke-width', 0.5)
            .style('stroke','#73CACB');
        
        //mostrar nodos conectados
        circles.filter(function(e){
            return isConnected(d,e);
        })
        .style('fill','#73CACB');

        //poner más opacos los nodos no conectados
        circles.filter(function(e){
            return !isConnected(d,e);
        })
        .style('fill','lightgrey');

        //mostrar textos
        labels.filter(function(e){
            return isConnected(d,e);
        })
        .classed("hidden", false);

        //cambiar color de nodo seleccionado
        d3.select(this)
            .style("fill", "F26D4D");
        })
        .on("mouseout", function(d) {
            //devolver todo a su estilo inicial
            circles.style("fill",'#73CACB');
            labels.classed("hidden", true);
            lines.style("stroke", "lightgrey")
                .style("stroke-width", 0.5);
        });

    //revisar en el diccionario si los nodos están conectados
    function isConnected(a, b) {
        return linkedByName[a.name + "," + b.name] || linkedByName[b.name + "," + a.name] || a.name == b.name;
    }

    //Cada vez que la simulación ahce 'Tick'
    force.on("tick", function() {

        //posicion de las lineas
        lines.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        //posicion de los circulos
        circles.attr("cx", function(d) { return d.x = Math.max(d.radius + p, Math.min(w - (d.radius + p), d.x)); })
            .attr("cy", function(d) { return d.y = Math.max(d.radius + p, Math.min(h - (d.radius + p), d.y)); });

        //posicion de los textos
        labels.attr("dx", function(d) { return d.x; })
            .attr("dy", function(d) { return d.y - d.radius - 8; });
    });

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
}

//llena un Json con los nombres de los nodos
function nodeByName(name) {
    return nodesByName[name] || (nodesByName[name] = {name: name});
}

