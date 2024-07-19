import { log, plotPoint, plotVector } from "./src/utils/render.ts";

console.log = log;
console.plot = {};
console.plot.point = plotPoint;
console.plot.vector = plotVector;

window.onerror = (event, file, line, col) => {
    const err = new Error();
    err.message = event;
    const filePaths = file.split("/");
    const fileHref = filePaths[filePaths.length - 1];
    const fileParams = fileHref.split("?");
    const fileName = fileParams[0];
    err.location = `${fileName} | ${line}:${col}`;
    log(err);
};