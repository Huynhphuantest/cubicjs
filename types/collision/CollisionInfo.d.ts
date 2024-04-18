export class CollisionInfo {
    /**
     * @constructor
     * @param {object} params
     * @param {Vector3[]} params.points
     * @param {Vector3} params.normal
     * @param {number} params.penetration
     */
    constructor({ points, normal, penetration }: {
        points: Vector3[];
        normal: Vector3;
        penetration: number;
    });
    points: Vector3[];
    normal: Vector3;
    penetration: number;
}
import { Vector3 } from '../Cubic.js';
