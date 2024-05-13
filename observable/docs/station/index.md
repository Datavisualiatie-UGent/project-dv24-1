```js
import * as Graphs from "../graphs/index.js"
```

```js
/*
 * Combined data for the station.
 */
const stationData = await FileAttachment("../data/station/stations.csv")
    .csv({typed: true})
    .then(data => data.sort((a, b) => a.name.localeCompare(b.name)));

const distribution = await FileAttachment("../data/station/distribution.csv")
    .csv({typed: true});

const yearData = await FileAttachment("../data/station/year.csv")
    .csv({typed: true});

const timeOfDayData = await FileAttachment("../data/station/time_of_day.csv")
    .csv({typed: true});

const trainLineData = await FileAttachment("../data/station/trainlines.csv")
    .csv({typed: true});

const generalData = await FileAttachment("../data/station/general.csv")
    .csv({typed: true})
    .then(list => {
        const result = new Map();
        list.forEach(elem => {
            result.set(elem.station, elem);
        });
        return result;
    });
```

```js
/*
 * Ready-for-use filtered data getters.
 */ 
function getDistribution(station, datatype) {
    if (datatype.type === "ARRIVAL_DELAY") {
        return distribution
            .filter(elem => elem.station === station)
            .map(elem => {
                elem.count = elem.arrival_count;
                return elem;
            });
    } else if (datatype.type === "DEPARTURE_DELAY") {
        return distribution
            .filter(elem => elem.station === station)
            .map(elem => {
                elem.count = elem.departure_count;
                return elem;
            });
    } else if (datatype.type === "ADDITIONAL_DELAY") {
        return distribution
            .filter(elem => elem.station == station)
            .map(elem => {
                return {
                    count: elem.difference_count,
                    delay: elem.delay,
                }
            })
    } else if (datatype.type === "REDUCED_DELAY") {
        return distribution
            .filter(elem => elem.station == station)
            .map(elem => {
                return {
                    count: elem.difference_count,
                    delay: elem.delay * (-1),
                }
            })
    } else {
        throw new Error("Invalid datatype");
    }
}

function getYearRule(station, datatype) {
    if (datatype.type === "ARRIVAL_DELAY") {
        return yearData
            .filter(elem => elem.station == station)
            .filter(elem => elem.arrival_delay !== null)
            .map(elem => {
                elem.delay = elem.arrival_delay;
                return elem;
            })
    } else if (datatype.type === "DEPARTURE_DELAY") {
        return yearData
            .filter(elem => elem.station == station)
            .filter(elem => elem.departure_delay !== null)
            .map(elem => {
                elem.delay = elem.departure_delay;
                return elem;
            })
    } else if (datatype.type === "ADDITIONAL_DELAY") {
        return yearData
            .filter(elem => elem.station == station)
            .filter(elem => elem.departure_delay !== null)
            .filter(elem => elem.arrival_delay !== null)
            .map(elem => {
                elem.delay = elem.departure_delay - elem.arrival_delay;
                return elem;
            })
            .filter(elem => elem.delay > 0)
    } else if (datatype.type === "REDUCED_DELAY") {
        return yearData
            .filter(elem => elem.station == station)
            .filter(elem => elem.departure_delay !== null)
            .filter(elem => elem.arrival_delay !== null)
            .map(elem => {
                elem.delay = elem.arrival_delay - elem.departure_delay;
                return elem;
            })
            .filter(elem => elem.delay > 0)
    } else {
        throw new Error("Invalid datatype");
    }
}

function getTimeOfDay(station, datatype) {
    if (datatype.type === "ARRIVAL_DELAY") {
        return timeOfDayData
            .filter(elem => elem.station == station)
            .filter(elem => elem.arrival_delay !== null)
            .map(elem => {
                elem.value = elem.arrival_delay;
                return elem;
            })
    } else if (datatype.type === "DEPARTURE_DELAY") {
        return timeOfDayData
            .filter(elem => elem.station == station)
            .filter(elem => elem.departure_delay !== null)
            .map(elem => {
                elem.value = elem.departure_delay;
                return elem;
            })
    } else if (datatype.type === "ADDITIONAL_DELAY") {
        return timeOfDayData
            .filter(elem => elem.station == station)
            .filter(elem => elem.departure_delay !== null)
            .filter(elem => elem.arrival_delay !== null)
            .map(elem => {
                elem.value = elem.departure_delay - elem.arrival_delay;
                return elem;
            })
            .filter(elem => elem.value > 0)
    } else if (datatype.type === "REDUCED_DELAY") {
        return timeOfDayData
            .filter(elem => elem.station == station)
            .filter(elem => elem.departure_delay !== null)
            .filter(elem => elem.arrival_delay !== null)
            .map(elem => {
                elem.value = elem.arrival_delay - elem.departure_delay;
                return elem;
            })
            .filter(elem => elem.value > 0)
    } else {
        throw new Error("Invalid datatype");
    }
}

function getTrainLines(station, datatype) {
    if (datatype.type == "ARRIVAL_DELAY") {
        return trainLineData
            .filter(elem => elem.station == station)
            .filter(elem => elem.arrival_delay !== null)
            .map(elem => {
                elem.delay = elem.arrival_delay;
                return elem;
            })
    } else if (datatype.type == "DEPARTURE_DELAY") {
        return trainLineData
            .filter(elem => elem.station == station)
            .filter(elem => elem.departure_delay !== null)
            .map(elem => {
                elem.delay = elem.departure_delay;
                return elem;
            })
    } else if (datatype.type == "ADDITIONAL_DELAY" || datatype.type == "REDUCED_DELAY") {
        return trainLineData
            .filter(elem => elem.station == station)
            .filter(elem => elem.departure_delay !== null)
            .filter(elem => elem.arrival_delay !== null)
            .map(elem => {
                elem.delay = elem.departure_delay - elem.arrival_delay;
                return elem;
            })
    } else {
        throw new Error("Invalid datatype");
    }
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
    
    .navbar {
        position: sticky;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1000;
        padding: 15px 0;
        background-color: rgb(255, 255, 255);
    }

    .grow {
        flex-grow: 1;
    }
</style>
```


