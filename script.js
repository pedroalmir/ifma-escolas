const ped_lat = -4.6561547;
const ped_lng = -44.7703252;

function initMap() {
    const map = L.map('map').setView([ped_lat, ped_lng], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    fetchDataAndAddMarkers(map);
}

function fetchDataAndAddMarkers(map) {
    const spreadsheetId = '1T_MY6vF7Sk7OOo-X0GEHAwy2N4jDPG6pxR_SaOFh9GA';
    const apiKey        = 'AIzaSyDrggDwzRN5yZNW-SzxHsq8ta0XXLbBEbw';
    const range         = 'public!A2:K22';
    
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const bounds = [];
            const rows = data.values;
            const upcomingVisits = [];

            const statusCounts = {
                'Pendente Agendamento'  : 0,
                'Aguardando Visita'     : 0,
                'Visitada'              : 0,
            };

            rows.forEach((row, index) => {
                if (index !== 0) {
                    const escola = new Escola(row[2], row[4], row[5], row[10], row[6], row[8], row[9]);
                    statusCounts[escola.status] += 1;
                    if (escola.status === 'Aguardando Visita') {
                        upcomingVisits.push(escola);
                    }

                    addMarker(map, escola, bounds);
                }
            });

            if (bounds.length > 0) {
                map.fitBounds(bounds);
            }

            updateChart(statusCounts);
            updateVisitsTable(upcomingVisits);
        });
}

function addMarker(map, escola, bounds) {
    const marker = L.circleMarker(escola.getCoordinates(), {
        color: escola.getMarkerColor(),
        radius: 8,
        fillOpacity: 0.8
    }).addTo(map);

    bounds.push(escola.getCoordinates());
    marker.bindPopup(escola.getPopupContent());

    marker.on('mouseover', function () {
        this.openPopup();
    });

    marker.on('mouseout', function () {
        this.closePopup();
    });
}

function updateChart(statusCounts) {
    const ctx = document.getElementById('statusChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Pendente Contato', 'Aguardando Visita', 'Visitada'],
            datasets: [{
                data: [
                    statusCounts['Pendente Contato'],
                    statusCounts['Aguardando Visita'],
                    statusCounts['Visitada']
                ],
                backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB'],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}

function updateVisitsTable(upcomingVisits) {
    const tableBody = document.getElementById('visitsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    upcomingVisits.forEach(escola => {
        const row = tableBody.insertRow();
        const cellName = row.insertCell(0);
        const cellDate = row.insertCell(1);

        cellName.textContent = escola.nome;
        cellDate.textContent = escola.dataAgendamento || 'N/A';
    });
}

initMap();
