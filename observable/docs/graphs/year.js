import * as Plot from "npm:@observablehq/plot";

/**
 *
 * @param {Array<{date: Date, value: number}>} data - A list of date/value
 * pairs.
 */
export function year(data) {
    /** Set String to Date. */
    for (const elem of data) {
        elem.date = new Date(elem.date);
    }

    return Plot
        .ruleX(data, {
            x: "date",
            stroke: "delay",
            tip: true,
        }).plot({
            width: 1100,
            height: 120,
            marginBottom: 40,
            color: {
                type: "log",
                scheme: "Blues",
            },
            x: {
                label: "month in 2023",
                labelAnchor: "center"
            }
        });
}
