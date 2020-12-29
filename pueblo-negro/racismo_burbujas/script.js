let data = [];
let buckets = {};
let keys = [];
let id = 0;
let title = $('#title');
let des = $('#des');

let titleText = [
  "Índice de movilización de recursos en municipios afrodescendientes y no afrodescendientes",
  "Índice de ejecución de recursos en municipios afrodescendientes y no afrodescendientes",
  "Indicador de gestión presupuestal para seguridad",
  "Indicador de gestión presupuestal para educación",
  "Indicador de gestión presupuestal para salud",
  "Indicador de gestión presupuestal para servicios",
  "Puntaje agregado de indicadores de gestión presupuestal",
  "Indicador de medición de desempeño municipal",
  "Índice de pobreza multidimensional",
  "Índice de pobreza multidimensional en zona rural",
  "Proporción de personas que viven en miseria",
  "Indicador de no acceso a condiciones vitales y sanitarias mínimas",
  "Porcentaje de personas en hogares con inasistencia escolar",
  "Porcentaje de hogares en déficit cualitativo",
  "Porcentaje de hogares en déficit cuantitativo y cualitativo",
  "Porcentaje de hogares en déficit cuantitativo",
  "Porcentaje de hogares en hacinamiento no mitigable",
  "Porcentaje de hogares en hacinamiento mitigable"
]

let desText = [
  "",
  "",
  "De manera particular, cuando se mira cada elemento de la medición, la gestión en presupuestos de la seguridad en los municipios afrodescendientes es mayor que en el resto del país. Sin embargo, cuando se mira la gestión de recursos en aspectos indispensables para la vida, como la salud y la educación, los índices son 83 y 40, respectivamente. Ambos índices están 2 y 8 unidades por debajo del indicador para el promedio del resto del país.",

  "De manera particular, cuando se mira cada elemento de la medición, la gestión en presupuestos de la seguridad en los municipios afrodescendientes es mayor en el resto del país. Sin embargo, cuando se mira la gestión de recursos en aspectos indispensables para la vida, como la salud y la educación, los índices son 83 y 40, respectivamente. Ambos índices están 2 y 8 unidades por debajo del indicador para el resto del país.",

  "De manera particular, cuando se mira cada elemento de la medición, la gestión en presupuestos de la seguridad en los municipios afrodescendientes es mayor en el resto del país. Sin embargo, cuando se mira la gestión de recursos en aspectos indispensables para la vida, como la salud y la educación, los índices son 83 y 40, respectivamente. Ambos índices están 2 y 8 unidades por debajo del indicador para el resto del país.",

  "De manera particular, cuando se mira cada elemento de la medición, la gestión en presupuestos de la seguridad en los municipios afrodescendientes es mayor en el resto del país. Sin embargo, cuando se mira la gestión de recursos en aspectos indispensables para la vida, como la salud y la educación, los índices son 83 y 40, respectivamente. Ambos índices están 2 y 8 unidades por debajo del indicador para el resto del país.",

  "De manera particular, cuando se mira cada elemento de la medición, la gestión en presupuestos de la seguridad en los municipios afrodescendientes es mayor en el resto del país. Sin embargo, cuando se mira la gestión de recursos en aspectos indispensables para la vida, como la salud y la educación, los índices son 83 y 40, respectivamente. Ambos índices están 2 y 8 unidades por debajo del indicador para el resto del país.",

  "El MDM registra varios componentes sobre ejecución presupuestal y gestión de los entes territoriales. En términos generales los municipios afrodescendientes tienen en promedio una medición peor que el resto de municipios del país, específicamente existe una diferencia de 6 unidades, los pueblos afros tienen un indicador de 46.6 mientras que los demás muncipios tienen un puntaje de 50.6.",

  "El índice de pobreza multidimensional para los municipios no afrosdecendientes es de 40.4; por otro lado los municipios afrodescendientes tienen en promedio un índice de 55.4, siendo la pobreza –de acuerdo a este índice– 15 unidades superior en los territorios negros.",

  "En la zona rural en general la pobreza se incrementa, sin embargo, este índice es mucho mayor en los pueblos afrodescendientes, con un índice total de 62.9. A modo de comparación, la pobreza en la zona rural de los municipios afrodescendientes es en promedio el doble de lo que es en la zona rural de Bogotá, donde el IPM es de 31.5.",

  "La proporción de personas que viven en miseria en los pueblos negros es 2.6 veces mayor que en los municipios sin mayoría de población afro. Específicamente, el porcentaje de población en miseria en municipios negros es de 13%, mientras que en los demás municipios, en promedio la proporción de miseria es 5.75%. En promedio, mientras en un municipio de 100 mil habitantes hay 5 mil ciudadanos y ciudadanas que viven en miseria, en un territorio afro la proporción asciende a 13 mil.",

  "Este indicador expresa en forma más directa el no acceso a condiciones vitales y sanitarias mínimas. En promedio, el 27% de los municipios afrodescendientes tiene un sistema de servicios públicos y sanitarios inadecuado, además de indigno para un ciudadano o ciudadana. En contraposición, el resto del país cuenta con 6% de la población en estas condiciones, esto significa que el pueblo afro aún, en el 2018, presenta una inasistencia de servicios 4.5 veces mayor.",

  "La inasistencia escolar para niñas y niños entre 6 y 12 años en municipios afro es en promedio del 3.5%, mientras que en un municipio no afro este indicador corresponde al 2% de las niñas y niños. Este índice considera los hogares donde uno o más niños entre 7 y 11 años que sean parientes del jefe de hogar no asisten a un centro de educación formal.",

  "Hace referencia a las viviendas particulares que presentan carencias habitacionales en los atributos referentes a la estructura, espacio y a la disponibilidad de servicios públicos domiciliarios y por tanto, requieren mejoramiento o ampliación de la unidad habitacional en la cual viven.",

  "Hace referencia a hogares que habitan en viviendas particulares que presentan carencias habitacionales tanto por déficit cuantitativo como cualitativo y por tanto requieren una nueva vivienda o mejoramiento o ampliación de la unidad habitacional en la cual viven.",

  "Estima la cantidad de viviendas que la sociedad debe construir o adicionar para que exista una relación uno a uno entre las viviendas adecuadas y los hogares que necesitan alojamiento, es decir, se basa en la comparación entre el número de hogares y el número de viviendas apropiadas existentes.",

  "Se consideran en esta situación a los hogares que habitan en viviendas con cinco o más personas por cuarto (excluye cocina, baños y garajes).",

  "Se consideran en esta situación a los hogares que habitan en viviendas con más de tres a menos de cinco personas por cuarto (excluye cocina, baños y garajes)."
]
//load data
d3.csv("../data/racismo_con.csv").then((d) => {
  
  data = d;
  keys = data.columns.slice(1);

  visualizeBurbuja();
}).catch(function(err) {
  console.log(err)
})  