```html
<h1>Stations</h1>
<p>Deze pagina biedt een detailweergave over de vertragingscijfers voor een specifiek station. Cijfers worden voorzien voor vertrek en aankomst, net zoals voor de gewonnen en verloren tijd. Deze slaan op het verschil tussen de vertraging bij aankomst en bij vertrek.</p>
```

```js
const station = view(Inputs.select(stationData, {
        label: "Selecteer station",
        format: (x) => x.name,
        value: (x) => x.id,
    }));

const datatype = view(Inputs.select([
    { type: "ARRIVAL_DELAY", label: "Vertraging bij aankomst" },
    { type: "DEPARTURE_DELAY", label: "Vertraging bij vertrek" },
    { type: "ADDITIONAL_DELAY", label: "Toegevoegde vertraging" },
    { type: "REDUCED_DELAY", label: "Gewonnen tijd"}
], {
    label: "Dataselectie",
    format: (x) => x.label,
    value: (x) => x.type,
    sort: true,
}));
```

```html
<hr />
```

```js
const div = display(document.createElement("div"));
div.style = "height: 400px;";

const map = L.map(div).setView([station.latitude, station.longitude], 13);

L.tileLayer("https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=c7fafa75876f453cb4b6830b32b67d5f", {
    attribution: false,
}).addTo(map);

L.marker([station.latitude, station.longitude])
    .addTo(map)
    .bindPopup(station.name)
    .openPopup();
```

