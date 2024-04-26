import * as Plot from "npm:@observablehq/plot";

/**
 *
 * @param {Array<{date: Date, value: number}>} data - A list of date/value
 * pairs.
 */
export function year(data) {
    return Plot
        .ruleX(data, {x: "date", stroke: "value"})
        .plot({
            width: 1200,
            height: 100,
            color: {
                type: "log",
                scheme: "Blues",
            },
        });
}
