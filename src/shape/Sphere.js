import { Vector3 } from "../Cubic.js";
import AABB from "../collision/AABB.js";
import Shape, { ShapeType } from "../core/Shape.js";

export default class Sphere extends Shape {
	/**
     * @constructor
     * @param {number} radius
     */
	constructor(radius = 0) {
		super({type: ShapeType.Sphere});
		this.params = {
			radius
		};
		this.radius = radius;
		this.updateAABB();
	}
	updateAABB() {
		const lengthVec = new Vector3(1,0,0).normalize().mulScalar(this.radius*1);
		this.AABB = new AABB(
			lengthVec.negated(),
			lengthVec
		);
	}
}