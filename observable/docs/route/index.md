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
    console.log(arrival_averages);
    console.log(departure_averages);
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
console.log(delays);

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

<div class="grid grid-cols-2" style="align-items: center">
    <div>
        <h1>Route Blankenberge -> Genk</h1>
        <p>Op deze pagina bestuderen we de station op de route van Blankenberge naar Genk. Deze route loopt door Brugge richting Gent-Sint-Pieters.
            Vervolgens gaat het rechtstreeks naar Brussel om via Leuven en Landen in Genk aan te komen.
            Er zijn ${trains.length} treinen die deze route rijden doorheen de dag.</p>
    </div>
    <div>
        ${map_route(stations_with_coordinates)}
    </div>
</div>

<div class="card">
    <h2>Stations op de route tussen ${stations[0]} en Genk voor meerdere treinen</h2>
    ${Graphs.route(stations)}
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
