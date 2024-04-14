export class Box extends ConvexPolygon {
    /**
     * @constructor
     * @param {number|Vector3} width
     * @param {number} [height]
     * @param {number} [depth]
     */
    constructor(width: number | Vector3, height?: number | undefined, depth?: number | undefined);
    parameters: {
        width: number;
        height: number;
        depth: number;
    };
}
export type boxShape = {
    vertices: Vector3[];
    faces: Face[];
    axes: Vector3[];
};
import { ConvexPolygon } from "./ConvexPolygon.js";
import { Vector3 } from "../Cubic.js";
import { Face } from "../math/Face.js";
