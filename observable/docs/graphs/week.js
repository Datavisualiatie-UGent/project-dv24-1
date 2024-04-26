import * as Plot from "npm:@observablehq/plot";

/**
 * @param {Array<{day: number, hour: number, value: number}>} data
 */
export function week(data) {
    // Initialize an empty list of values for each combination of weekday and
    // hour.
    const input = [...new Array(7).keys()].map(day => {
        return [...new Array(24).keys()].map(hour => {
            return {
                day,
                hour: `${hour > 9 ? "" : " "}${hour}:00`,
                value: null,
            }
        })
    }).flat();

    // Fill the placeholder with the actual data.
    data.forEach(elem => {
        const index = elem.day * 24 + elem.hour;
        input[index].value = elem.value;
    });

    return Plot.plot({
        width: 500,
        height: 1000,
        padding: 0,
        grid: true,
        x: { axis: "top", label: "" },
        y: { label: "" },
        color: { type: "linear", scheme: "blues" },
        marks: [
            Plot.cell(input, {
                x: "day",
                y: "hour",
                fill: "value",
                inset: 0.5,
            }),
            Plot.text(input, {
                x: "day",
                y: "hour",
                fill: "black",
                title: "title",
                text: (d) => d.value ? Number.parseInt(d.value).toFixed(0) : "",
            })
        ],
    });

}