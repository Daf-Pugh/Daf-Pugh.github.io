let map;
let markers = [];

function initMap() {
    // Center of UK 
    const center = { lat: 53.095, lng: -4.231 };
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: center
    });
}

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
    const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: label
    });

    // Add info window to marker
    const infoWindow = new google.maps.InfoWindow({
        content: `<div><strong>${label}</strong><br>Lat: ${lat.toFixed(4)}<br>Lng: ${lng.toFixed(4)}</div>`
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });

    markers.push(marker);

    // Clear inputs
    document.getElementById('latitude').value = '';
    document.getElementById('longitude').value = '';
    document.getElementById('label').value = '';
}

function clearPins() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

// Initialize map on page load
window.addEventListener('load', initMap);

// Add pin on button click
document.getElementById('addPinBtn').addEventListener('click', addPin);

// Add pin on Enter key
document.getElementById('longitude').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addPin();
});

// Clear pins button
document.getElementById('clearPinsBtn').addEventListener('click', clearPins);