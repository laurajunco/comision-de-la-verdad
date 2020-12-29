import * as d3 from 'd3'

class Bubble {

  constructor(element, iniciativas, updateFiltro, width){
    let vis = this;
    vis.iniciativas = iniciativas
    vis.updateFiltro = updateFiltro
      
    vis.MARGIN = { TOP: 10, BOTTOM: 20, LEFT: 10, RIGHT: 10 }
    vis.WIDTH = width - vis.MARGIN.LEFT - vis.MARGIN.RIGHT
    vis.HEIGHT = width/3 - vis.MARGIN.TOP - vis.MARGIN.BOTTOM

    vis.g = d3.select(element)
			.append("svg")
				.attr("width", vis.WIDTH + vis.MARGIN.LEFT + vis.MARGIN.RIGHT)
				.attr("height", vis.HEIGHT + vis.MARGIN.TOP + vis.MARGIN.BOTTOM)
			.append("g")
                .attr("transform", `translate(${vis.MARGIN.LEFT}, ${vis.MARGIN.TOP})`)
                .attr("class", "bubbles");
    
    vis.x = d3.scaleBand()
      .range([vis.HEIGHT/3, vis.WIDTH]);

    vis.r = d3.scaleLinear()
      .range([7, vis.HEIGHT/3]);

    vis.update(iniciativas)	
  }

