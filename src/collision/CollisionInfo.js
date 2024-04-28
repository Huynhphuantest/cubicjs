// eslint-disable-next-line no-unused-vars
import { Vector3 } from '../Cubic.js';

export class CollisionInfo {
	/**
     * @constructor
     * @param {object} params
     * @param {Vector3[]} params.points
     * @param {Vector3} params.normal
     * @param {number} params.penetration
     */
	constructor ({ points, normal, penetration }) {
		this.points = points;
		this.normal = normal;
		this.penetration = penetration;
	}
}
