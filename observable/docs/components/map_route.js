import L from "npm:leaflet";

export function map_route(stations) {
    console.log(stations);
    const div = document.createElement("div");
    div.style.height = "250px";
    div.style.margin = "20px 0";

    const map = L.map(div)
        .setView([stations[0].latitude, stations[0].longitude], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    for (let station of stations) {
        let lat = station.latitude;
        let long = station.longitude;
        L.marker([lat, long]).addTo(map);
    }

    return div
}
