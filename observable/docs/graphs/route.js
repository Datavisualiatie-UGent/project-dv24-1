import * as Plot from "npm:@observablehq/plot";

export function route(data) {
    return Plot.plot({
        x: {type: "point", domain: data, grid: true, tickRotate: -40},
        width: 1200,
        marginBottom: 100,
        marginLeft: 50,
        style: {
            fontSize: "12px",
        }
    })
}

export function delays(data, stations, departures, start_station, arr_dep) {
    const delay = arr_dep === "arrival_delay"
        ? "vertraging bij aankomst (seconden)"
        : "vertraging bij vertrek (seconden)";
    return Plot.plot({
        marginLeft: 80,
        marginBottom: 100,
        marginRight: 30,
        width: 1400,
        height: 800,
        label: null,
        style: {
            fontSize: "12px",
        },
        x: {tickRotate: -40, domain: stations, label: "station"},
        y: {domain: departures, label: "gepland vertrek in " + start_station},
        color: { scheme: "blues", pivot: 0, legend: true, label: delay, domain: [-300, 500] },
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

export function delays_by_station(data, stations, averages, arr_dep) {
    const delay = arr_dep === "arrival_delay"
        ? "vertraging bij aankomst (seconden)"
        : "vertraging bij vertrek (seconden)";
    return Plot.plot({
        width: 1400,
        marginBottom: 100,
        marginTop: 30,
        style: {
            fontSize: "12px",
        },
        color: {scheme: "BuRd", domain: [-50, 700]},
        x: {tickRotate: -40, domain: stations, label: "station"},
        y: {domain: [-50, 650], label: delay},
        marks: [
            Plot.ruleY([0]),
            Plot.dot(data, {x: "station", y: arr_dep, stroke: arr_dep}),
            Plot.lineY(averages, Plot.windowY(1, {x: "station", y: arr_dep}))
        ]
    })
}
