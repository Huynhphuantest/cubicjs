import { Vector3 } from '../Cubic.js';
import { AABB } from '../collision/AABB.js';

/**
 * @readonly
 * @enum {number}
 */
export const ShapeType = {
	Box: 1,
	Sphere: 2,
	Plane: 4,
	Cylinder: 8,
	ConvexPolygon: 16,
	Trimesh: 32
};

export class Shape {
	/**
     * @param {object} params
     * @param {ShapeType} params.type
     */
	constructor ({
		type
	}) {
		this.type = type;
		this.parameters = {};
		this.AABB = new AABB(new Vector3(), new Vector3());
	}

	/** @abstract */
	updateBoundingSphereRadius () {
		throw new Error('Not implemented');
	}

	/** @abstract */
	updateAABB () {
		throw new Error('Not implemented');
	}
	/**
	 * @abstract
	 * @param {number} mass
	 * @returns {Vector3}
	 */
	// eslint-disable-next-line
	calculateInertia(mass) {
		throw new Error('Not Implemented');
	}
}
