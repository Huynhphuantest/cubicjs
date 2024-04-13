import { Vector3 } from "../Cubic.js";
import { AABB } from "../collision/AABB.js";
import { Shape, ShapeType } from "../core/Shape.js";

export class Sphere extends Shape {
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
		this.updateBoundingSphereRadius();
		this.updateAABB();
	}
	updateAABB() {
		const lengthVec = new Vector3(1,0,0).normalize().mulScalar(this.radius);
		this.AABB = new AABB(
			lengthVec.negated(),
			lengthVec
		);
	}
	/** */
	updateBoundingSphereRadius() {
		this.boundingSphereRadius = this.radius;
	}
	/**
	 * @param {number} mass 
	 * @returns {Vector3}
	 */
	calculateInertia(mass) {
		const I = 2.0 / 5.0 * mass * this.radius * this.radius;
		return new Vector3(I, I, I);
	}
}