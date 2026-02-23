import config from "./config.js";
import { getDeviceLocation } from "./geo.js";
import { laLouviere } from "./la-louviere.js";
import { Bruxelles } from "./fontainebxl.js";

async function init() {
    const location = await getDeviceLocation()
    console.log (location)
    if (location.lat) {
        config.latitude = location.lat
        config.longitude = location.lng
    }
    initMap()
}
init()


/**************************************************
    INITIALISATION DE LA CARTE
**************************************************/


function initMap () {
        const { latitude, longitude } = config
// Création de l'icône personnalisée pour les travaux
const travauxIcon = L.icon({
    iconUrl: 'icon-travaux.png',   // chemin vers ton image
    iconSize: [32, 37],            // largeur et hauteur en pixels
    iconAnchor: [16, 37],          // point qui correspond à la position sur la carte (en bas du marqueur)
    popupAnchor: [0, -37]          // position de la popup par rapport à l'icône
});

/*
    Création de la carte
    - On indique l'id du div "map"
    - On centre sur les coordonnées
    - Zoom niveau 10
*/
const map = L.map('map').setView([latitude, longitude], 10);

/*
    Ajout de la couche OpenStreetMap
*/
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

    maxZoom: 19,

    attribution: '&copy; OpenStreetMap contributors'

}).addTo(map);

/*
    Création d'un marqueur à ta position
*/
const marker = L.marker([latitude, longitude]).addTo(map);

/*
    Ajout d'une popup (infobulle)
*/
marker.bindPopup("Je suis ici");

// Crée un groupe de marqueurs vide
const markersGroup = L.layerGroup().addTo(map);

map.on('click', function(e) {
    // Crée un nouveau marqueur à la position du clic
    const newMarker = L.marker(e.latlng).addTo(markersGroup);
 
    // Affiche aussi dans la console
    console.log("Marqueur ajouté : ", e.latlng);
});

// Exemple : bouton pour supprimer tous les marqueurs
function clearMarkers() {
    markersGroup.clearLayers(); // supprime tous les marqueurs du groupe
}

/*
    Optionnel : ouvrir la popup automatiquement
*/
// marker.openPopup();

// Layer pour tous les travaux
const travauxLayer = L.layerGroup().addTo(map);

fetch(config.apiUrl)
    .then(response => response.json())
    .then(data => {
        data.records.forEach(record => {
            // Vérifie si le champ geometry existe
            if (record.geometry && record.geometry.coordinates) {
                const coords = record.geometry.coordinates;
                const lng = coords[0];
                const lat = coords[1];

            // Crée le marqueur avec l'icône personnalisée
        const marker = L.marker([lat, lng], { icon: travauxIcon }).addTo(travauxLayer);

                // Nom du chantier et lien (si disponible)
                const name = record.fields.name || "Chantier";
                const url = record.fields.url || "#";

                marker.bindPopup(`<strong>${name}</strong><br><a href="${url}" target="_blank">Plus d'infos</a>`);
            }
        });
    })
    .catch(err => console.error("Erreur chargement travaux :", err));

function clearTravaux() {
    travauxLayer.clearLayers();
}

laLouviere(travauxLayer)
Bruxelles(travauxLayer)
}
