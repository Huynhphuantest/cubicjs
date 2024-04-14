export class ConvexPolygon extends Shape {
    /**
     * @constructor
     * @param {object} params
     * @param {number} params.type
     * @param {Vector3[]} params.vertices
     * @param {Face[]} params.faces
     * @param {Vector3[]} params.axes
     */
    constructor({ type, vertices, faces, axes, }: {
        type: number;
        vertices: Vector3[];
        faces: Face[];
        axes: Vector3[];
    });
    vertices: Vector3[];
    faces: Face[];
    axes: Vector3[];
    needVerticesUpdate: boolean;
    /**
     * NOTE: This is an memoized function
     * @returns {Vector3}
     */
    getFurthestVertex(): Vector3;
    /**
     * NOTE: This is an memoized function
     * @returns {Vector3}
     */
    getNearestVertex(): Vector3;
    /**
     * This method is used for GJK
     * @param {Vector3} direction
     * @returns {Vector3}
     */
    getFurthestVertexInDirection(direction: Vector3): Vector3;
    boundingSphereRadius: number | undefined;
}
import { Shape } from "../core/Shape.js";
import { Vector3 } from "../Cubic.js";
import { Face } from "../math/Face.js";
