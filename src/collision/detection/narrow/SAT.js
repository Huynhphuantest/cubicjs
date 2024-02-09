import { Vector3 } from "../../../Cubic.js";
// eslint-disable-next-line no-unused-vars
import ConvexPolygon from "../../../shape/ConvexPolygon.js";
// eslint-disable-next-line no-unused-vars
import CollisionDetectionAlgorithm, { CollisionInfo } from "../CollisionDetectionAlgorithm.js";
// eslint-disable-next-line no-unused-vars
import { Body } from "../../../Cubic.js";

/**
 * @typedef {import("../CollisionDetectionAlgorithm.js").CollisionResult} CollisionResult
 */

/**
 * @typedef MinMax
 * @property {number} min
 * @property {number} max
*/

/**
 * @implements CollisionDetectionAlgorithm
 */
class SATAlgorithim {
	/**
     * @param {ConvexPolygon} a
     * @param {ConvexPolygon} b
     * @param {Body} objA
     * @param {Body} objB
     * @returns {CollisionResult}
     */
	isColliding(a, b, objA, objB) {
        let axis = this.seperatingAxis(a, b, objA, objB);
        if(axis === null) axis = this.seperatingAxis(b, a, objB, objA);
        if(axis !== null) {
            return {
                info: new CollisionInfo({
                    normal: axis,
                    depth: NaN,
                    point: new Vector3()
                })
            };
        }
        return {
            info: null
        };
	}
    /**
     * @param {ConvexPolygon} a
     * @param {ConvexPolygon} b
     * @param {Body} objA
     * @param {Body} objB
     * @returns {null | Vector3}
     */
    seperatingAxis(a, b, objA, objB) {
        for(const axis of a.aces) {
            let { min: minA, max: maxA} = this.findMinMaxOfAxis(a.vertices, objA, axis);
            let { min: minB, max: maxB} = this.findMinMaxOfAxis(b.vertices, objB, axis);
            
            if(minA > minB && minA < maxB) return axis;
            if(maxA > minB && maxA < maxB) return axis;
        }
        return null;
    }
    /**
     * @param {Vector3[]} a
     * @param {Body} obj
     * @param {Vector3} axis
     * @returns {MinMax}
     */
    findMinMaxOfAxis(a, obj, axis) {
        let min =  Infinity;
        let max = -Infinity;
        for(const v of a) {
            const dot = (v.clone().applyQuaternion(obj.quaternion).add(obj.position)).dot(axis);
            if(dot < min) min = dot;
            if(dot > max) max = dot;
        }
        return {
            min,
            max
        };
    }
}

const SAT = new SATAlgorithim();
export default SAT;