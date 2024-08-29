function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -4.6561547, lng: -44.7703252},
        zoom: 10,
    });

    fetchDataAndAddMarkers(map);
}

function fetchDataAndAddMarkers(map) {
    const spreadsheetId = '1T_MY6vF7Sk7OOo-X0GEHAwy2N4jDPG6pxR_SaOFh9GA';
    const apiKey        = 'AIzaSyDrggDwzRN5yZNW-SzxHsq8ta0XXLbBEbw';
    const range         = 'public!A2:K22';
    
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;
            const bounds = new google.maps.LatLngBounds();
            rows.forEach((row, index) => {
                if (index !== 0) {
                    addMarker(map, row);
                }
            });
            map.fitBounds(bounds);
        });
}

function addMarker(map, row) {
    const lat    = parseFloat(row[4]);
    const lng    = parseFloat(row[5]);
    const status = row[10];
    
    let iconColor;
    switch(status) {
        case 'Pendente Agendamento':
            iconColor = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
            break;
        case 'Aguardando Visita':
            iconColor = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
            break;
        case 'Visitada':
            iconColor = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
            break;
        default:
            iconColor = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
    }

    const position = {lat: lat, lng: lng};
    new google.maps.Marker({
        position : {lat: lat, lng: lng},
        map      : map,
        icon     : iconColor,
        title    : row[2]
    });

    bounds.extend(position);

    const infoWindow = new google.maps.InfoWindow({
        content: `<div><strong>${row[2]}</strong><br>Status: ${status}</div>`
    });

    // Exibe o InfoWindow ao passar o mouse sobre o marcador
    marker.addListener('mouseover', () => {
        infoWindow.open(map, marker);
    });

    // Fecha o InfoWindow ao retirar o mouse do marcador
    marker.addListener('mouseout', () => {
        infoWindow.close();
    });
}
