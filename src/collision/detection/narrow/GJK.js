import { Vector3 } from "../../../Cubic.js";
// eslint-disable-next-line no-unused-vars
import ConvexPolygon from "../../../shape/ConvexPolygon.js";
// eslint-disable-next-line no-unused-vars
import CollisionDetectionAlgorithm from "./NarrowPhase.js";
// eslint-disable-next-line no-unused-vars
import CollisionInfo from "../../CollisionInfo.js";
// eslint-disable-next-line no-unused-vars
import { Body } from "../../../Cubic.js";

/**
 * @typedef {import("./NarrowPhase.js").CollisionResult} CollisionResult
 */
// Simplex Type ( Imma not use class nor array here)
/**
  * @typedef Simplex
  * @property {number} length
  * @property {Array<Vector3>} vertices
  * @property {Function} push
  */

/**
 * @implements CollisionDetectionAlgorithm
 */
class GJKAlgorithim {
	/**
     * @param {ConvexPolygon} a 
     * @param {ConvexPolygon} b
	 * @param {Body} pa
     * @param {Body} pb
     * @returns {CollisionResult}
     */
	isColliding(a, b, pa, pb) {
		/**
		 * TODO: Complete the GJK Algorithm
		 */
		const direction = new Vector3(0,0,1);
		direction.cross(a.aces[0]);
		direction.cross(b.aces[0]);
		return {
			info: null
		};
	}
	/**
     * @param {ConvexPolygon} a
     * @param {ConvexPolygon} b
     * @param {Vector3} direction
     */
	support(a, b, direction) {
		// A.furthest(in direction) - B.furthest(in -direction)
		return (
			a.getFurthestVertexInDirection(direction)
				.sub(
					b.getFurthestVertexInDirection(
						direction.negated()
					)
				)
		);
	}
	/**
     * @param {Simplex} simplex
     * @param {Vector3} direction
     * @returns {boolean}
     */
    
}

const GJK = new GJKAlgorithim();
export default GJK;