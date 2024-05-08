import * as Plot from "npm:@observablehq/plot";

/**
 * @param {Array<{route: string, delay: number}>} data - List of all trains with their
 * corresponding average delay.
 */
export function trainLines(data) {
    return Plot.plot({
        label: "Treinlijn",
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
            Plot.barX(data, {
                y: "route",
                x: "delay",
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
}
