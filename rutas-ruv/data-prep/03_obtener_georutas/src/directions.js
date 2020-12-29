

var body = {};
var ruta = {};
var rutas = [];

Promise.all([
    d3.csv("../input/coordenadas.csv"),

]).then(function(data) {
    rutas = data[0];
    let i = 0 
    
    var interval = setInterval( () => {
        let request = new XMLHttpRequest();

        let lon_salida = rutas[i]["lon_salida"];
        let lat_salida = rutas[i]["lat_salida"];

        let lon_llegada = rutas[i]["lon_llegada"];
        let lat_llegada = rutas[i]["lat_llegada"];
        console.log(rutas[i])

        request.onreadystatechange = function () {
            if (this.readyState === 4) {
                body = JSON.parse(this.responseText);
                //console.log('Body: ', body);
                ruta.bbox = body["bbox"];
                ruta.distance = body["features"][0]["properties"]["summary"]["distance"];
                ruta.geometry = body["features"][0]["geometry"];
                ruta.salida = rutas[i]["dane_salida"];
                ruta.llegada = rutas[i]["dane_llegada"];
                //console.log('Ruta: ', ruta);
     
                const a = document.createElement('a');
                const file = new Blob([JSON.stringify(ruta)], {type: 'text/plain;charset=utf-8'});
    
                a.href= URL.createObjectURL(file);
                a.download = rutas[i]["dane_salida"] + '_' + rutas[i]["dane_llegada"] + '.json';
                a.click();
                URL.revokeObjectURL(a.href);
                       
            }
          };

        
        request.open('POST', "https://api.openrouteservice.org/v2/directions/foot-walking/geojson");
        request.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('Authorization', '5b3ce3597851110001cf6248c1276d1343e44239884a769adafff9fa');
          
        const params = '{"coordinates":[['+ lon_salida + ',' + lat_salida + '],['+ lon_llegada + ',' + lat_llegada + ']],"elevation":"false","geometry_simplify":"true","instructions":"false","preference":"recommended","units":"km","geometry":"true"}'
          
        request.send(params);

        i++;
    }, 1000)

}).catch(function(err) {
    console.log(err)
})


