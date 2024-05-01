import * as Plot from "npm:@observablehq/plot";

export function route(data) {
    return Plot.plot({
        x: {type: "point", domain: data, grid: true, tickRotate: -30},
        width: 1200,
        marginBottom: 70,
        marginLeft: 30
    })
}
