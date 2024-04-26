```js
import * as Graphs from "./graphs/index.js"
import { map } from "./components/map.js"

const trains = await FileAttachment("data/station/GENT-ST-P/trainlines.csv")
    .csv({typed: true});

const arrivalsData = await FileAttachment("data/station/GENT-ST-P/time_of_day_arrival.csv")
    .csv({typed: true});

const departuresData = await FileAttachment("data/station/GENT-ST-P/time_of_day_departure.csv")
    .csv({typed: true});

const distributionValues = await FileAttachment("data/station/GENT-ST-P/distribution_arrival.csv")
    .csv({typed: true});

const ruleArrivalsData = await FileAttachment("data/station/GENT-ST-P/year_arrival.csv")
    .csv({typed: true})
    .then(data => {
        return data.map(elem => {
            const date = new Date(2023, elem.month - 1, elem.day, 0, 0, 0, 0, 0);
            return {
                date,
                value: elem.delay,
            }
        });
    });

const ruleDepartureData = await FileAttachment("data/station/GENT-ST-P/year_departure.csv")
    .csv({typed: true})
    .then(data => {
        return data.map(elem => {
            const date = new Date(2023, elem.month - 1, elem.day, 0, 0, 0, 0, 0);
            return {
                date,
                value: elem.delay,
            }
        });
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

<div class="grid grid-cols-2" style="align-items: center">
   <div>
    <h1>Gent Sint-Pieters</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
  </div>
    <div>
        ${map()}
    </div>
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
    ${Graphs.year(ruleArrivalsData)}
</div>

<div class="card">
    <h2>Gemiddelde vertraging per dag</h2>
    <h3>In seconden bij vertrek</h3>
    ${Graphs.year(ruleDepartureData)}
</div>

<hr />

<h2>Moment van de dag</h2>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

<div class="grid grid-cols-2">
    <div class="card">
        <h2>Gemiddelde vertraging per uur</h2>
        <h3>In seconden bij aankomst</h3>
        ${Graphs.week(arrivalsData)}
    </div>

    <div class="card">
        <h2>Gemiddelde vertraging per uur</h2>
        <h3>In seconden bij vertrek</h3>
        ${Graphs.week(departuresData)}
    </div>
</div>

<hr />

<h2>Vertragingsdistributie</h2>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

<div class="card">
    <h2>Aantal vertragingen van bepaalde duur</h2>
    <h3>Het percentueel aantal treinen waarvan de vertraging gelijk is aan een gegeven aantal minuten.</h3>
    ${Graphs.distribution(distributionValues)}
</div>

<hr />

<h2>Treinlijnen</h2>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

<div class="card">
    ${Graphs.trainLines(trains)}
</div>
```
