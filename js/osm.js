// Create map centered on Wales
var map = L.map('map').setView([52.52, -3.78], 8);
var markers = [];

// Load OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function addPin() {
    const lat = parseFloat(document.getElementById('latitude').value);
    const lng = parseFloat(document.getElementById('longitude').value);
    const label = document.getElementById('label').value || `Pin ${markers.length + 1}`;

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng)) {
        alert('Please enter valid latitude and longitude');
        return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        alert('Latitude must be between -90 and 90, Longitude must be between -180 and 180');
        return;
    }

    // Add marker to map
    var marker = L.marker([lat, lng]).addTo(map)
        .bindPopup('<strong>' + label + '</strong><br>Lat: ' + lat.toFixed(4) + '<br>Lng: ' + lng.toFixed(4) + '');

    markers.push(marker);

    // Clear inputs
    document.getElementById('latitude').value = '';
    document.getElementById('longitude').value = '';
    document.getElementById('label').value = '';
}

function clearPins() {
    markers.forEach(function(marker) {
        map.removeLayer(marker);
    });
    markers = [];
}

// Add pin on button click
document.getElementById('addPinBtn').addEventListener('click', addPin);

// Add pin on Enter key
document.getElementById('longitude').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addPin();
});

// Clear pins button
document.getElementById('clearPinsBtn').addEventListener('click', clearPins);

// Display coordinates where cursor is on map
map.on('mousemove', function(e) {
    const lat = e.latlng.lat.toFixed(4);
    const lng = e.latlng.lng.toFixed(4);
    document.getElementById('coordinates').textContent = `Lat: ${lat} | Lng: ${lng}`;
});

// Clear coordinates when mouse leaves map
map.on('mouseleave', function() {
    const coordsDiv = document.getElementById('coordinates');
    coordsDiv.innerHTML = '<div>Lat: -- | Lng: --</div><div>Easting: -- | Northing: --</div><div>Grid Ref: --</div>';
});

// Define projections for coordinate conversion
proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');
proj4.defs('EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs');

function latLngToOSGrid(lat, lng) {
    // Convert WGS84 to OSGB36 (British National Grid)
    const point = proj4('EPSG:4326', 'EPSG:27700', [lng, lat]);
    const easting = Math.round(point[0]);
    const northing = Math.round(point[1]);
    
    // Grid square letters
    const gridLetters = ['SV', 'SW', 'SX', 'SY', 'SZ', 'TV', 'TW', 'TX', 'TY', 'TZ',
                         'NV', 'NW', 'NX', 'NY', 'NZ', 'OV', 'OW', 'OX', 'OY', 'OZ',
                         'SQ', 'SR', 'SS', 'ST', 'SU', 'TQ', 'TR', 'TS', 'TT', 'TU',
                         'NQ', 'NR', 'NS', 'NT', 'NU', 'OQ', 'OR', 'OS', 'OT', 'OU',
                         'SM', 'SN', 'SO', 'SP', 'SQ', 'TM', 'TN', 'TO', 'TP', 'TQ',
                         'NM', 'NN', 'NO', 'NP', 'NQ', 'OM', 'ON', 'OO', 'OP', 'OQ',
                         'SH', 'SJ', 'SK', 'SL', 'SM', 'TH', 'TJ', 'TK', 'TL', 'TM',
                         'NH', 'NJ', 'NK', 'NL', 'NM', 'OH', 'OJ', 'OK', 'OL', 'OM',
                         'SC', 'SD', 'SE', 'SF', 'SG', 'TC', 'TD', 'TE', 'TF', 'TG',
                         'NC', 'ND', 'NE', 'NF', 'NG', 'OC', 'OD', 'OE', 'OF', 'OG'];
    
    // Calculate grid square
    const gridEasting = Math.floor(easting / 100000);
    const gridNorthing = Math.floor(northing / 100000);
    const gridIndex = (gridEasting + gridNorthing * 10);
    const gridSquare = gridLetters[gridIndex] || '--';
    
    // Get local coordinates
    const localEasting = Math.floor((easting % 100000) / 10);
    const localNorthing = Math.floor((northing % 100000) / 10);
    
    return {
        easting: easting,
        northing: northing,
        gridRef: gridSquare + localEasting.toString().padStart(4, '0') + localNorthing.toString().padStart(4, '0')
    };
}

// Display coordinates where cursor is on map
map.on('mousemove', function(e) {
    const lat = e.latlng.lat.toFixed(4);
    const lng = e.latlng.lng.toFixed(4);
    const gridData = latLngToOSGrid(e.latlng.lat, e.latlng.lng);
    
    const coordsDiv = document.getElementById('coordinates');
    coordsDiv.innerHTML = '<div>Lat: ' + lat + ' | Lng: ' + lng + '</div>' +
                          '<div>Easting: ' + gridData.easting + ' | Northing: ' + gridData.northing + '</div>' +
                          '<div>Grid Ref: ' + gridData.gridRef + '</div>';
});
// });