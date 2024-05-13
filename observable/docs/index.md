```js

import {map_route} from "./components/map_route.js";
import * as Graphs from "./graphs/index.js"

const generalData = await FileAttachment("./data/general/general.csv")
    .csv({typed: true})
    .then(data => data[0]); 

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
while (index < stations.length) {
    const station = stations[index].station;
    if (stations_min.includes(station) && stations_max.includes(station)) {
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

<div class="grid grid-cols-2" id="cols" style="align-items: center">
    <div>
        <h1>Stations in België</h1>
        <p>Dagelijk nemen gemiddeld 750.000 mensen de trein. Om dit mogelijk te maken rijden elke dag 3800 treinen doorheen de 550 stations verspreid in België. Aangezien zoveel mensen hiervan afhankelijk zijn, is het echter belangrijk dat dit systeem efficiënt werkt zodat de treinen betrouwbaar kunnen rijden en iedereen op zijn bestemming geraakt. Hier willen we een kijkje nemen naar deze efficiëntie op alle niveaus van het treinverkeer. 
        </p>
        <p>
De niveaus die we zullen bekijken zijn: specifieke stations, specifieke routes en overkoepelend over alle stations elk te vinden op hun respectievelijke pagina.
        </p>
    <p>
      Data die gebruikt werd om alle grafieken te maken is terug te vinden op : <a href="https://opendata.infrabel.be/explore/dataset/ruwe-gegevens-van-stiptheid-d-1/information/?disjunctive.train_no&disjunctive.relation&disjunctive.train_serv&disjunctive.line_no_dep&disjunctive.relation_direction&disjunctive.ptcar_lg_nm_nl&disjunctive.line_no_arr">Infrabel</a>. De grafieken zijn gemaakt op basis van de data van het jaar 2023 aangezien de de volledige dataset te groot was om te verwerken.
    </p>
    </div>
</div>
<hr>
```

```js
const div = display(document.createElement("div"));
div.style = "height: 400px;";

const map = L.map(div).setView([stations[0].latitude, stations[0].longitude], 13);

L.tileLayer("https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=c7fafa75876f453cb4b6830b32b67d5f", {
    attribution: false,
}).addTo(map);

for (let station of stations) {
    let lat = station.latitude;
    let long = station.longitude;
    L.marker([lat, long]).addTo(map);
}

document.getElementById("cols").appendChild(div);
```

```html
<h2>Algemene cijfers</h2>

<div class="grid grid-cols-2">
  <div class="card">
    <h2>Gemiddelde vertraging</h2>
    <h3>${Math.round(generalData["avg_arrival_delay_s"])} seconden bij aankomst,
      ${Math.round(generalData["avg_departure_delay_s"])} seconden bij vertrek.</h3>
  </div>
  <div class="card">
    <h2>Totale vertraging</h2>
    <h3>${Math.round(generalData["sum_arrival_delay_s"] / 3600)} uren bij aankomst,
      ${Math.round(generalData["sum_departure_delay_s"] / 3600)} uren bij vertrek.</h3>
  </div>
  <div class="card">
    <h2>Aantal treinen</h2>
    <h3>${generalData["arrival_count"]} aankomsten,
      ${generalData["departure_count"]} vertrekken.</h3>
  </div>
  <div class="card">
    <h2>Gemiddelde efficiëntie</h2>
    <h3>Treinen verliezen gemiddeld ${-Math.round(generalData["avg_time_saving_s"])} seconden per stop.</h3>
  </div>
  <div class="card">
    <h2>Totale efficiëntie</h2>
    <h3>Treinen verloren in totaal ${-Math.round(generalData["sum_time_saving_s"] / 3600)} uren.</h3>
  </div>
</div>

<hr />

<h2>Gemiddelde vertragingen aan stations</h2>
Om te beginnen zullen we kijken naar de gemiddelde vertragingen aan stations bij zowel aankomst als vertrek.
Deze zijn gesorteerd in oplopende volgorde.

<div class="grid grid-cols-2" style="height: 1000px">
    <div class="card" style="overflow-y: scroll; height: 1000px">
        <div>
            <p>Hier zien we de gemiddelde vertraging bij aankomst. Er zijn slechts 2 station waarbij treinen gemiddeld te vroeg aankomen.</p> <br><br><br>
            <br>
            ${Graphs.average_delays(avg_arr_delays_csv, true, 70)}
        </div>
    </div>
    <div class="card" style="overflow-y: scroll; height: 1000px">
        <div>
            <p>Hier zien we de gemiddelde vertraging bij vertrek. Hier zijn er al vier stations waar treinen in het algemeen te vroeg vertrekken waarbij 1 er uit springt. De reden hiervoor is dat de dataset niet enkel rekening houdt met personenvervoer, maar ook met vrachttreinen die niet aan een even strikte dienstregeling moeten voldoen. </p>
            <br>
            ${Graphs.average_delays(avg_dep_delays_csv, true, 70)}
        </div>
    </div>
</div>

<hr>
<h2>Extrema van vertrektijden per station.</h2>
  <p>
  Hieronder zien we de extremen per station. Zowel de trein die de grootste vertraging had als de trein die vroegst vertrokken is, is hier te zien per station. Zoals te verwachten zijn de maximum vertragingen een stuk groter dan treinen die te vroeg vertrekken. Wat wel opvalt is dat de nmbs sommige treinen niet annuleert die extreem grote vertragingen hebben. Gelukkig is hieruit ook af te leiden dat er geen enkel station is waar alle treinen vertraging hebben.
 </p>
<div class="card" style="overflow-x: scroll">
  <div style="width: 10000px">
    ${Graphs.min_max_delays(arr_delays)}
  </div>
</div>
<hr>

<h2>Gemiddelde vertragingen van stations ten opzichte van aantal treinen dat het station passseert.</h2>
<p>
  Iets wat we zeker wilden onderzoeken was of er een correlatie te zien is tussen de drukte van een station en zijn gemiddelde vertraging. De drukte van een station stellen we hier voor door het aantal treinen die erdoor rijden per jaar. Uit de resultaten kunnen we afleiden dat drukkere stations in het algemeen geen grotere vertraging hebben. We kunnen wel zien dat er clusters ontstaan bij bepaalde hoeveelheden aan treinen, hier is de variantie dan ook hoger. Deze variantie is zeer hoog bij stations waar niet veel treinen passeren, maar dit zijn vermoedelijk stations voor vrachttreinen, niet bedoeld voor personenvervoer.</p>
<div class="card">
    ${Graphs.correlations(correlations, "avg_arrival_delay")}
    ${Graphs.correlations(correlations, "avg_departure_delay")}
</div>



```
