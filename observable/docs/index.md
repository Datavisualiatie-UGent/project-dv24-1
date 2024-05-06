```js

import {map_route} from "./components/map_route.js";
import * as Graphs from "./graphs/index.js"

const stations = await FileAttachment("./data/general/stations.csv")
    .csv({typed: true});

const avg_arr_delays_csv = await FileAttachment("./data/general/avg_arr_delays.csv")
    .csv({typed: true});

const avg_dep_delays_csv = await FileAttachment("./data/general/avg_dep_delays.csv")
    .csv({typed: true});

const min_arr_delays_csv = await FileAttachment("./data/general/min_arr_delays.csv")
    .csv({typed: true});

const max_arr_delays_csv = await FileAttachment("./data/general/max_arr_delays.csv")
    .csv({typed: true});

const correlations = await FileAttachment("./data/general/correlations.csv")
    .csv({typed: true});

let size = avg_arr_delays_csv.length;
const avg_arr_delays = avg_arr_delays_csv.slice(0,30).concat(avg_arr_delays_csv.slice(size-30));

size = avg_dep_delays_csv.length;
const avg_dep_delays = avg_dep_delays_csv.slice(0,30).concat(avg_dep_delays_csv.slice(size-30));

const arr_delays = [];
const stations_min = min_arr_delays_csv.map(x => x.station);
const min_arr_delays = Object.fromEntries(min_arr_delays_csv.map(x => [x.station, x.min_delay]));
const stations_max = max_arr_delays_csv.map(x => x.station);
const max_arr_delays = Object.fromEntries(max_arr_delays_csv.map(x => [x.station, x.max_delay]));
let index = 0;
let amount = 0;
while (amount < 200) {
    const station = stations[index].station;
    if (stations_min.includes(station) && stations_max.includes(station)) {
        amount ++;
        const amount_min = Math.abs(min_arr_delays[station]);
        const amount_max = max_arr_delays[station];

        for (let i = 0; i < amount_min; i++) {
            arr_delays.push({"station": station, "max": false});
        }
        for (let i = 0; i < amount_max; i++) {
            arr_delays.push({"station": station, "max": true});
        }
    }
    index += 1;
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

<div class="grid grid-cols-2" style="align-items: center">
    <div>
        <h1>Stations in Vlaanderen</h1>
        <p>Dagelijks nemen mensen de trein als vervoermidden en hiervoor bevinden zich honderden stations over heel België.
            ...
        </p>
    </div>
    <div>
        ${map_route(stations)}
    </div>
</div>


<h2>Gemiddelde vertragingen aan stations</h2>
Deze twee grafieken tonen gemiddelde vertragingen aan stations bij zowel aankomst als vertrek.
Aangezien er te veel stations bestaan om allemaal te tonen, bestuderen we de dertig beste en dertig slechtste stations qua vertragingen.

<div class="grid grid-cols-2">
    <div class="card">
        <p>Hier zien we de gemiddelde vertraging bij aankomst. Er zijn slechts 2 station waarbij treinen gemiddeld te vroeg aankomen.</p>
        <br>
        ${Graphs.average_delays(avg_arr_delays.slice(0,30), true)}
        <h1>&emsp; &emsp; &emsp; ⋮</h1>
        ${Graphs.average_delays(avg_arr_delays.slice(30), false)}
    </div>
    <div class="card">
        <p>Hier zien we de gemiddelde vertraging bij vertrek. Hier zijn er al vier treinen die in het algemeen te vroeg vertrekken.</p>
        <br>
        ${Graphs.average_delays(avg_dep_delays.slice(0,30), true)}
        <h1>&emsp; &emsp; &emsp; ⋮</h1>
        ${Graphs.average_delays(avg_dep_delays.slice(30), false)}
    </div>
</div>


<div class="card">
    ${Graphs.min_max_delays(arr_delays)}
</div>

<h2>Gemiddelde vertragingen van stations ten opzichte van aantal treinen dat het station passseert.</h2>
<div class="card">
    ${Graphs.correlations(correlations, "avg_arrival_delay", [-10,30])}
</div>
<div class="card">
    ${Graphs.correlations(correlations, "avg_departure_delay", [-200,1000])}
</div>



```
