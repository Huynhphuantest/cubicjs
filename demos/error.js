import { log } from "./src/utils/render.ts";

console.log = log;

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