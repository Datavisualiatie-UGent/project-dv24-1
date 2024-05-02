import * as Plot from "npm:@observablehq/plot";

export function route(data) {
    return Plot.plot({
        x: {type: "point", domain: data, grid: true, tickRotate: -30},
        width: 1200,
        marginBottom: 70,
        marginLeft: 30
    })
}

export function delays(data, stations, departures, arr_dep) {
    console.log(data);
    console.log(stations);
    console.log(departures);
    return Plot.plot({
        marginLeft: 70,
        marginBottom: 80,
        marginRight: 30,
        width: 1400,
        height: 700,
        label: null,
        x: {tickRotate: -40, domain: stations, label: "station"},
        y: {domain: departures, label: "gepland vertrek in Blankenberge"},
        color: { scheme: "blues", pivot: 0, legend: true, label: "arrival_delay", domain: [-300, 500] },
        marks: [
            Plot.cell(data, { x: "station", y: "departure", fill: arr_dep }),

            Plot.text(data, {
                x: "station",
                y: "departure",
                text: arr_dep,
            })
        ]
    })
}

export function delays_by_station(data, stations, averages) {
    console.log(averages);
    return Plot.plot({
        width: 1400,
        marginBottom: 80,
        marginTop: 30,
        color: {scheme: "BuRd", domain: [-50, 700]},
        x: {tickRotate: -40, domain: stations, label: "station"},
        y: {domain: [-50, 650], label: "vertraging"},
        marks: [
            Plot.ruleY([0]),
            Plot.dot(data, {x: "station", y: "arrival_delay", stroke: "arrival_delay"}),
            Plot.lineY(averages, Plot.windowY(1, {x: "station", y: "delay"}))
        ]
    })
}
