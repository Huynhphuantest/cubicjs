export class AABB {
    /**
     * @param {Vector3} lowerBound
     * @param {Vector3} upperBound
     */
    constructor(lowerBound: Vector3, upperBound: Vector3);
    lowerBound: Vector3;
    upperBound: Vector3;
    /**
     * @param {AABB} aabb
     */
    extend(aabb: AABB): void;
    /**
     * @param {AABB} aabb
     * @returns
     */
    overlaps(aabb: AABB): boolean;
    /**
     * @param {AABB} aabb
     * @returns
     */
    contains(aabb: AABB): boolean;
    /**
     * @returns {AABB}
     */
    clone(): AABB;
}
import { Vector3 } from '../Cubic.js';
