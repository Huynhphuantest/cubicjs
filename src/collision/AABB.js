// eslint-disable-next-line no-unused-vars
import { Vector3 } from '../Cubic.js';

export class AABB {
	/**
     * @param {Vector3} lowerBound
     * @param {Vector3} upperBound
     */
	constructor (lowerBound, upperBound) {
		this.lowerBound = lowerBound;
		this.upperBound = upperBound;
	}

	/**
     * @param {AABB} aabb
     */
	extend (aabb) {
		this.lowerBound.x = Math.min(this.lowerBound.x, aabb.lowerBound.x);
		this.upperBound.x = Math.max(this.upperBound.x, aabb.upperBound.x);
		this.lowerBound.y = Math.min(this.lowerBound.y, aabb.lowerBound.y);
		this.upperBound.y = Math.max(this.upperBound.y, aabb.upperBound.y);
		this.lowerBound.z = Math.min(this.lowerBound.z, aabb.lowerBound.z);
		this.upperBound.z = Math.max(this.upperBound.z, aabb.upperBound.z);
	}

	/**
     * @param {AABB} aabb
     * @returns
     */
	overlaps (aabb) {
		const
			l1 = this.lowerBound;
		const u1 = this.upperBound;
		const l2 = aabb.lowerBound;
		const u2 = aabb.upperBound;

		//      l2        u2
		//      |---------|
		// |--------|
		// l1       u1

		const overlapsX = ((l2.x <= u1.x && u1.x <= u2.x) || (l1.x <= u2.x && u2.x <= u1.x));
		const overlapsY = ((l2.y <= u1.y && u1.y <= u2.y) || (l1.y <= u2.y && u2.y <= u1.y));
		const overlapsZ = ((l2.z <= u1.z && u1.z <= u2.z) || (l1.z <= u2.z && u2.z <= u1.z));

		return overlapsX && overlapsY && overlapsZ;
	}

	/**
     * @param {AABB} aabb
     * @returns
     */
	contains (aabb) {
		const
			l1 = this.lowerBound;
		const u1 = this.upperBound;
		const l2 = aabb.lowerBound;
		const u2 = aabb.upperBound;

		//      l2        u2
		//      |---------|
		// |---------------|
		// l1              u1

		return (
			(l1.x <= l2.x && u1.x >= u2.x) &&
            (l1.y <= l2.y && u1.y >= u2.y) &&
            (l1.z <= l2.z && u1.z >= u2.z)
		);
	}

	/**
     * @returns {AABB}
     */
	clone () {
		return new AABB(
			this.lowerBound.clone(),
			this.upperBound.clone()
		);
	}
}
