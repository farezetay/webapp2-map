import config from "./config.js"
export function laLouviere(travauxLayer){
    fetch(config.apiLaLouviere)
    .then(response => response.json())
    .then(data => {
        data.results.forEach(results => {
            L.marker([results.geopoint.lat, results.geopoint.lon]).addTo(travauxLayer);
            
        });
    })
    .catch(error => {
        console.error('Erreur:', error);
    });
}