```html
<hr />

<h2>${station.name}</h2>

<h3>Algemene cijfers</h3>

<div class="grid grid-cols-2">
    <div class="card">
        <h2>Gemiddelde vertraging</h2>
        <h3>${Math.round(generalData.get(station.id)["avg_arrival_delay_s"])} seconden bij aankomst,
            ${Math.round(generalData.get(station.id)["avg_departure_delay_s"])} seconden bij vertrek.</h3>
    </div>
    <div class="card">
        <h2>Totale vertraging</h2>
        <h3>${Math.round(generalData.get(station.id)["sum_arrival_delay_s"] / 3600)} uren bij aankomst,
            ${Math.round(generalData.get(station.id)["sum_departure_delay_s"] / 3600)} uren bij vertrek.</h3>
    </div>
    <div class="card">
        <h2>Aantal treinen</h2>
        <h3>${generalData.get(station.id)["arrival_count"]} aankomsten,
            ${generalData.get(station.id)["departure_count"]} vertrekken.</h3>
    </div>
    <div class="card">
        <h2>Gemiddelde efficiëntie</h2>
        <h3>Treinen verliezen gemiddeld ${-Math.round(generalData.get(station.id)["avg_time_saving_s"])} seconden.</h3>
    </div>
    <div class="card">
        <h2>Totale efficiëntie</h2>
        <h3>Treinen verloren in totaal ${-Math.round(generalData.get(station.id)["sum_time_saving_s"] / 3600)} uren.</h3>
    </div>
</div>

<hr/>

<h3>Jaaroverzicht</h3>

<p>Het aantal passagiers van een station is sterk afhankelijk van de kalenderdag. Badsteden zullen op hun drukst zijn
    tijdens de zomermaanden, financiele centra bij weekdagen. Feest- en verlofdagen zullen op beurt hun invloed
    uitoefenen op de stations. In de onderstaande grafiek wensen we de correlatie na te gaan met de vertragingscijfers
    van een station. </p>

<p>Iedere kalenderdag wordt voorgesteld door een lijnstuk. Hoe donkerder de kleur, hoe hoger de gemiddelde vertraging op
    die dag.</p>

<div class="card">
    <h2>Gemiddelde vertraging per kalenderdag.</h2>
    <h3>Uitgedrukt in seconden.</h3>
    ${Graphs.year(getYearRule(station.id, datatype))}
</div>

<hr/>

<h3>Moment van de week</h3>

<p>De stiptheid van de treinen kan afhankelijk zijn van het uur en de weekdag. In deze matrixweergave berekenen we de
    gemiddelde vertraging voor ieder uur van iedere weekdag. Hierbij kunnen we inschatten op welk moment van de week de
    treinen het betrouwbaarst zijn, en ook of eventuele correlaties met de typische spitsuren aanwezig zijn. Indien er
    niet voldoende data beschikbaar is, wordt geen gemiddelde vertraging gerapporteerd.</p>

<div class="card">
    <h2>Gemiddelde vertraging per uur, per weekdag.</h2>
    <h3>Uitgedrukt in seconden.</h3>
    ${Graphs.week(getTimeOfDay(station.id, datatype))}
</div>

<hr/>

<h3>Vertragingsdistributie</h3>

<p>De ene vertraging is de andere niet. Hoewel de meeste reizigers enkele minuten kunnen tolereren, wegen lange
    wachttijden doorgaans zwaarder door. Hieronder wordt de vertragingsdistributie weergegeven, waarbij men kan aflezen
    hoeveel treinen er een gegeven aantal minuten vertraging opliepen.</p>

<div class="card">
    <h2>Aantal vertragingen van bepaalde duur.</h2>
    <h3>Het aantal treinen waarvan de vertraging gelijk is aan een gegeven aantal minuten.</h3>
    ${Graphs.distribution(getDistribution(station.id, datatype))}
</div>

<hr/>

<h3>Treinlijnen</h3>

<p>In het merendeel van de Belgische stations passeert er meer dan een treinlijn. Het is dus ook evident dat hun
    onderlinge vertragingscijfers grotendeels onafhankelijk zijn. We lijsten hieronder alle treinlijnen op die doorheen
    dit station passeren.</p>

<div class="card">
    <h2>Gemiddelde vertraging per treinlijn.</h2>
    <h3>Uitgedrukt in seconden.</h3>
    ${Graphs.trainLines(getTrainLines(station.id, datatype))}
</div>
```
