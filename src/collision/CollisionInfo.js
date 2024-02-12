// eslint-disable-next-line no-unused-vars
import { Vector3 } from "../Cubic";

export default class CollisionInfo {
	/**
     * @constructor
     * @param {object} params
     * @param {Vector3[]} params.points
     * @param {Vector3} params.normal
     * @param {number} params.depth
     */
	constructor({points, normal, depth}) {
		this.points = points;
		this.normal = normal;
		this.depth = depth;
	}
}