/* eslint no-unused-vars: 0 */

import { Vector3 } from "../../Cubic.js";
import ConvexPolygon from "../../shape/ConvexPolygon.js";
import { Body } from "../../Cubic.js";

/**
 * @typedef CollisionResult
 * @property {null | CollisionInfo} info
 */
export class CollisionInfo {
	/**
     * @constructor
     * @param {object} params
     * @param {Vector3} params.point
     * @param {Vector3} params.normal
     * @param {number} params.depth
     */
	constructor({point, normal, depth}) {
		this.point = point;
		this.normal = normal;
		this.depth = depth;
	}
}

/**
 * This interface define what every 
 * collision detection algorithm should have.
 * @interface
 */
export default function CollisionDetectionAlgorithm() {}
/**
 * @param {ConvexPolygon} a
 * @param {ConvexPolygon} b
 * @param {Body} objA
 * @param {Body} objB
 * @returns {CollisionResult}
 */
CollisionDetectionAlgorithm.prototype.isColliding = function(a, b, objA, objB) {
	throw Error("Not implemented");
};