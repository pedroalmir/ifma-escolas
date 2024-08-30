const ped_lat = -4.6561547;
const ped_lng = -44.7703252;

function initMap() {
    const map = L.map('map').setView([ped_lat, ped_lng], 10);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
            /*const rows = [
                [],
                ["", "", "Escola 1", "", "-4.5659281", "-44.5996056", "Diretor 1", "", "+5586988477922", "29/08/2024", "Pendente Agendamento"],
                ["", "", "Escola 2", "", "-4.5800499", "-44.6134669", "Diretor 2", "", "+5586988477922", "29/08/2024", "Aguardando Visita"],
            ];*/
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

function getMarkerColor(status) {
    if(status === 'Visitada'){
        return greenIcon = L.icon({
            iconUrl     : 'imgs/placeholder-green.png',
            iconSize    : [32, 32], 
            iconAnchor  : [12, 41], 
            popupAnchor : [1, -34],
          });
    }else if(status === 'Aguardando Visita'){
        return L.icon({
            iconUrl     : 'imgs/placeholder-yellow.png',
            iconSize    : [32, 32],
            iconAnchor  : [12, 41],
            popupAnchor : [1, -34],
          });
    }else{
        return L.icon({
            iconUrl     : 'imgs/placeholder-red.png',
            iconSize    : [32, 32],
            iconAnchor  : [12, 41],
            popupAnchor : [1, -34],
          });
    }
}

function addMarker(map, escola, bounds) {

    const marker = L.marker(escola.getCoordinates(), {
        icon: getMarkerColor(escola.status)
    }).addTo(map);

    bounds.push(escola.getCoordinates());
    marker.bindPopup(escola.getPopupContent());

    
}

function updateChart(statusCounts) {
    const ctx = document.getElementById('statusChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Pendente Agendamento', 'Aguardando Visita', 'Visitada'],
            datasets: [{
                data: [
                    statusCounts['Pendente Agendamento'],
                    statusCounts['Aguardando Visita'],
                    statusCounts['Visitada']
                ],
                backgroundColor: ['#cd191e', '#FFCE56', '#2f9e41'],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Acompanhamento por Status'
                },
                datalabels: {
                    formatter: (value, context) => {
                        let total = context.chart.data.datasets[0].data.reduce((sum, value) => sum + value, 0);
                        let percentage = (value / total * 100).toFixed(0) + '%';
                        return `${value} (${percentage})`;
                    },
                    color: '#fff',
                    font: {
                        weight: 'bold',
                        size: 12
                    }
                }
            },
        },
        plugins: [ChartDataLabels]
    });
}

function updateVisitsTable(upcomingVisits) {
    const tableBody = document.getElementById('visits-table-container').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    upcomingVisits.forEach(escola => {
        const row = tableBody.insertRow();
        const cellName = row.insertCell(0);
        const cellDate = row.insertCell(1);
        cellDate.style = "text-align: center"
        cellName.textContent = escola.nome;
        cellDate.textContent = escola.dataAgendamento || 'N/A';
    });
}

initMap();
