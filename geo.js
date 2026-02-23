/* géolocalisation */
/**
 * geo.js - Module de gestion de la géolocalisation
 */

export function getDeviceLocation() {
    return new Promise((resolve, reject) => {
        // 1. Vérifier si l'API est supportée par le navigateur
        if (!navigator.geolocation) {
            reject({
                code: 'NOT_SUPPORTED',
                message: "La géolocalisation n'est pas supportée par votre navigateur."
            });
        }

        const options = {
            enableHighAccuracy: true, // Utilise le GPS si disponible
            timeout: 5000,            // Temps max d'attente (5s)
            maximumAge: 0             // Ne pas utiliser de position en cache
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Succès : on retourne un objet simplifié
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp
                });
            },
            (error) => {
                // Échec : on retourne un code d'erreur clair
                let errorType;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorType = 'PERMISSION_DENIED';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorType = 'POSITION_UNAVAILABLE';
                        break;
                    case error.TIMEOUT:
                        errorType = 'TIMEOUT';
                        break;
                    default:
                        errorType = 'UNKNOWN_ERROR';
                }
                reject({
                    code: errorType,
                    message: error.message
                });
            },
            options
        );
    });
}