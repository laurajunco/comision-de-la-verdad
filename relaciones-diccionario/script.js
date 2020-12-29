/* Autora: Laura Junco
* Fecha: 23/07/2020
* Copyright: 202, CEV-SIM, GPL o más reciente
*/

var nodes = [];
var edges = [];
var lvlCount = 0;

//importar datos
Promise.all([
    d3.json("./input/nodos_hechos.json"),
    d3.json("./input/edges_hechos.json")

]).then(function(files) {
    nodes = files[0];
    edges = files[1];
    linkedByName = files[2];

    d3.shuffle(nodes)
    nodes.sort(function (a,b) {
            return d3.descending(a.lvl, b.lvl)})
    
    visualize();

}).catch(function(error) {
    console.log(error)
})

//renderizar visualizacion
function visualize() {

    var container = d3.select("#container");
    var $container = $('#container');

    //alto, ancho y padding
    var w = $container.width();
    var h = $container.height();

    //variables de tamaño para las cajas
    var margin = {
        top: 5,
        right: 10,
        bottom: 5,
        left: 10
    };

    var gap = {
        width: w/4/2,
        height: 6
    };

    var boxWidth = w/4.5;
    var boxHeight = 25;

    //lista que guarda el numero de nodos por niveles
    var count = [0,0,0];
    lvlCount = count.length;

    //agregar posicion a los nodos
    nodes.forEach(function(d, i) {
        d.x = margin.left + d.lvl * (boxWidth + gap.width);
        d.y = 60 + margin.top + (boxHeight + gap.height) * count[d.lvl];
        d.id = "n" + d.id;
        count[d.lvl] += 1;
    });

    edges.forEach(function (d) {
        d.source = encontrarNodo(d.source);
        d.target = encontrarNodo(d.target);
        d.id = "l" + d.source.id + d.target.id;
    });

    var diagonal = d3.linkHorizontal()
        .x(function(d) { return d.y; })
        .y(function(d) { return d.x; });

    var force = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-30))
        .force("link", d3.forceLink(edges).distance(40));

    var svg = container.append("svg")
        .attr("width", w)
        .attr("height", h);

    //Agregar titulos
    var tTesauro = svg.append("text")
        .attr("x", margin.left + boxWidth/2 + 0 * (boxWidth + gap.width) )
        .attr("y", 40)
        .attr("class", "title")
        .classed("tesauro", true)
        .text("Tesauro");
    
    var tRuv = svg.append("text")
        .attr("x", margin.left + boxWidth/2 + 1 * (boxWidth + gap.width) )
        .attr("y", 40)
        .attr("class", "title")
        .classed("ruv", true)
        .text("RUV");
    
    var tRuv = svg.append("text")
        .attr("x", margin.left + boxWidth/2 + 2 * (boxWidth + gap.width) )
        .attr("y", 40)
        .attr("class", "title")
        .classed("cnmh", true)
        .text("CNMH");
    
    svg.append("g")
        .attr("class", "lines");

    svg.append("g")
        .attr("class", "nodes");

    //dibujar líneas
    var lines = svg.select(".lines")
        .selectAll("path")
        .data(edges)
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("id", function(d) {return d.id})
        .attr("d", function (d) {
            var oTarget = {
                x: d.target.y + 0.5 * boxHeight,
                y: d.target.x
            };
            var oSource = {
                x: d.source.y + 0.5 * boxHeight,
                y: d.source.x
            };
            
            if (oSource.y < oTarget.y) {
                oSource.y += boxWidth;
            } else {
                oTarget.y += boxWidth;
            }
            return diagonal({
                source: oSource,
                target: oTarget
            });
        });
        
    //grupos para argupar cuadros y etiquetas
    var nodeGroups = svg.select(".nodes")
        .selectAll("g")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "unit");

    //dibujar cuadros
    var rects = nodeGroups.append("rect")
        .attr("x", function (d) { return d.x; })
        .attr("y", function (d) { return d.y; })
        .attr("id", function (d) { return d.id; })
        .attr("width", boxWidth)
        .attr("height", boxHeight)
        .classed(function(d) {return "c" + d.lvl}, true)
        .attr("class", "node")
        .on("mouseover", function(){
            mouseOver(d3.select(this));
        })
        .on("mouseout", mouseOut)

    var yellow =  rects.filter(function(d) {
            return d.lvl === 0;
        }).attr("class", "yellow")
    
    var pink =  rects.filter(function(d) {
            return d.lvl === 1;
        }).attr("class", "pink")

        var gree =  rects.filter(function(d) {
            return d.lvl === 2;
        }).attr("class", "green")
    
    //dibujar etiquetas
    var labels = nodeGroups.append("text")
        .attr("class", "label")
        .attr("x", function (d) { return d.x + 10; })
        .attr("y", function (d) { return d.y + boxHeight/2 + 4; })
        .text(function (d) { 
            var txt = d.nombre.slice(0, -1);

            if (txt.length > boxWidth/6 - 2 ) {
                txt = txt.substring(0,boxWidth/6 - 3)+ "...";
                return txt;
            } else {
                return txt;
            }
        });

    //Interactividad
    function mouseOver(node){
        d = node.datum()
        node.classed("active", true)


        edges.forEach(function(e) {
            if (e.source.id === d.id || e.target.id === d.id) {
                d3.select("#" + e.id).classed("activelink", true);
                d3.select("#" + e.id).raise();
                d3.select("#" + e.source.id ).classed("active", true);
                d3.select("#" + e.target.id ).classed("active", true);
            }
        });
    }

    //volver a apariencia inicial
    function mouseOut(){
        rects.classed("active", false);
        lines.classed("activelink", false);
    }

}

function encontrarNodo(nombre) {
    for (var i = 0; i < nodes.length; i ++) {
        if (nodes[i].nombre === nombre) {
            return nodes[i];
        }
    }
    return null;
}