function visualizeBurbuja() {
  vis = this;

  //contenedor
  vis.$container = $('#container-1');
  vis.margin = { TOP: 10, BOTTOM: 10, LEFT: 10, RIGHT: 10 }
  vis.w = vis.$container.width() - vis.margin.LEFT - vis.margin.RIGHT;
  vis.h = vis.w/1.8 - vis.margin.TOP - vis.margin.BOTTOM
  vis.diameter = Math.min(vis.w, vis.h);
  vis.format = d3.format(",")

  vis.colors = d3.scaleOrdinal()
    .domain(["mpio no afro","mpio afro"])
    .range(["#F2F2F2", "#F5AF4D"])

  vis.svg = d3.select("#container-1")
						.append("svg")
						.attr("width", vis.w + vis.margin.LEFT + vis.margin.RIGHT)
            .attr("height", vis.h + vis.margin.TOP + vis.margin.BOTTOM)
            .append("g")
                .attr("transform", `translate(${vis.margin.LEFT }, ${vis.margin.LEFT})`)

    updateGraph();

}

function updateGraph() {
  if (id === 18 || id === -1) {
    id = 0;
  }

  vis = this
  title.html(titleText[id])
  des.html(desText[id])

  buckets = [
    { key: "mpio no afro", value: +data[0][keys[id]] },
    { key: "mpio afro", value: +data[1][keys[id]] }
  ]
  
  buckets.children = buckets;
  vis.bubble = d3.pack(buckets)
                .size([vis.w, vis.h])
                .padding(10);

  //sumar todos los nodos
  vis.nodes = d3.hierarchy(buckets)
    .sum(d => d.value);

  vis.circles = vis.svg.selectAll(".bubble")
    .data(vis.bubble(vis.nodes).children)

    vis.circles.enter()
      .append("circle")
      .attr("class", "bubble")
      .attr("transform", (d) =>`translate( ${d.x}, ${d.y})` )
      .attr("r", d => d.r)
      .style("fill", d => vis.colors(d.data.key))
      .style("cursor", "pointer")
    
    vis.circles.transition().duration(1000)
      .attr("transform", (d) =>`translate( ${d.x}, ${d.y})` )
      .attr("r", d => d.r)
    
  //textos
  vis.labels = vis.svg.selectAll(".label")
    .data(vis.bubble(vis.nodes).children)
    
  vis.labels.enter()
    .append("text")
    .attr("class", "label")
    .attr("transform", (d) =>`translate( ${d.x}, ${d.y + 2*d.r/3 - d.r/2 + d.r/4 + 2})` )
    .attr("text-anchor", "middle")
    .style("font-size", d => d.r/5)
    .text(d => d.data.key)

  vis.labels.transition().duration(1000)
    .attr("transform", (d) =>`translate( ${d.x}, ${d.y + 2*d.r/3 - d.r/2 + d.r/4 + 2})` )
    .style("font-size", d => d.r/5)
    .text(d => d.data.key)
    
  vis.value = vis.svg.selectAll(".value")
    .data(vis.bubble(vis.nodes).children)
    
  vis.value.enter()
    .append("text")
    .attr("class", "value")
    .attr("transform", (d) =>`translate( ${d.x}, ${d.y + 2*d.r/3 - d.r/2})` )
    .attr("text-anchor", "middle")
    .style("font-size", d => d.r * 0.5)
    .text(d => d.value)
  
  vis.value.transition().duration(1000)
    .attr("transform", (d) =>`translate( ${d.x}, ${d.y + 2*d.r/3 - d.r/2})` )
    .style("font-size", d => d.r * 0.5)
    .text(d => d.value)


}


d3.select("#next").on("click", () => {
  id++
  updateGraph()
})

d3.select("#prev").on("click", () => {
  id--
  updateGraph()
})