```js
const div = document.createElement("div");
div.style ="height: 250px; margin: 20px 0"

const map = L.map(div)
  .setView([51.03551971701421, 3.710101315832923], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.marker([51.03551971701421, 3.710101315832923])
  .addTo(map)
```

```js
let arrivalsData = await FileAttachment("data/station/time_of_day_arrival.csv").csv({typed: true});
let departuresData = await FileAttachment("data/station/time_of_day_departure.csv").csv({typed: true});

const legend = [...new Array(7).keys()].map(day => {
    return [...new Array(24).keys()].map(hour => {
        return {
            dow: day,
            hour: `${hour > 9 ? "" : " "}${hour}:00`,
            arrival: null,
            departure: null,
        }
    })
}).flat();

const dayOfWeek = [
    "Maandag",
    "Dinsdag",
    "Woensdag",
    "Donderdag",
    "Vrijdag",
    "Zaterdag",
    "Zondag",
];

for (const x of arrivalsData) {
    const dow = Number.parseInt(x.dow);
    const hour = Number.parseInt(x.hour);
    const value = Number.parseInt(x.delay_s);
    legend[dow * 24 + hour].arrival = value;
}

for (const x of departuresData) {
    const dow = Number.parseInt(x.dow);
    const hour = Number.parseInt(x.hour);
    const value = Number.parseInt(x.delay_s);
    legend[dow * 24 + hour].departure = value;
}

const arrivals = Plot.plot({
    width: 500,
    height: 1000,
    padding: 0,
    grid: true,
    x: { axis: "top", label: "" },
    y: { label: "" },
    color: { type: "linear", scheme: "blues" },
    marks: [
        Plot.cell(legend, {
            x: (d) => d.dow,
            y: "hour",
            fill: "arrival",
            inset: 0.5,
        }),
        Plot.text(legend, {
            x: (d) => d.dow,
            y: "hour",
            fill: "black",
            title: "title",
            text: (d) => d.arrival ? Number.parseInt(d.arrival).toFixed(0) : "",
        })
    ],
});

const departures = Plot.plot({
    width: 500,
    height: 1000,
    padding: 0,
    grid: true,
    x: { axis: "top", label: "" },
    y: { label: "" },
    color: { type: "linear", scheme: "blues" },
    marks: [
        Plot.cell(legend, {
            x: (d) => d.dow,
            y: "hour",
            fill: "departure",
            inset: 0.5,
        }),
        Plot.text(legend, {
            x: (d) => d.dow,
            y: "hour",
            fill: "black",
            title: "title",
            text: (d) => d.departure ? Number.parseInt(d.departure).toFixed(0) : "",
        })
    ],
});

function getDayByDayCount(count) {
    var date = new Date(2023, 0);
    date.setDate(count);
    return date;
}


let ruleArrivalsData = await FileAttachment("data/station/year_arrival.csv")
    .csv({typed: true});

ruleArrivalsData = ruleArrivalsData
    .map(elem => {
        const date = new Date(2023, elem.month - 1, elem.day, 0, 0, 0, 0, 0);
        return {
            date,
            value: elem.delay_s,
        }
    });

let ruleDepartureData = await FileAttachment("data/station/year_departure.csv")
    .csv({typed: true});

ruleDepartureData = ruleDepartureData
    .map(elem => {
        const date = new Date(2023, elem.month - 1, elem.day, 0, 0, 0, 0, 0);
        return {
            date,
            value: elem.delay_s,
        }
    });

const ruleArrivalsPlot = Plot
    .ruleX(ruleArrivalsData, {x: "date", stroke: "value"})
    .plot({
        width: 1200,
        height: 100,
        color: {
            type: "log",
            scheme: "Blues",
        },
    });

const ruleDeparturesPlot = Plot
    .ruleX(ruleDepartureData, {x: "date", stroke: "value"})
    .plot({
        width: 1200,
        height: 100,
        color: { type: "log", scheme: "blues" },
    });
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
```

```html
<div class="grid grid-cols-2" style="align-items: center">
   <div>
    <h1>Gent Sint-Pieters</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
  </div>
  ${div}
</div>

<div class="grid grid-cols-3">
  <div class="card">
    <h2>Gemiddelde vertraging</h2>
    <h3>23 seconden</h3>
  </div>
  <div class="card">
      <h2>Totale vertraging</h2>
      <h3>391.934 seconden</h3>
  </div>
    <div class="card">
        <h2>Aantal treinen</h2>
        <h3>35.335 aankomsten, 32.024 vertrekken</h3>
    </div>
  <div class="card">
      <h2>Efficiëntie</h2>
      <h3>Treinen winnen gemiddeld 4.2 seconden</h3>
  </div>
  <div class="card">
      <h2>Afgelaste treinen</h2>
      <h3>402 treinen</h3>
  </div>
</div>

<hr />

<h2>Jaaroverzicht</h2>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

<div class="card">
    <h2>Gemiddelde vertraging per dag</h2>
    <h3>In seconden bij aankomst</h3>
    ${ruleArrivalsPlot}
</div>

<div class="card">
    <h2>Gemiddelde vertraging per dag</h2>
    <h3>In seconden bij vertrek</h3>
    ${ruleDeparturesPlot}
</div>

<hr />

<h2>Moment van de dag</h2>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

<div class="grid grid-cols-2">
    <div class="card">
        <h2>Gemiddelde vertraging per uur</h2>
        <h3>In seconden bij aankomst</h3>
        ${arrivals}
    </div>

    <div class="card">
        <h2>Gemiddelde vertraging per uur</h2>
        <h3>In seconden bij vertrek</h3>
        ${departures}
    </div>
</div>
```

<hr />

<h2>Vertragingsdistributie</h2>

```js
let distributionValues = await FileAttachment("data/station/distribution_arrival.csv")
    .csv({typed: true});

const distribution = Plot.barY(distributionValues, {
    x: "delay_minutes",
    y: "count",
    fill: "#6699ff"
}).plot({
    width: 1200,
    height: 200,
    x: { label: "Vertraging in minuten" },
    y: { label: "Aantal treinen in percent" },
});
```

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

<div class="card">
<h2>Aantal vertragingen van bepaalde duur</h2>
<h3>Het percentueel aantal treinen waarvan de vertraging gelijk is aan een gegeven aantal minuten.</h3>
${distribution}
</div>

<hr />

<h2>Treinlijnen</h2>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

```js
let trains = await FileAttachment("data/station/trainlines.csv")
    .csv({typed: true});


const trainLinePlot = Plot.plot({
    label: null,
    width: 1200,
    x: {
        axis: "top",
        label: "Vertraging in seconden",
        labelAnchor: "center",
    },
    color: {
        scheme: "blues",
        type: "ordinal"
    },
    marks: [
        Plot.barX(trains, {
            y: "route_id",
            x: "delay_s",
            fill: "#6699ff",
        }),
        Plot.gridX({
            stroke: "white",
            strokeOpacity: 0.5,
        }),
        Plot.axisY({x: 0}),
        Plot.ruleX([0])
    ]
});
```

```html
<div class="card">
    ${trainLinePlot}
</div>
```
