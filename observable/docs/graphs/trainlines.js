import * as Plot from "npm:@observablehq/plot";

/**
 * @param {Array<{route: string, delay: number}>} data - List of all trains with their
 * corresponding average delay.
 */
export function trainLines(data) {
    return Plot.plot({
        height: data.length * 30,
        width: 1200,
        x: { label: "Vertraging" },
        y: { label: "Treinlijn" },
        label: null,
        color: {
            scheme: "blues",
            type: "ordinal"
        },
        marks: [
            Plot.barX(data, {
                y: "route",
                x: "delay",
                fill: "#6699ff",
                tip: true,
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