  update(iniciativas, filtro, filtroValue) {
    const vis = this;
    vis.iniciativas = iniciativas;
    vis.filtro = filtro;
    vis.filtroValue = filtroValue;

    var buckets = []
    vis.buckets = []
    
    if (vis.filtro === "categoria") {

      if (filtroValue === "Gestion pacifica de conflictos") {
        buckets = ["C_41","C_42","C_43"]
      } else if (filtroValue === "Transformaciones para la paz") {
        buckets = ["C_31", "C_32", "C_33", "C_34", "C_35"]
      } else if (filtroValue === "Resistencias no violentas") {
        buckets = ["C_21", "C_22", "C_23", "C_24"]
      }

      buckets.forEach((bucket,i) => {
        let catName = ""
        let catLabel = ""

        if (bucket === "C_21") {
          catLabel = "Defensa de la vida y del territorio"
          catName = "Defensa de la vida"
        } else if (bucket === "C_22") {
          catLabel = "Proteger de ataques selectivos a líderes(as) y activistas"
          catName = "Protección a líderes"
        } else if (bucket === "C_23"){
          catLabel = "Alternativas económicas al/de desarrollo"
          catName = "A. económicas"
        } else if (bucket === "C_24"){
          catLabel = "Defensa de identidades colectivas"
           catName = "Identidades"
        } else if (bucket === "C_31"){
          catLabel = "Cultura y educación de paz"
          catName = "Cultura de paz"
        } else if (bucket === "C_32"){
          catLabel = "Procesos de memoria colectiva"
          catName = "P. de memoria"
        } else if (bucket === "C_33"){
          catLabel = "Organización y articulación a redes"
          catName = "Redes"
        } else if (bucket === "C_34"){
          catLabel = "Procesos de desarrollo y paz"
          catName = "P. de paz"
        } else if (bucket === "C_35"){
          catLabel = "Protección del medioambiente"
          catName = "Medioambiente"
        } else if (bucket === "C_41"){
          catLabel = "Diálogo y negociación específico"
          catName = "D. específico"
        } else if (bucket === "C_42"){
          catLabel = "Diálogo y negociación estratégico"
          catName = "D. estratégico"
        } else if (bucket === "C_43"){
          catLabel = "Procesos de reincorporación y de reconciliación de excombatientes"
          catName = "Reincorporación"
        } else {
          catName = bucket;
          catLabel =bucket;
        }

        vis.buckets[i] = { 
          categoria: bucket,
          value: 0,
          cat_name: catName,
          cat_label: catLabel
        }
      })

      vis.iniciativas.forEach((iniciativa) => {
        for (var i = 0; i < buckets.length; i++) {
          var cat = buckets[i]
          if (iniciativa[cat] === "1") {
            vis.buckets[i].value++
          }
        }
      });
      
    } else if (vis.filtro === "subCategoria") {

      let bucket = vis.filtroValue
      let catName = ""
      let catLabel = ""

      if (bucket === "C_21") {
        catLabel = "Defensa de la vida y del territorio"
        catName = "Defensa de la vida"
      } else if (bucket === "C_22") {
        catLabel = "Proteger de ataques selectivos a líderes(as) y activistas"
        catName = "Protección a líderes"
      } else if (bucket === "C_23"){
        catLabel = "Alternativas económicas al/de desarrollo"
        catName = "A. económicas"
      } else if (bucket === "C_24"){
        catLabel = "Defensa de identidades colectivas"
         catName = "Identidades"
      } else if (bucket === "C_31"){
        catLabel = "Cultura y educación de paz"
        catName = "Cultura de paz"
      } else if (bucket === "C_32"){
        catLabel = "Procesos de memoria colectiva"
        catName = "P. de memoria"
      } else if (bucket === "C_33"){
        catLabel = "Organización y articulación a redes"
        catName = "Redes"
      } else if (bucket === "C_34"){
        catLabel = "Procesos de desarrollo y paz"
        catName = "P. de paz"
      } else if (bucket === "C_35"){
        catLabel = "Protección del medioambiente"
        catName = "Medioambiente"
      } else if (bucket === "C_41"){
        catLabel = "Diálogo y negociación específico"
        catName = "D. específico"
      } else if (bucket === "C_42"){
        catLabel = "Diálogo y negociación estratégico"
        catName = "D. estratégico"
      } else if (bucket === "C_43"){
        catLabel = "Procesos de reincorporación y de reconciliación de excombatientes"
        catName = "Reincorporación"
      } else {
        catLabel = bucket
        catName = bucket
      }

      vis.buckets[0] = { 
        categoria: bucket,
        value: 0,
        cat_name: catName,
        cat_label: catLabel
      }

      vis.iniciativas.forEach((iniciativa) => {
          var cat = bucket
          if (iniciativa[cat] === "1") {
            vis.buckets[0].value++
          }
      });


    } else {
      buckets = [...new Set(iniciativas.map(d => d.categoria))];

      buckets.forEach((bucket,i) => {
        let catName = "";
        let catLabel = "";

        if (bucket === "Gestion pacifica de conflictos") {
          catLabel = "Gestión pacífica de conflictos"
          catName = "Gestión pacífica"
        } else if (bucket === "Transformaciones para la paz") {
          catLabel = "Transformaciones para la paz"
          catName = "Transformaciones"
        } else if (bucket === "Resistencias no violentas"){
          catLabel = "Resistencias no violentas"
          catName = "Resistencias"
        } else if (bucket === "NA"){
          catName = "Otros"
          catLabel = "Otros"
        } else {
          catName = bucket
          catLabel = bucket
        }

        vis.buckets[i] = { 
          categoria: bucket,
          value: 0,
          cat_name: catName,
          cat_label: catLabel
        }
      });

      vis.iniciativas.forEach((iniciativa) => {
        for (var i = 0; i < buckets.length; i++) {
          if (iniciativa.categoria === vis.buckets[i].categoria) {
            vis.buckets[i].value++
          }
        }
      });
    }

    
    vis.buckets = vis.buckets.filter(d => d.cat_name !== "Otros")
    
    vis.buckets.sort((a, b) => d3.descending(a.value, b.value))
    vis.x.domain(vis.buckets.map(d => d.categoria))
    vis.r.domain([0,d3.max(vis.buckets, d => d.value)])

    /*--- DATA JOIN ---*/
    vis.circles = vis.g.selectAll(".circle-cat")
      .data(vis.buckets)

    vis.labels = vis.g.selectAll(".label-cat")
      .data(vis.buckets)

    vis.numbers = vis.g.selectAll(".label-val")
      .data(vis.buckets)
    /*--- EXIT ---*/
    vis.circles.exit()
    .transition().duration(200)
        .attr("r", 0)
        .remove()

    vis.labels.exit()
        .remove()

    vis.numbers.exit()
      .remove()

    /*--- UPDATE ---*/
    vis.circles.transition().duration(500)
      .attr("cy", vis.HEIGHT/3)
      .attr("cx", d => vis.x(d.categoria))
      .attr("r", d => vis.r(d.value))

    vis.labels.transition().duration(500)
      .attr("y", vis.HEIGHT-10)
      .attr("x", d => vis.x(d.categoria))
      .attr("width", 50)
      .text(d => trimText(d.cat_name, vis.x.bandwidth()/6))

    vis.numbers.transition().duration(500)
        .attr("y", vis.HEIGHT/3 + 4)
        .attr("x", d => vis.x(d.categoria))
        .text(d => d.value)

    /*--- ENTER (CREATE) ---*/
    vis.circles.enter()
      .append("circle")
      .attr('class', 'circle-cat')
      .attr("cy", vis.HEIGHT/3)
      .attr("cx", d => vis.x(d.categoria))
      .attr("r", d => vis.r(d.value))
      .on("click", (event, d) => { 
        vis.updateFiltro("categoria",String(d.categoria))
      })
      .on("mouseenter", circleMouseover)
      .on("mouseout", () =>  d3.select("#tooltip-bubble").classed("hidden", true))

    vis.labels.enter()
      .append("text")
        .attr('class', 'label-cat')
        .attr("y", vis.HEIGHT-10)
        .attr("x", d => vis.x(d.categoria))
        .text(d => trimText(d.cat_name, vis.x.bandwidth()/6));

    vis.numbers.enter()
      .append("text")
        .attr('class', 'label-val')
        .attr("y", vis.HEIGHT/3 + 4)
        .attr("x", d => vis.x(d.categoria))
        .attr('text-anchor', "middle")
        .text(d => d.value)


    function circleMouseover(event, d) {   

        var xPosition = parseFloat(event.clientX) + 5;
        var yPosition = parseFloat(event.clientY) + 2;

        let tooltip = d3.select("#tooltip-bubble")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px")
        
        tooltip.select("#nom-cat")
          .text(d.cat_label)

        tooltip.classed("hidden", false);
          
      }
    
    function trimText(text, threshold) {
      if (text.length <= threshold) return text;
        return text.substr(0, threshold).concat("...");
    }
   
  }
}

export default Bubble;


