import { Vector3 } from "../Cubic.js";
import AABB from "../collision/AABB.js";

/**
 * @readonly
 * @enum {number}
 */
export const ShapeType = {
	Box:1,
	Sphere:2,
	Plane:4,
	Trimesh:8
};

export default class Shape {
	/**
     * @param {object} params
     * @param {ShapeType} params.type
     * @param {number} [params.boundingSphereRadius]
     */
	constructor({
		type,
		boundingSphereRadius
	}) {
		this.type = type;
		this.parameters = {};
		this.boundingSphereRadius = boundingSphereRadius;
		this.AABB = new AABB(new Vector3(), new Vector3());
	}
	/**@abstract */
	updateBoundingSphereRadius() {
		throw new Error("Not implemented");
	}
	/**@abstract */
	updateAABB() {
		throw new Error("Not implemented");
	}
}