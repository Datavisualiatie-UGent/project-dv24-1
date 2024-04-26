import L from "npm:leaflet";

export function map() {
    const div = document.createElement("div");
    div.style.height = "250px";
    div.style.margin = "20px 0";

    const map = L.map(div)
        .setView([51.03551971701421, 3.710101315832923], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.marker([51.03551971701421, 3.710101315832923])
        .addTo(map)

    return div
}