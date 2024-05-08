```js

import {map_route} from "../components/map_route.js";
import * as Graphs from "../graphs/index.js"

const routesData = await FileAttachment("../data/route/routes.csv")
    .csv({typed: true});

const stationsData = await FileAttachment("../data/route/stations.csv")
    .csv({typed: true});


/*
 * Help functions
 */

// make dictionary that maps the trains of a specific route onto all the stations they pass in that route
function combineStations(route, data) {
    let stations = {};
    for (let element of data) {
        if (element.route.toString() === route.toString()) {
            const train = element.train;
            if (train in stations) {
                stations[train].push(element.station);
            } else {
                stations[train] = [element.station];
            }
        }
    }
    return stations;
}

// Get a list of the selected stations with their coordinates
function getStationsCoordinates(selection, coordinates) {
    let stations = Array(selection.length).fill({});
    let reviewed = []
    for (let element of coordinates) {
        const station = element.station;
        if (selection.includes(station) && (! reviewed.includes(station))) {
            reviewed.push(station);
            const index = selection.indexOf(station);
            stations[index] = {"station": element.station, "longitude": element.longitude, "latitude": element.latitude};
        }
    }
    return stations;
}


/*
 * data for route selection
 */

const route = view(Inputs.select(routesData, {
    label: "Selecteer route",
    format: (x) => x.route + " (" + x.start_station + " -> " + x.end_station + ")",
    value: (x) => x.route,
}));

// get the list of stations (with their coordinates) on the route that is passed by the most amount of trains
function getRouteStations(route) {
    const stationsPerTrain = combineStations(route, stationsData);
    let stationsCount = {};
    for (const value of Object.values(stationsPerTrain)) {
        const stations = value.join(',');
        if (stations in stationsCount) {
            stationsCount[stations] ++;
        } else {
            stationsCount[stations] = 1;
        }
    }
    let stations = [];
    let amount = 0;
    for (const key of Object.keys(stationsCount)) {
        if (stationsCount[key] > amount) {
            amount = stationsCount[key];
            stations = key.split(',');
        }
    }
    console.log(stations);
    return getStationsCoordinates(stations, stationsData);
}









// previous
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

function get_average_by_stations(delays, num_trains, stations) {
    let arrival_delays = {};
    let departure_delays = {};
    for (let delay of delays) {
        const station = delay.station;
        if (station in arrival_delays) {
            arrival_delays[station] += delay.arrival_delay;
            departure_delays[station] += delay.departure_delay;
        } else {
            arrival_delays[station] = delay.arrival_delay;
            departure_delays[station] = delay.departure_delay;
        }
    }
    const num_stations = stations.length;
    let arrival_averages = [];
    let departure_averages = [];
    for (let i = 0; i < num_stations; i++) {
        const station = stations[i];
        const arr_avg = arrival_delays[station] / num_trains;
        const dep_avg = departure_delays[station] / num_trains;
        arrival_averages.push({"station": station, "delay": arr_avg});
        departure_averages.push({"station": station, "delay": dep_avg});
    }
    return [arrival_averages, departure_averages];
}


// get all trains that follow the route of train 1508
const combined = combine_stations(train_stations_csv);
const stations = combined["1508"];
const trains = get_trains_with_same_stations(combined, stations);

// get departures and delays for each train
const dep_filtered = departures_csv.filter(x => trains.includes(x.id.toString()));
const departures = Object.fromEntries(dep_filtered.map(x => [x.id, new Date(x.departure).toTimeString().slice(0, 8)]));
const delays = delays_csv.filter(delay => trains.includes(delay.train.toString()) && stations.includes(delay.station));
delays.forEach(x => x['departure'] = departures[x.train]);

// get coordinates for the stations of the chosen route
const stations_with_coordinates = get_stations_coordinates(stations, route_stations);

// get average delay of the stations for the selected trains
const [arr_delays, dep_delays] = get_average_by_stations(delays, trains.length, stations);

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

<div>
<!--    ${map_route(stations_with_coordinates)}-->
    ${map_route(getRouteStations(route.route))}
</div>

<div class="grid grid-cols-2" style="align-items: center; width: 1400px">
    <div>
        <h1>${route.route}: Route ${route.start_station} -> ${route.end_station}</h1>
        <p>Op deze pagina bestuderen we de station op de route van ${route.start_station} naar ${route.end_station}. 
            Er zijn ${trains.length} treinen die deze route rijden doorheen de dag.</p>
    </div>
<!--    <div>-->
<!--        ${map_route(stations_with_coordinates)}-->
<!--    </div>-->
</div>

<div class="card">
    <h2>Stations op de route tussen ${route.start_station} en ${route.end_station} voor meerdere treinen</h2>
    ${Graphs.route(getRouteStations(route.route).map(x => x.station))}
</div>
<hr>

<h2>Vertragingen van de treinen op de route</h2>
Deze grafiek toont de vertraging van de treinen die de route Blankenberge-Genk volgen. Bij elk station kan de vertraging van aankomst of vertrek getoond worden.
<div class="card">
    ${Graphs.delays(delays, stations, Object.values(departures), "arrival_delay")}
<!--    <h2>Vertragingen bij vertrek van de treinen op de route</h2>-->
<!--    ${Graphs.delays(delays, stations, Object.values(departures), "departure_delay")}-->
</div>
<hr>

<h2>Vertragingen bij aankomst van de stations op de route</h2>
Voor elk station op de route worden de gemiddelde vertragingen per trein geplot. Ook het gemiddeldes ervan zijn verbonden.
Via deze grafiek valt duidelijk op dat de hoeveelheid van vertraging stijgt naarmate de trein dichter bij zijn eindbestemming komt.
<div class="card">
    ${Graphs.delays_by_station(delays, stations, arr_delays)}
</div>

```
