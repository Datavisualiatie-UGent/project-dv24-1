import * as Plot from "npm:@observablehq/plot";

/**
 * @param {{x: delay, y: count}} data
 */
export function distribution(data) {
    return Plot.barY(data, {
        x: "delay",
        y: "count",
        fill: "#6699ff"
    }).plot({
        width: 1200,
        height: 200,
        x: { label: "Vertraging in minuten" },
        y: { label: "Aantal treinen in percent" },
    });
}
