```js

import {map_route} from "../components/map_route.js";
import * as Graphs from "../graphs/index.js"

const route_stations = await FileAttachment("../data/route/IC03/stations.csv")
    .csv({typed: true});

const train_stations_csv = await FileAttachment("../data/route/IC03/train_stations.csv")
    .csv({typed: true});

const delays_csv = await FileAttachment("../data/route/IC03/delays.csv")
    .csv({typed: true});

const departures_csv = await FileAttachment("../data/route/IC03/departures.csv")
    .csv({typed: true});

function combine_stations(data) {
    let stations = {};
    for (let element of data) {
        const train = element.train_id;
        if (train in stations) {
            stations[train].push(element.station);
        } else {
            stations[train] = [element.station];
        }
    }
    return stations;
}

function get_trains_with_same_stations(data, stations) {
    let trains = [];
    for (let train of Object.keys(data)) {
        const stats = data[train];
        if (stats.length == stations.length) {
            let same = true;
            let i = 0;
            while (same && i < stations.length) {
                same = stats[i] == stations[i];
                i++;
            }
            if (same) {
                trains.push(train);
            }
        }
    }
    return trains;
}

function get_stations_coordinates(selection, coordinates) {
    let stations = [];
    for (let element of coordinates) {
        if (selection.includes(element.station)) {
            stations.push({"station": element.station, "longitude": element.longitude, "latitude": element.latitude});
        }
    }
    return stations;
}


// get all trains, stations, departures and delays that follow the route of train 1508
const combined = combine_stations(train_stations_csv);
const stations = combined["1508"];
const trains = get_trains_with_same_stations(combined, stations);
console.log(trains);
console.log(departures_csv);
const dep_filtered = departures_csv.filter(x => trains.includes(x.id.toString()));
console.log(dep_filtered);
const departures = Object.fromEntries(dep_filtered.map(x => [x.id, new Date(x.departure).toTimeString().slice(0,8)]));
console.log(departures);
const stations_with_coordinates = get_stations_coordinates(stations, route_stations);
const delays = delays_csv.filter(delay => trains.includes(delay.train.toString()));
console.log(delays.length);
delays.forEach(x => x['departure'] = departures[x.train]);
console.log(delays.length);

```

```html
<style>
    #observablehq-center {
        padding: 0 !important;
    }

    p {
        max-width: 100vw !important;
    }
</style>

<div class="grid grid-cols-2" style="align-items: center">
    <div>
        <h1>Route Blankenberge -> Genk</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
    </div>
    <div>
        ${map_route(stations_with_coordinates)}
    </div>
</div>

<div class="card">
    <h2>Stations op de route tussen ${stations[0]} en Genk voor meerdere treinen</h2>
    <h3>treinen: ${trains.join(',')}</h3>
    ${Graphs.route(stations)}
</div>

<div class="card">
    <h2>Vertragingen bij aankomst van de treinen op de route</h2>
    ${Graphs.delays(delays, stations, Object.values(departures), "arrival_delay")}
    <h2>Vertragingen bij vertrek van de treinen op de route</h2>
    ${Graphs.delays(delays, stations, Object.values(departures), "departure_delay")}
</div>

```
