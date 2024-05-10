import * as Plot from "npm:@observablehq/plot";

/**
 * @param {{x: delay, y: count}} data
 */
export function distribution(data) {
    return Plot.barY(data, {
        x: "delay",
        y: "count",
        fill: "#6699ff",
        tip: true,
    }).plot({
        width: 1200,
        height: 230,
        marginLeft: 60,
        marginBottom: 40,
        x: { label: "Vertraging" },
        y: { label: "Aantal" },
    });
}
