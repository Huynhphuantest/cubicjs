export class Face {
    /**
     * @param {Vector3[]} vertices
     * @param {Vector3} [normal]
     */
    constructor(vertices: Vector3[], normal?: Vector3 | undefined);
    vertices: Vector3[];
    normal: Vector3;
}
import { Vector3 } from "./Vector3.js";
