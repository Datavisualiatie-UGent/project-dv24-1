```js
import * as Graphs from "../graphs/index.js"

function map(lat, lon) {
    document.getElementById("map")?.remove();
    const div = display(document.createElement("div"));
    div.id = "map";
    div.style = "height: 400px;";

    const map = L.map(div)
        .setView([lat, lon], 13);

    L.tileLayer("https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=c7fafa75876f453cb4b6830b32b67d5f", {
        attribution: false,
    })
        .addTo(map);

    L.marker([lat, lon])
        .addTo(map)
        .bindPopup("A nice popup<br> indicating a point of interest.")
        .openPopup();
}

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

/**
 * Datafilters selected by the user.
 */
const station = view(Inputs.select(stationData, {
    label: "Select Station",
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
        return [];
    } else if (datatype.type === "REDUCED_DELAY") {
        return [];
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
</style>

<div>
    ${map(station.latitude, station.longitude)}
    <h1>${station.name}</h1>
</div>

<div class="grid grid-cols-3">
  <div class="card">
    <h2>Gemiddelde vertraging</h2>
    <h3>${Math.round(generalData.get(station.id)["avg_arrival_delay_s"])} seconden bij aankomst, ${Math.round(generalData.get(station.id)["avg_departure_delay_s"])} seconden bij vertrek.</h3>
  </div>
  <div class="card">
      <h2>Totale vertraging</h2>
      <h3>${Math.round(generalData.get(station.id)["sum_arrival_delay_s"] / 3600)} uren bij aankomst, ${Math.round(generalData.get(station.id)["sum_departure_delay_s"] / 3600)} uren bij vertrek.</h3>
  </div>
    <div class="card">
        <h2>Aantal treinen</h2>
        <h3>${generalData.get(station.id)["arrival_count"]} aankomsten, ${generalData.get(station.id)["departure_count"]} vertrekken.</h3>
    </div>
  <div class="card">
      <h2>Efficiëntie</h2>
      <h3>Treinen winnen gemiddeld ${Math.round(generalData.get(station.id)["avg_time_saving_s"])} seconden.</h3>
  </div>
    <div class="card">
        <h2>Efficiëntie</h2>
        <h3>Treinen wonnen in totaal ${Math.round(generalData.get(station.id)["sum_time_saving_s"] / 3600)} uren.</h3>
    </div>
  <div class="card">
      <h2>Afgelaste treinen</h2>
      <h3>#TODO treinen</h3>
  </div>
</div>

<hr />

<h2>Jaaroverzicht</h2>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

<div class="card">
    <h2>Gemiddelde vertraging per dag</h2>
    <h3>In seconden bij aankomst</h3>
    ${Graphs.year(getYearRule(station.id, datatype))}
</div>

<hr />

<h2>Moment van de dag</h2>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

<div class="card">
    <h2>Gemiddelde vertraging per uur</h2>
    <h3>In seconden bij aankomst</h3>
    ${Graphs.week(getTimeOfDay(station.id, datatype))}
</div>

<hr />

<h2>Vertragingsdistributie</h2>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

<div class="card">
    <h2>Aantal vertragingen van bepaalde duur</h2>
    <h3>Het percentueel aantal treinen waarvan de vertraging gelijk is aan een gegeven aantal minuten.</h3>
    ${Graphs.distribution(getDistribution(station.id, datatype))}
</div>

<hr />

<h2>Treinlijnen</h2>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

<div class="card">
    ${Graphs.trainLines(getTrainLines(station.id, datatype))}
</div>
```
