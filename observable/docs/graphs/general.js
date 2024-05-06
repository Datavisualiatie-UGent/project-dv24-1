import * as Plot from "npm:@observablehq/plot";
import * as d3 from 'https://unpkg.com/d3?module';

export function average_delays(data, info) {
    return Plot.plot({
        width: 700,
        height: 500,
        marginLeft: 50,
        marginTop: 50,
        label: null,
        x: {
            axis: info ? "top" : "",
            label: info ? "← Gemiddelde vertraging (minuten) →" : null,
            domain: [-5, 30],
            labelAnchor: "center",
        },
        color: {
            scheme: "PiYG",
            type: "ordinal"
        },
        marks: [
            Plot.barX(data, {
                x: "avg_delay",
                y: "station",
                fill: (d) => d.avg_delay > 0,
                sort: { y: "x" }
            }),

            // Plot.gridX({ stroke: "white", strokeOpacity: 0.5 }),
            d3
                .groups(data, (d) => d.avg_delay > 0)
                .map(([positive, delays]) => [
                    Plot.axisY({
                        x: 0,
                        ticks: delays.map((d) => d.station),
                        tickSize: 0,
                        anchor: positive ? "left" : "right"
                    }),
                    Plot.textX(delays, {
                        x: "avg_delay",
                        y: "station",
                        text: ((f) => (d) => f(d.avg_delay))(d3.format("+.3")),
                        textAnchor: positive ? "start" : "end",
                        dx: positive ? 6 : -6,
                    })
                ]),
            Plot.ruleX([0])
        ]
    })
}

export function min_max_delays(data) {
    return Plot.plot({
        height: 1000,
        width: 1400,
        marginBottom: 150,
        marginLeft: 50,
        aspectRatio: 1,
        color: {
            scheme: "PiYG",
        },
        x: {label: "Station", tickRotate: -80},
        y: {
            grid: true,
            label: "← Min vertraging · Max vertraging →",
            labelAnchor: "center",
        },
        marks: [
            Plot.dot(
                data,
                Plot.stackY2({
                    x: "station",
                    y: (d) => d.max ? 1 : -1,
                    fill: "max",
                })
            ),
            Plot.ruleY([0])
        ]
    });
}

export function correlations(data, delay, y_domain) {
    return Plot.plot({
        grid: true,
        width: 1400,
        marginTop: 50,
        marginBottom: 50,
        color: {scheme: "PiYG"},
        x: {domain: [0,500], label: "aantal trainen"},
        y: {domain: y_domain, label: delay + " (minuten)"},
        marks: [
            Plot.dot(data, {x: "num_trains", y: delay, fill: true}),
            Plot.linearRegressionY(data, {x: "num_trains", y: delay})
        ]
    })
}
