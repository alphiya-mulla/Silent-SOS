let map;
let marker;

window.onload = function () {

    map = L.map("map").setView([18.5204, 73.8567], 15);

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "© OpenStreetMap"
        }
    ).addTo(map);

    marker = L.marker(
        [18.5204, 73.8567],
        {
            draggable: true
        }
    ).addTo(map);

    marker.on("dragend", function () {

        const pos = marker.getLatLng();

        map.panTo(pos);

        updateLocationDetails(pos.lat, pos.lng);

    });

    document
        .getElementById("updateLocationBtn")
        .addEventListener("click", getCurrentLocation);

    getCurrentLocation();

};

function getCurrentLocation() {

    if (!navigator.geolocation) {

        alert("Geolocation is not supported.");

        return;

    }

    const btn = document.getElementById("updateLocationBtn");

    btn.disabled = true;
    btn.innerHTML = "📍 Updating...";

    navigator.geolocation.getCurrentPosition(

        function (position) {

            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            marker.setLatLng([lat, lng]);

            map.setView([lat, lng], 17);

            updateLocationDetails(lat, lng);

            btn.innerHTML = "✅ Location Updated";

            setTimeout(() => {

                btn.disabled = false;
                btn.innerHTML = "📍 Update Current Location";

            }, 2000);

        },

        function () {

            alert("Unable to fetch location.");

            btn.disabled = false;
            btn.innerHTML = "📍 Update Current Location";

        },

        {
            enableHighAccuracy: true
        }

    );

}

async function updateLocationDetails(lat, lng) {

    localStorage.setItem("userLatitude", lat);
    localStorage.setItem("userLongitude", lng);

    document.getElementById("coordinates").innerHTML =
        `
        <strong>Latitude:</strong> ${lat.toFixed(6)}
        <br>
        <strong>Longitude:</strong> ${lng.toFixed(6)}
        `;

    document.getElementById("lastUpdated").innerHTML =
        "Last Updated : " + new Date().toLocaleTimeString();

    document.getElementById("openGoogleMap").href =
        `https://www.google.com/maps?q=${lat},${lng}`;

        document.getElementById("hospitalMap").href =
`https://www.google.com/maps/search/hospitals/@${lat},${lng},15z`;

document.getElementById("policeMap").href =
`https://www.google.com/maps/search/police+station/@${lat},${lng},15z`;

document.getElementById("fireMap").href =
`https://www.google.com/maps/search/fire+station/@${lat},${lng},15z`;

    try {

        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );

        const data = await response.json();

        document.getElementById("address").innerHTML =
            `<i class="fa-solid fa-location-dot"></i> ${data.display_name}`;

    }

    catch {

        document.getElementById("address").innerHTML =
            "Address not found";

    }

    

}

async function loadNearbyPlaces(lat, lng) {

    document.getElementById("nearbyHospitals").innerHTML = "Loading...";
    document.getElementById("nearbyPolice").innerHTML = "Loading...";
    document.getElementById("nearbyFire").innerHTML = "Loading...";

    try {

        const query = `
[out:json];
(
node["amenity"="hospital"](around:5000,${lat},${lng});
node["amenity"="police"](around:5000,${lat},${lng});
node["amenity"="fire_station"](around:5000,${lat},${lng});
);
out body;
`;

        const response = await fetch(
            "https://overpass-api.de/api/interpreter",
            {
                method: "POST",
                body: query
            }
        );

        const data = await response.json();

        const hospitals = [];
        const police = [];
        const fire = [];

        data.elements.forEach(place => {

            const distance = getDistance(lat, lng, place.lat, place.lon);

            const item = `
<div class="place-card">

<div class="place-name">
${place.tags.name || "Unknown"}
</div>

<div class="place-distance">
📍 ${distance.toFixed(1)} km away
</div>

<a
class="navigate-btn"
target="_blank"
href="https://www.google.com/maps?q=${place.lat},${place.lon}">
Navigate
</a>

</div>
`;

            if (place.tags.amenity === "hospital")
                hospitals.push({ distance, item });

            if (place.tags.amenity === "police")
                police.push({ distance, item });

            if (place.tags.amenity === "fire_station")
                fire.push({ distance, item });

        });

        hospitals.sort((a, b) => a.distance - b.distance);
        police.sort((a, b) => a.distance - b.distance);
        fire.sort((a, b) => a.distance - b.distance);

        document.getElementById("nearbyHospitals").innerHTML =
            hospitals.length
                ? hospitals.slice(0, 3).map(x => x.item).join("")
                : "<p>No nearby hospitals found.</p>";

        document.getElementById("nearbyPolice").innerHTML =
            police.length
                ? police.slice(0, 3).map(x => x.item).join("")
                : "<p>No nearby police stations found.</p>";

        document.getElementById("nearbyFire").innerHTML =
            fire.length
                ? fire.slice(0, 3).map(x => x.item).join("")
                : "<p>No nearby fire stations found.</p>";

    }
    catch (error) {

        console.error(error);

        document.getElementById("nearbyHospitals").innerHTML = "Unable to load.";
        document.getElementById("nearbyPolice").innerHTML = "Unable to load.";
        document.getElementById("nearbyFire").innerHTML = "Unable to load.";

    }

}

function getDistance(lat1,lon1,lat2,lon2){

const R=6371;

const dLat=(lat2-lat1)*Math.PI/180;

const dLon=(lon2-lon1)*Math.PI/180;

const a=
Math.sin(dLat/2)*Math.sin(dLat/2)+
Math.cos(lat1*Math.PI/180)*
Math.cos(lat2*Math.PI/180)*
Math.sin(dLon/2)*Math.sin(dLon/2);

return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));

}