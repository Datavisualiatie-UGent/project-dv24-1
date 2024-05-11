import * as Plot from "npm:@observablehq/plot";
import * as d3 from 'https://unpkg.com/d3?module';

export function average_delays(data, info, marginTop) {
  return Plot.plot({
    width: 700,
    height: 10000,
    marginLeft: 80,
    marginTop: marginTop,
    label: null,
    style: {
      fontSize: "15px",
    },
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
        sort: { y: "x" },
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
            dx: positive ? 10 : -10,
          })
        ]),
      Plot.ruleX([0])
    ]
  })
}

export function min_max_delays(data) {
  return Plot.plot({
    height: 700,
    width: 10000,
    marginBottom: 170,
    marginLeft: 80,
    aspectRatio: 1,
    color: {
      scheme: "PiYG",
    },
    style: {
      fontSize: "12px",
    },
    x: { label: "Station", tickRotate: -80, labelAnchor: "left", labelOffset: 50 },
    y: {
      grid: true,
      label: "← Min vertraging (minuten) · Max vertraging (minuten) →",
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

export function correlations(data, delay) {
  const label = delay === "avg_arrival_delay"
    ? "gemiddelde vertraging bij aankomst"
    : "gemiddelde vertraging bij vertrek";
  return Plot.plot({
    grid: true,
    width: 1400,
    marginTop: 50,
    marginBottom: 50,
    marginLeft: 50,
    marginRight: 45,
    color: { scheme: "PiYG" },
    style: {
      fontSize: "15px",
    },
    x: { domain: [0, 100000], label: "aantal trainen" },
    y: { domain: [-5, 30], label: label + " (minuten)" },
    marks: [
      Plot.dot(data, { x: "num_trains", y: delay, fill: true }),
      Plot.linearRegressionY(data, { x: "num_trains", y: delay })
    ]
  })
}
