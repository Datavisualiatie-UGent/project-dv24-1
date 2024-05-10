```js

import {map_route} from "../components/map_route.js";
import * as Graphs from "../graphs/index.js"

const routesData = await FileAttachment("../data/route/routes.csv")
    .csv({typed: true});

const stationsData = await FileAttachment("../data/route/stations.csv")
    .csv({typed: true});

const departuresData = await FileAttachment("../data/route/departures.csv")
    .csv({typed: true});

const delaysData = await FileAttachment("../data/route/delays.csv")
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
        if (selection.includes(station) && (!reviewed.includes(station))) {
            reviewed.push(station);
            const index = selection.indexOf(station);
            stations[index] = {
                "station": element.station,
                "longitude": element.longitude,
                "latitude": element.latitude
            };
        }
    }
    return stations;
}


/*
 * data based on selected route
 */

// get the list of stations (with their coordinates) on the route that is passed by the most amount of trains
function getRouteStations(route) {
    // get a list of stations per train in the given route
    const stationsPerTrain = combineStations(route, stationsData);
    // list which trains pass the same set of stations in the route
    let stationsCount = {};
    for (const train of Object.keys(stationsPerTrain)) {
        const stations = stationsPerTrain[train].join(',');
        if (stations in stationsCount) {
            stationsCount[stations].push(train);
        } else {
            stationsCount[stations] = [train];
        }
    }
    // find the set of stations that are passed by the most amount of trains
    let stations = [];
    let trains = [];
    let amount = 0;
    for (const key of Object.keys(stationsCount)) {
        if (stationsCount[key].length > amount) {
            amount = stationsCount[key].length;
            trains = stationsCount[key];
            stations = key.split(',');
        }
    }
    return {"stations": getStationsCoordinates(stations, stationsData), "trains": trains};
}

function showDelays(selectedRoute, datatype) {
    const route = selectedRoute.route;
    const result = getRouteStations(route);
    const stations = result.stations.map(x => x.station);
    const trains = result.trains;

    // get departures of each train
    const dep_filtered = departuresData.filter(x => x.route === route).filter(x => trains.includes(x.train.toString()));
    const departures = Object.fromEntries(dep_filtered.map(x => [x.train, new Date(x.departure).toTimeString().slice(0, 8)]));
    // get delays
    const delaysOfRoute = delaysData
        .filter(x => x.route === route)
        .filter(x => trains.includes(x.train.toString()) && stations.includes(x.station));
    delaysOfRoute.forEach(x => x['departure'] = departures[x.train]);

    return Graphs.delays(delaysOfRoute, stations, Object.values(departures), selectedRoute.start_station, datatype);
}

function showAverageDelays(selectedRoute, datatype) {
    const route = selectedRoute.route;
    const result = getRouteStations(route);
    const stations = result.stations.map(x => x.station);
    const trains = result.trains;
    console.log("avg delays");
    
    const delaysOfRoute = delaysData
        .filter(x => x.route === route)
        .filter(x => trains.includes(x.train.toString()) && stations.includes(x.station));
    console.log(delaysOfRoute);
    
    let arrival_delays = {};
    let departure_delays = {};
    for (let delay of delaysOfRoute) {
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
    const num_trains = trains.length;
    let averages = [];
    for (let i = 0; i < num_stations; i++) {
        const station = stations[i];
        const arr_avg = arrival_delays[station] / num_trains;
        const dep_avg = departure_delays[station] / num_trains;
        averages.push({"station": station, "arrival_delay": arr_avg, "departure_delay": dep_avg});
    }
    console.log(averages);
    return Graphs.delays_by_station(delaysOfRoute, stations, averages, datatype);
}

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

<h1>Routes</h1>
<p>Deze pagina biedt een detailweergave over de vertragingscijfers voor een specifieke route. 
    Hierbij wordt een route voorgesteld als een traject van een startpunt naar een eindbestemming met een lijst van tussenliggende stations.</p>
```

```js
/*
 * selection boxes for route and type of data to be shown
 */
const route = view(Inputs.select(routesData, {
    label: "Selecteer route",
    format: (x) => x.route + " (" + x.start_station + " -> " + x.end_station + ")",
    value: (x) => x.route
}));

const datatype = view(Inputs.select([
    {type: "arrival_delay", label: "Vertraging bij aankomst"},
    {type: "departure_delay", label: "Vertraging bij vertrek"}
], {
    label: "Selecteer type data",
    format: (x) => x.label,
    value: (x) => x.type,
    sort: true,
    style: "width: 200px"
}));
```

```html
<h2>${route.route}: Route ${route.start_station} -> ${route.end_station}</h2>
<div>
    ${map_route(getRouteStations(route.route).stations)}
</div>

<div>
    <p>
        De geselecteerde route heeft als beginstation ${route.start_station} en als eindstation ${route.end_station}. 
        Er zijn ${getRouteStations(route.route).trains.length} treinen die deze route rijden, elk vertrekkend op een ander moment van de dag. 
        De stations die ze passeren, worden getoond op de kaart hierboven.
    </p>
</div>

<div class="card">
    <h2>Stations op de route tussen ${route.start_station} en ${route.end_station}</h2>
    ${Graphs.route(getRouteStations(route.route).stations.map(x => x.station))}
</div>
<hr>

<h2>Vertragingen van de treinen op de route</h2>
Afhankelijk van het vertrekuur van een trein kan de vertraging sterk variëren. Om dit te illustreren, 
worden de gemiddelde vertragingen bij de stations vergeleken ten opzichte van het vertrekuur aan het beginstation.
<div class="card">
    ${showDelays(route, datatype.type)}
</div>
<hr>

<h2>Vertragingen per station op de route</h2>
Niet enkel het vertrekuur van de trein heeft een invloed op vertragingen, maar ook de positie van het station op de route.
Hoe verder op de route, hoe groter de kans dat de trein onderweg vertraging heeft gelopen. Deze evolutie wordt hier gedemonstreerd.
Bovendien kan je afleiden in welke segmenten er tijd verloren wordt en waar tijd gewonnen kan worden. 
<div class="card">
    ${showAverageDelays(route, datatype.type)}
</div>

```
