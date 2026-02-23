import config from "./config.js";
export function Bruxelles(travauxLayer){
    fetch(config.apifontainebxl)
    .then(response => response.json())
    .then(data => {
        data.results.forEach(results => {
            L.marker([results.geo_point_2d.lat, results.geo_point_2d.lon]).addTo(travauxLayer)
            
            
        });
    })
    .catch(error => {
        console.error('Erreur:', error);
    })
}